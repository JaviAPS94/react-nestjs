import './ProductShow.css'
import React, { useState } from "react"
import cellphone from "./images/cellphone.svg"
import computer from "./images/computer.svg"
import keyboard from "./images/keyboard.svg"
import printer from "./images/printer.svg"
import screen from "./images/screen.svg"
import heart from "./images/heart.svg"

// {
//   cellphone: cellphone,
//   computer: computer,
//   keyboard: keyboard,
//   printer: printer,
//   screen: screen,
// }
const svgMap: { [key: string]: string } = {
  cellphone,
  computer,
  keyboard,
  printer,
  screen,
}

interface ProductShowProps {
  type: keyof typeof svgMap
}

//Props como parámetros
const ProductShow: React.FC<ProductShowProps> = ({ type }) => {
  const [clicks, setClicks] = useState(0) //[valorVarible, funcionQueCambiaElValor]

  const handleClick = () => {
    setClicks(clicks + 1)
  }

  return (
    <div className="product-show" onClick={handleClick}>
      <img className="product" src={svgMap[type]} alt={type.toString()} />
      <img
        className="heart"
        src={heart}
        alt="heart"
        style={{ width: `${10 + 10 * clicks}px` }}
      />
    </div>
  )
}

export default ProductShow
