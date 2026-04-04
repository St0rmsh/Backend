import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes.jsx";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";



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
if (loading) return <Loader />
  

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
