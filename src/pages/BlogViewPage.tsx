import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
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

  useEffect(() => {
    if (!id) return;
    dispatch(setBlogsLoading(true));
    dispatch(setBlogsError(null));
    fetchBlogById(id)
      .then((post) => dispatch(setCurrentPost(post)))
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

  return (
    <div>
      <h1>{currentPost.title}</h1>
      <p>{new Date(currentPost.created_at).toLocaleString()}</p>
      <div>{currentPost.content}</div>
      <Link to={`/blogs/${currentPost.id}/edit`}>Edit</Link> |{" "}
      <Link to="/blogs">Back to list</Link>
    </div>
  );
};

export default BlogViewPage;
