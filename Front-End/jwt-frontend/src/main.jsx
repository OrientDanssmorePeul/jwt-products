import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './App.css'
import Login from './Login.jsx'
import Products from './Products.jsx'
import AddProduct from './AddPage.jsx'
import EditProduct from './EditPage.jsx'


createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/products' element={<Products/>}/>
      <Route path='/add-products' element={<AddProduct/>}/>
      <Route path='/edit-products' element={<EditProduct/>}/>
    </Routes>
  </BrowserRouter>
)
