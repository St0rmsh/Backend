import {createBrowserRouter} from "react-router-dom"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import DashBoard from "../features/auth/components/DashBoard"





export const router = createBrowserRouter([
     {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path:"/",
        element:<DashBoard/>
    }
])