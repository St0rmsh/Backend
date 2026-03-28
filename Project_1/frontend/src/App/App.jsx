import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes.jsx";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";



function App() {

const { handleGetMe } = useAuth();
const { loading } = useSelector((state) => state.auth);

useEffect(() => {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
}, []);
 
useEffect(() => {
  handleGetMe();
}, []);

  // ⏳ Global loader during hydration
 if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-xl">
      Loading app...
    </div>
  );
}
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
