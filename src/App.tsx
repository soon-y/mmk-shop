import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Items from './pages/Items'
import ItemDetail from './pages/ItemDetail'
import Footer from './components/footer'
import Cart from './pages/Cart'
import Favorites from './pages/Favorites'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shopping/:categoryId" element={<Items />} />
        <Route path="/products/:productId" element={<ItemDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
