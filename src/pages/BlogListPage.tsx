import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchBlogs } from "../services/blogService";
import {
  setBlogs,
  setPage,
  setBlogsLoading,
  setBlogsError,
} from "../slices/blogSlice";
import { Link } from "react-router-dom";

const BlogListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, page, pageSize, total, isLoading, error } = useAppSelector(
    (state) => state.blogs
  );
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
          {list.map((post) => (
            <li key={post.id}>
              <Link to={`/blogs/${post.id}`}>{post.title}</Link>
              <p>{new Date(post.created_at).toLocaleDateString()}</p>
            </li>
          ))}
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
