import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Blog {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
}

interface BlogState {
  list: Blog[];
  currentPost: Blog | null;
  page: number;
  pageSize: number;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  list: [],
  currentPost: null,
  page: 1,
  pageSize: 10,
  total: 0,
  isLoading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setBlogs(state, action: PayloadAction<{ posts: Blog[]; total: number }>) {
      state.list = action.payload.posts;
      state.total = action.payload.total;
    },
    setCurrentPost(state, action: PayloadAction<Blog | null>) {
      state.currentPost = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setBlogs,
  setCurrentPost,
  setPage,
  setLoading: setBlogsLoading,
  setError: setBlogsError,
} = blogSlice.actions;

export default blogSlice.reducer;
