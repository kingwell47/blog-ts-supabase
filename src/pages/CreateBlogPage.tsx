import React, { useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setBlogsLoading, setBlogsError } from "../slices/blogSlice";
import { createBlog } from "../services/blogService";
import { useNavigate, Link } from "react-router-dom";

const CreateBlogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.blogs);
  const navigate = useNavigate();

  // Local States
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(setBlogsLoading(true));
    dispatch(setBlogsError(null));
    try {
      await createBlog({ title, content });
      navigate("/blogs");
    } catch (err: unknown) {
      let message = "Failed to create blog. Please try again.";
      if (err instanceof Error) message = err.message;
      dispatch(setBlogsError(message));
    } finally {
      dispatch(setBlogsLoading(false));
    }
  };

  return (
    <div className="md:w-5xl">
      <form onSubmit={handleSubmit} className="card">
        <h1 className="text-center text-2xl text-secondary-content">
          Create New Post
        </h1>
        <div className="card-body">
          <label htmlFor="title" className="label">
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input w-full"
          />
          <label htmlFor="content" className="label">
            Content:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className="textarea w-full"
          />
          <div className="card-actions flex justify-between">
            {error && <p className="text-error">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || !title || !content}
              className="btn btn-primary"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
            <Link to="/blog" className="btn btn-error text-secondary-content">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPage;
