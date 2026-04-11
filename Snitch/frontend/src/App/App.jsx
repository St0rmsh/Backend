import './App.css'
import { router } from './app.routes.jsx'
import { RouterProvider } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getMe } from '../features/auth/services/api.service'
import { setUser } from '../features/auth/state/auth.slice'

function App() {
  const dispatch = useDispatch();
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const data = await getMe();
        if (data && data.user) {
          dispatch(setUser(data.user));
        }
      } catch (error) {
        // Silent catch for hydration failures
      } finally {
        setHydrating(false);
      }
    };
    hydrate();
  }, [dispatch]);

  if (hydrating) {
    return (
      <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00f0ff]/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#7000ff]/10 blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1 className="text-4xl font-black italic text-[#E5E2E1] tracking-[-0.04em] animate-pulse">SNITCH</h1>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

