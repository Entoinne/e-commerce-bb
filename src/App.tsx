import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import Log from './Pages/Log'
import Menu from './Components/Menu'
import SingIn from './Pages/SignIn'
import Profile from './Pages/Profile'
import Products from './Pages/Products'

import Cart from './Pages/Cart'
import Orders from './Pages/Order'

function App() {

  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/log" element={<Log />} />
        <Route path="/signIn" element={<SingIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
