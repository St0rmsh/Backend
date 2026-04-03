import { createBrowserRouter } from "react-router-dom";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import VerifyOTP from "../features/auth/pages/VerifyOTP";

import Layout from "../features/Yt_Clone/components/layout/Layout";
import Home from "../features/Yt_Clone/pages/Home";
import VideoPages from "../features/Yt_Clone/pages/VideoPages";
import Dashboard from "../features/Yt_Clone/pages/Dashboard";
import ChannelPage from "../features/Yt_Clone/pages/ChannelPage";
import Error from "../features/Yt_Clone/components/layout/Error";
import Protected from "../features/auth/components/Protected"; // ✅ IMPORTANT

export const router = createBrowserRouter([

  // 🔓 PUBLIC AUTH ROUTES
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/verify-otp",
    element: <VerifyOTP />
  },

  // 🌐 MAIN APP
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "video/:id", element: <VideoPages /> },
    ],
  },

  // 🔒 PROTECTED ROUTE (Studio)
  {
    path: "/studio",
    element: (
      <Protected>
        <Layout />
      </Protected>
    ),
    children: [
      { index: true, element: <Dashboard /> }
    ],
  },

  // 📺 CHANNEL
  {
    path: "/channel/:handle",
    element: <ChannelPage />
  },
  {
    path:"*",
    element:<Error/>
  }

]);
