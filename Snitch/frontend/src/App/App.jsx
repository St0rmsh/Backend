import './App.css'
import {router} from './app.routes.jsx'
import { RouterProvider } from 'react-router-dom'

function App() {

  return (
    <>
    <RouterProvider router={router} />
    </>
    
  )
}

export default App
