# React Supabase Blog

A simple blog application built with React (v19), TypeScript, Redux Toolkit, Supabase, React Router, Tailwind CSS, and DaisyUI. Users can register, log in, create/edit/delete blog posts, and view posts with pagination. Only authors can edit or delete their own posts.

## Features

- **User Authentication**: Registration, Login, and Logout using Supabase Auth.
- **Blog CRUD**: Create, Read, Update, and Delete blog posts.
- **Pagination**: Listing blog posts with configurable page size.
- **Author Byline**: Display author names fetched from a `profiles` table.
- **Styling**: Responsive and utility-first design using **Tailwind CSS** and **DaisyUI** components.
- **Row-Level Security** (Supabase):

  - Any authenticated user can read all posts.
  - Only the author can update or delete their own posts.

- **Form Validation**: Registration form validates required fields and password confirmation.
- **Protected Routes**: Public-only and private-only routes with redirects.
- **Deployment-ready**: Can be deployed to Vercel, Netlify, or any static hosting.

## Tech Stack

- **React v19** with Functional Components and Hooks
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Router v6** for routing
- **Supabase** for backend (Auth, Database, and RLS)
- **Vite** (or Create React App) to scaffold the project
- **Tailwind CSS** for utility-first styling
- **DaisyUI** for pre-built, themeable UI components

## Project Structure

```
src/
├── App.tsx                  # Main application and routing setup
├── main.tsx                 # React root (entry point)
├── store/store.ts           # Redux store configuration
├── slices/                  # Redux slices
│   ├── authSlice.ts         # Authentication state and reducers
│   └── blogsSlice.ts        # Blog list and single-post state
├── services/                # API and Supabase integration
│   ├── supabaseClient.ts    # Initialize Supabase client
│   ├── authService.ts       # signUp, signIn, signOut, onAuthStateChange
│   └── blogService.ts       # fetchBlogs, fetchBlogById, create/update/delete
├── pages/                   # React pages (views)
│   ├── RegistrationPage.tsx
│   ├── LoginPage.tsx
│   ├── BlogListPage.tsx
│   ├── BlogViewPage.tsx
│   ├── CreateBlogPage.tsx
│   └── UpdateBlogPage.tsx
├── components/              # Reusable UI components (e.g., NavBar)
├── styles/                  # Tailwind CSS configuration and styles
│   ├── tailwind.config.js   # Tailwind configuration
│   └── index.css            # Tailwind base imports
└── index.css                # Global styles (imports Tailwind)
```

## Prerequisites

- **Node.js** (v16 or higher) and **npm** or **yarn** installed
- A **Supabase** account and project

## Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd react-supabase-blog
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a Supabase project**

   - Navigate to [https://app.supabase.io](https://app.supabase.io) and create a new project.
   - In the **SQL Editor**, run migrations to create required tables:

     ```sql
     -- 1. Create blogs table
     create table public.blogs (
       id uuid default uuid_generate_v4() primary key,
       title text not null,
       content text not null,
       author_id uuid references auth.users(id) on delete cascade,
       created_at timestamp with time zone default now()
     );

     -- 2. Create profiles table
     create table public.profiles (
       id uuid primary key references auth.users(id) on delete cascade,
       display_name text not null,
       created_at timestamp with time zone default now()
     );

     -- Enable RLS on blogs table
     alter table public.blogs enable row level security;
     create policy "Authenticated can read blogs"
       on public.blogs for select to authenticated using (true);
     create policy "Insert own blog"
       on public.blogs for insert to authenticated with check (author_id = auth.uid());
     create policy "Update own blog"
       on public.blogs for update to authenticated using (author_id = auth.uid());
     create policy "Delete own blog"
       on public.blogs for delete to authenticated using (author_id = auth.uid());

     -- Enable RLS on profiles table
     alter table public.profiles enable row level security;
     create policy "Authenticated can read any profile"
       on public.profiles for select to authenticated using (true);
     create policy "Insert own profile"
       on public.profiles for insert to authenticated with check (auth.uid() = id);
     create policy "Manage own profile"
       on public.profiles for update, delete to authenticated using (auth.uid() = id);
     ```

   - Go to **Authentication → Settings → External OAuth Providers** or **Email/Password**: ensure email confirmation is disabled (for instant sign-up).

4. **Configure environment variables**

   - Create a `.env` file in the project root:

     ```ini
     VITE_SUPABASE_URL=https://<your-supabase-project>.supabase.co
     VITE_SUPABASE_ANON_KEY=<your-anon-key>
     ```

   - Replace `<your-supabase-project>` and `<your-anon-key>` with your Supabase project URL and anon key.

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   - The app will be available at `http://localhost:3000` (or as specified by the terminal).

## Usage

1. **Register a new user**

   - Navigate to `/register`, fill out Name, Email, Password, and Confirm Password.
   - Upon success, you’ll be redirected to the Blog List page.

2. **Log in**

   - Navigate to `/login`, enter your credentials, and access the protected blog area.
   - If invalid, an error message appears.

3. **Create a new blog post**

   - Click “New Blog” icon in the navigation bar.
   - Enter a Title and Content, then click **Create** to save.
   - You’ll be redirected back to the list where your post appears.

4. **View a blog post**

   - On the Blog List page, click the post title or “View” link (if implemented).
   - The full post, author byline, timestamp, and content display.

5. **Edit or Delete a blog post**

   - If you are the author, you will see an **Edit** button/link on the post view.
   - Modify Title or Content, then save changes.
   - To delete, click **Delete** (if implemented in the edit page or via a separate button).

6. **Pagination**

   - Use **Previous** and **Next** buttons at the bottom of the list to navigate pages.

7. **Logout**

   - Click **Logout** in the navigation bar. A confirmation message displays before redirect.

## Deployment

You can deploy this project to any static hosting service (e.g., Vercel, Netlify, Cloudflare Pages). Below are steps for Vercel:

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import Project to Vercel**

   - Go to [https://vercel.com/new](https://vercel.com/new) and pick your GitHub repository.
   - In the **Environment Variables** section, add:

     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

   - Vercel will auto-detect the Vite/React build settings. Click **Deploy**.

3. **Update Supabase Redirect URLs** (if using OAuth)

   - In Supabase Console under **Authentication → Settings → Redirect URLs**, add your deployed domain (e.g., `https://your-app.vercel.app`).

4. **Production Build**

   - Vercel automatically runs `npm run build` and serves the `dist` folder.

## Scripts

- `npm run dev` – Start development server (Vite)
- `npm run build` – Create a production build
- `npm run preview` – Preview the production build locally

## Environment Variables

- `VITE_SUPABASE_URL` – Your Supabase project URL (e.g., `https://xyz.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` – Your Supabase anon public API key
