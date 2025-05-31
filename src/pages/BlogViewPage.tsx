import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { supabase } from "../services/supabaseClient";
import { fetchBlogById } from "../services/blogService";
import {
  setCurrentPost,
  setBlogsLoading,
  setBlogsError,
} from "../slices/blogSlice";

const BlogViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentPost, isLoading, error } = useAppSelector(
    (state) => state.blogs
  );
  const user = useAppSelector((state) => state.auth.user);
  const [authorName, setAuthorName] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    dispatch(setBlogsLoading(true));
    dispatch(setBlogsError(null));
    fetchBlogById(id)
      .then((post) => {
        dispatch(setCurrentPost(post));
        return supabase
          .from("profiles")
          .select("display_name")
          .eq("id", post.author_id)
          .single();
      })
      .then(({ data, error }) => {
        if (error) {
          console.warn("Failed to fetch author profile", error.message);
          setAuthorName(null);
        } else {
          setAuthorName(data.display_name ?? null);
        }
      })
      .catch((err: unknown) => {
        let message = "Failed to load blog.";
        if (err instanceof Error) message = err.message;
        dispatch(setBlogsError(message));
      })
      .finally(() => dispatch(setBlogsLoading(false)));
  }, [dispatch, id]);

  if (isLoading) return <div className="skeleton h-64 w-full md:w-5xl" />;
  if (error) return <p className="text-error">{error}</p>;
  if (!currentPost) return <p>No blog found.</p>;

  // Check if current user is also the author
  const isAuthor = user?.id === currentPost.author_id;

  const date = new Date(currentPost.created_at);
  const formatted = date.toLocaleString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="md:w-5xl">
      <h1 className="text-center text-2xl text-primary-content">
        {currentPost.title}
      </h1>
      <p className="text-center italic text-primary-content/50 my-1">
        By {authorName ?? currentPost.author_id}
      </p>
      <p className="text-center mb-1">{formatted}</p>
      <div className="indent-10">{currentPost.content}</div>
      <div className="text-center mt-2">
        {isAuthor && (
          <>
            <Link
              to={`/blogs/${currentPost.id}/edit`}
              className="link text-lg text-primary-content/50"
            >
              Edit/Delete
            </Link>{" "}
            |{" "}
          </>
        )}
        <Link to="/blogs" className="link text-lg text-primary-content/50">
          Back to list
        </Link>
      </div>
    </div>
  );
};

export default BlogViewPage;
