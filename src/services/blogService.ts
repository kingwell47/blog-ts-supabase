import { supabase } from "./supabaseClient";

type BlogData = { title: string; content: string };

type FetchRange = { from: number; to: number };

/**
 * Fetch a paginated list of blogs.
 * @param range - object with `from` and `to` indexes (0-based)
 * @returns array of blogs and total count
 */
export async function fetchBlogs(range: FetchRange) {
  const { data, error, count } = await supabase
    .from("blogs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(range.from, range.to);

  if (error) throw error;
  return { posts: data ?? [], total: count ?? 0 };
}

/**
 * Fetch a single blog by its ID.
 * @param id - blog UUID
 */
export async function fetchBlogById(id: string) {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new blog post.
 * @param blog - object containing title and content
 */
export async function createBlog(blog: BlogData) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) throw new Error("User not authenticated");

  const { data, error } = await supabase.from("blogs").insert({
    title: blog.title,
    content: blog.content,
    author_id: userData.user.id,
  });

  if (error) throw error;
  return data;
}

/**
 * Update an existing blog post.
 * @param id - blog UUID
 * @param blog - object containing title and content to update
 */
export async function updateBlog(id: string, blog: BlogData) {
  const { data, error } = await supabase
    .from("blogs")
    .update({ title: blog.title, content: blog.content })
    .eq("id", id);

  if (error) throw error;
  return data;
}

/**
 * Delete a blog post by its ID.
 * @param id - blog UUID
 */
export async function deleteBlog(id: string) {
  const { data, error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) throw error;
  return data;
}
