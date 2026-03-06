import {createBrowserRouter} from "react-router"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"
import FaceExpression from "./features/Expression/components/FaceExpression"
import Protected from "./features/auth/components/Protected"
import Home from "./features/Expression/Home/pages/Home"

export const router = createBrowserRouter([

    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/",
        element:<Protected><Home/></Protected>
    
    }
])



