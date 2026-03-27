import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes.jsx";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";



function App() {

   const { handleGetMe } = useAuth();
  const { loading } = useSelector((state) => state.auth);

 

    useEffect(() => {
    handleGetMe();
  }, []);

  // ⏳ Global loader during hydration
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
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
