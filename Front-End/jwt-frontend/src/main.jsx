import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './App.css'
import Login from './Login.jsx'
import Products from './Products.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/products' element={<Products/>}/>
    </Routes>
  </BrowserRouter>
)
