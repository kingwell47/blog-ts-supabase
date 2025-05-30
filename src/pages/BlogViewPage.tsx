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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!currentPost) return <p>No blog found.</p>;

  const isAuthor = user?.id === currentPost.author_id;
  return (
    <div>
      <h1>{currentPost.title}</h1>
      <p style={{ fontStyle: "italic", color: "#555", margin: "0.5rem 0" }}>
        By {authorName ?? currentPost.author_id}
      </p>
      <p>{new Date(currentPost.created_at).toLocaleString()}</p>
      <div>{currentPost.content}</div>
      {isAuthor && (
        <>
          <Link to={`/blogs/${currentPost.id}/edit`}>Edit</Link> |{" "}
        </>
      )}
      <Link to="/blogs">Back to list</Link>
    </div>
  );
};

export default BlogViewPage;
