import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App/App.jsx'
import { Provider } from 'react-redux'
import store from './App/store.jsx'
import AppRoutes from './App/AppRoutes.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <AppRoutes/>
    </Provider>
  </StrictMode>,
)
