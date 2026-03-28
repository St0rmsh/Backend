import { createBrowserRouter } from "react-router-dom";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import VerifyOTP from "../features/auth/pages/VerifyOTP";

import Protected from "../features/auth/components/Protected";

// Layout + Pages
import Layout from "../features/Yt_Clone/components/layout/Layout";
import Home from "../features/Yt_Clone/pages/Home";
import VideoPages from "../features/Yt_Clone/pages/VideoPages";
import Dashboard from "../features/Yt_Clone/pages/Dashboard";



// {
//     path: "/verify-otp",
//     element: <VerifyOTP />
//   }

export const router = createBrowserRouter([
  // Public
  { path: "/", element: <Layout />, children: [
      { index: true, element: <Home /> },
      { path: "video/:id", element: <VideoPages /> },
     { path: "/verify-otp", element: <VerifyOTP /> },
  ]},
   

  // Creator Studio (Protected)
   { path: "/studio", element: <Layout />, children: [
      { index: true, element: <Dashboard /> },
  ]},
]);

