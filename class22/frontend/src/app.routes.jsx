import {createBrowserRouter} from "react-router-dom"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Feed from "./features/post/pages/Feed"
import CreatePosts from "./features/post/pages/CreatePosts"
import Protected from "./features/auth/components/Protected"
import UserPage from "./features/post/pages/UserPage"


export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
       element:<Protected><Feed/></Protected>

    },
    {
        path:"/createPost",
        element:<CreatePosts/>
    },
    {
        path:"/profile",
        element:<Protected><UserPage/></Protected>
    }
])