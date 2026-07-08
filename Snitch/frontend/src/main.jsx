import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App/App'
import { store } from './App/store'
import { Provider } from 'react-redux'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import LenisProvider from './components/LenisProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <WishlistProvider>
          <CartProvider>
            <LenisProvider>
              <App />
            </LenisProvider>
          </CartProvider>
        </WishlistProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
