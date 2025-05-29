import React, { useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setBlogsLoading, setBlogsError } from "../slices/blogSlice";
import { createBlog } from "../services/blogService";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Create New Blog</h1>
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPage;
