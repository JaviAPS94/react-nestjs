import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { Provider } from './context/books'

ReactDOM.render(
  <React.StrictMode>
    {/* en esta parte vamos a tener nuestro contexto (Provider) que envuelve al componte padre App y por ende cualquier componente hijo automaticamente puede acceder a los elementos que tengamos definidos en ese contexto */}
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
