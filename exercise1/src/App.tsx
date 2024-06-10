import './App.css'

import React, { useState } from 'react'
import ProductShow from './ProductShow'


const getRandomProduct = () => {
  const products = ['cellphone', 'computer', 'keyboard', 'printer', 'screen']
  return products[Math.floor(Math.random() * products.length)]
}

function App() {
  const [products, setProducts] = useState<string[]>([])

  const handleClick = () => {
    //products.push(getRandomProduct())
    setProducts([...products, getRandomProduct()])
  }

  //['phone', 'computer', 'keyboard', 'printer', 'screen']
  const renderedProducts = products.map((product, index) => {
    return <ProductShow key={index} type={product} />
  })

  return (
    <div className="app">
      <button onClick={handleClick}>Add Product</button>
      <div className="product-list">{renderedProducts}</div>
    </div>
  )
}

export default App
