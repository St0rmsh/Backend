import {createBrowserRouter} from "react-router-dom"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import DashBoard from "../features/auth/components/DashBoard"
import VerifyOTP from "../features/auth/pages/VerifyOTP"
import Protected from "../features/auth/components/Protected"





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
        element:<Protected><DashBoard/></Protected>
    },{
        path:"/verify-otp",
        element:<VerifyOTP/>
    }
])