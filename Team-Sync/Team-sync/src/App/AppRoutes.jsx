import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import RegistrationPage from '../features/auth/UI/Pages/RegistrationPage'
import LoginPage from '../features/auth/UI/Pages/LoginPage'
import Dashboard from './layout/Dashboard'
import AuthLayout from './layout/AuthLayout'
import Home from '../features/dashboard/UI/Page/Home'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { currentLoggedInEmployee } from '../features/auth/state/auth/authAction'
import PublicRoutes from './Protected/PublicRoutes'
import ProtectedRoute from './Protected/ProtectedRoute'


const AppRoutes = () => {

  const dispatch = useDispatch();

  useEffect(()=>{
    (()=>{
      dispatch(currentLoggedInEmployee())
      console.log("dispatch me");
      
    })()

  },[])

  const router = createBrowserRouter([
    {
      path:"/",
      element:<PublicRoutes/>,
      children:[
        {
          element:<AuthLayout/>,
          children:[
            {
              path:"/login",
              element:<LoginPage/>
            },
            {
              path:"/register",
              element:<RegistrationPage/>
            }
          ]
        }
      ]
    },
    {
      path:"/home",
      element:<ProtectedRoute/>,
      children:[
        {
          element:<Dashboard/>,
          children:[
            {
              path:"",
              element:<Home/>
            }
          ]
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default AppRoutes