import React, { useEffect, useState } from 'react'
import BookShow from './components/BookShow'
import { Book } from './context/books'
import BookCreate from './components/BookCreate'
import BookList from './components/BookList'
import useBooksContext from './hooks/useBooksContext'

function App() {
  const { fetchBooks } = useBooksContext()

  //NO hacer esto, muy grave, llamados infinitos
  // fetchBooks()

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <div className="app">
      <h1>Book List</h1>
      <BookList />
      <BookCreate />
    </div>
  )
}

export default App
