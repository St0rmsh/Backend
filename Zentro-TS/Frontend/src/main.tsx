import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import { AppRouter } from './App/AppRouter'
import './styles/index.css'
import LenisProvider from './styles/lenis/LenisProvider'
import { registerSW } from "virtual:pwa-register";

registerSW({
    immediate:true,
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LenisProvider>
          <AppRouter />
        </LenisProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)

