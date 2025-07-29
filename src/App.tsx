import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/auth'
import { CartProvider } from './context/cart'
import { FavoritesProvider } from './context/favorites'
import Header from './components/Header'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Items from './pages/Items'
import ItemDetail from './pages/ItemDetail'
import Footer from './components/footer'
import Cart from './pages/Cart'
import Favorites from './pages/Favorites'
import Account from './pages/Account'
import Orders from './pages/Orders'
import Settings from './pages/Settings'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirm'
import OrderDetail from './pages/OrderDetail'

function App() {
  return (
    <>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shopping/:categoryId" element={<Items />} />
              <Route path="/products/:productId" element={<ItemDetail />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/order-confirm" element={<OrderConfirmation />} />
              <Route path="/account" element={<Account />}>
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:orderId" element={< OrderDetail />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
            <Footer />
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </>
  )
}

export default App
