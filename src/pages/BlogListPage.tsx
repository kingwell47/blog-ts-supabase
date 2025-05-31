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
    <div className="p-5">
      <h1 className="text-center text-2xl font-bold">Blog Posts</h1>
      {isLoading && <div className="skeleton h-32 w-full my-2" />}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!isLoading && !error && (
        <ul className="list bg-base-100 shadow-md">
          {list.map((post) => {
            const excerpt =
              post.content.length > EXCERPT_LENGTH
                ? post.content.slice(0, EXCERPT_LENGTH) + "..."
                : post.content;
            const date = new Date(post.created_at);
            const formatted = date.toLocaleString(undefined, {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
            return (
              <li key={post.id} className="list-row">
                <div className="card card-md bg-ghost text-primary-content w-full">
                  <h2 className="card-title">{post.title}</h2>
                  <p className="italic my-1">
                    By {authorNames[post.id] || post.author_id}
                  </p>
                  <p>
                    {excerpt}{" "}
                    <Link
                      to={`/blogs/${post.id}`}
                      className="link text-secondary-content"
                    >
                      Read more
                    </Link>
                  </p>
                  <small className="mt-0.5 italic">
                    Posted on:{" "}
                    <span className="text-secondary-content">{formatted}</span>
                  </small>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="btn btn-secondary"
        >
          Previous
        </button>
        <span className="text-sm text-secondary-content">
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
