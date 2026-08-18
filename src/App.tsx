import { Analytics } from '@vercel/analytics/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'
import { QrPage } from './pages/QrPage'
import { WhatsAppFloat } from './components/WhatsAppFloat'

export default function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <CartProvider>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <HomePage />
                <Footer />
                <WhatsAppFloat />
              </>
            }
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/qr" element={<QrPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
