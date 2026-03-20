import React ,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx'
import { CartProvider } from "./context/cartContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
    <Auth0Provider
       domain="dev-p07uojj1od8lerck.us.auth0.com"
      clientId="VuNd4CBnNIJ1MMrWNydhzpqRrls9b06D"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
    <App />
    </Auth0Provider>
    </CartProvider>
  </StrictMode>,
)
