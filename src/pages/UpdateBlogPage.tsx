import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchBlogById, updateBlog, deleteBlog } from "../services/blogService";
import {
  setCurrentPost,
  setBlogsLoading,
  setBlogsError,
} from "../slices/blogSlice";

const UpdateBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentPost, isLoading, error } = useAppSelector(
    (state) => state.blogs
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!id) return;
    dispatch(setBlogsLoading(true));
    dispatch(setBlogsError(null));
    fetchBlogById(id)
      .then((post) => {
        dispatch(setCurrentPost(post));
        setTitle(post.title);
        setContent(post.content);
      })
      .catch((err: unknown) => {
        let message = "Failed to load blog.";
        if (err instanceof Error) message = err.message;
        dispatch(setBlogsError(message));
      })
      .finally(() => dispatch(setBlogsLoading(false)));
  }, [dispatch, id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    dispatch(setBlogsLoading(true));
    dispatch(setBlogsError(null));
    try {
      await updateBlog(id, { title, content });
      navigate(`/blogs/${id}`);
    } catch (err: unknown) {
      let message = "Failed to update blog.";
      if (err instanceof Error) message = err.message;
      dispatch(setBlogsError(message));
    } finally {
      dispatch(setBlogsLoading(false));
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this blog?"))
      return;
    dispatch(setBlogsLoading(true));
    dispatch(setBlogsError(null));
    try {
      await deleteBlog(id);
      navigate("/blogs");
    } catch (err: unknown) {
      let message = "Failed to delete blog.";
      if (err instanceof Error) message = err.message;
      dispatch(setBlogsError(message));
    } finally {
      dispatch(setBlogsLoading(false));
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!currentPost) return <p>No blog found.</p>;

  return (
    <div>
      <h1>Edit Blog</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input input-primary"
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className="textarea textarea-primary"
          />
        </div>
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? "Updating..." : "Update"}
        </button>
      </form>
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="btn btn-error"
      >
        Delete
      </button>
      <Link to={currentPost ? `/blogs/${currentPost.id}` : "/blogs"}>
        Cancel
      </Link>
    </div>
  );
};

export default UpdateBlogPage;
