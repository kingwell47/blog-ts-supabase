import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { supabase } from "../services/supabaseClient";
import { fetchBlogs } from "../services/blogService";
import {
  setBlogs,
  setPage,
  setBlogsLoading,
  setBlogsError,
} from "../slices/blogSlice";
import { Link } from "react-router-dom";

const EXCERPT_LENGTH = 100;

const BlogListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, page, pageSize, total, isLoading, error } = useAppSelector(
    (state) => state.blogs
  );
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});

  // Calculate range for current page
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const totalPages = Math.ceil(total / pageSize) || 1;

  useEffect(() => {
    const load = async () => {
      dispatch(setBlogsLoading(true));
      dispatch(setBlogsError(null));
      try {
        const { posts, total: count } = await fetchBlogs({ from, to });
        dispatch(setBlogs({ posts, total: count }));
      } catch (err: unknown) {
        let message = "Failed to load blogs";
        if (err instanceof Error) message = err.message;
        dispatch(setBlogsError(message));
      } finally {
        dispatch(setBlogsLoading(false));
      }
    };
    load();
  }, [dispatch, from, to]);

  // Fetch author names for each post
  useEffect(() => {
    async function loadAuthors() {
      const names: Record<string, string> = {};
      await Promise.all(
        list.map(async (post) => {
          const { data, error: profileError } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", post.author_id)
            .single();
          names[post.id] =
            profileError || !data?.display_name
              ? post.author_id
              : data.display_name;
        })
      );
      setAuthorNames(names);
    }
    if (list.length) loadAuthors();
  }, [list]);

  const handlePrev = () => {
    if (page > 1) dispatch(setPage(page - 1));
  };
  const handleNext = () => {
    if (page < totalPages) dispatch(setPage(page + 1));
  };

  return (
    <div>
      <h1>Blog Posts</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!isLoading && !error && (
        <ul>
          {list.map((post) => {
            const excerpt =
              post.content.length > EXCERPT_LENGTH
                ? post.content.slice(0, EXCERPT_LENGTH) + "..."
                : post.content;
            return (
              <li key={post.id}>
                <h2>
                  <Link to={`/blogs/${post.id}`}>{post.title}</Link>
                </h2>
                <p style={{ fontStyle: "italic", margin: "0.25rem 0" }}>
                  By {authorNames[post.id] || post.author_id}
                </p>
                <p style={{ fontStyle: "italic" }}>{excerpt}</p>
                <small>{new Date(post.created_at).toLocaleDateString()}</small>
              </li>
            );
          })}
        </ul>
      )}
      <div>
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="btn btn-secondary"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogListPage;
