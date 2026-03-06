import { RouterProvider } from 'react-router'
import { router } from './App.router'
import { AuthProvider } from './features/auth/auth.context'
import { SongProvider } from './features/Expression/Home/Song.context'

function App() {

  return (
    
    <AuthProvider>
      <SongProvider>
          <RouterProvider router={router}/>
      </SongProvider>
    </AuthProvider>
  
  )
}

export default App
