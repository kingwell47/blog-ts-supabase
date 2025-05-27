import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  return (
    <>
      <div>
        <h1 className="text-4xl text-center text-primary">Hello World!</h1>
      </div>
    </>
  );
}

export default App;
