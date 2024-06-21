import axios from 'axios'
import React, { createContext, useState } from 'react'

// Definir el modelo del libro
export interface Book {
  id: number
  title: string
}

// Definir el modelo del contexto
interface BooksContextType {
  books: Book[]
  fetchBooks: () => Promise<void>
  deleteBookById: (id: number) => Promise<void>
  updateBookTitle: (id: number, title: string) => Promise<void>
  createBook: (title: string) => Promise<void>
}

// Creamos nuestro contexto con un valor inicial
const BooksContext = createContext<BooksContextType>({
  books: [],
  fetchBooks: async () => {},
  deleteBookById: async () => {},
  updateBookTitle: async () => {},
  createBook: async () => {},
})

//Definir los props de nuestro provider
interface ProviderProps {
  children: React.ReactNode
}

function Provider({ children }: ProviderProps) {
  // Definir el estado de los libros
  const [books, setBooks] = useState<Book[]>([])
  // Definir las funciones para interactuar con los libros
  const fetchBooks = async () => {
    const response = await axios.get('http://localhost:3003/books')
    setBooks(response.data)
  }

  const deleteBookById = async (id: number) => {
    await axios.delete(`http://localhost:3003/books/${id}`)
    const updatedBooks = books.filter((book) => book.id !== id)
    setBooks(updatedBooks)
  }

  const updateBookTitle = async (id: number, title: string) => {
    await axios.put(`http://localhost:3003/books/${id}`, { title })
    const updatedBooks = books.map((book) =>
      book.id === id ? { ...book, title } : book,
    )
    setBooks(updatedBooks)
  }

  const createBook = async (title: string) => {
    const response = await axios.post('http://localhost:3003/books', { title })
    // books.push(response.data) Incorrecto
    // Crear un nuevo arreglo con los libros anteriores y el nuevo libro
    setBooks([...books, response.data])
  }

  const valuesToShare: BooksContextType = {
    books,
    fetchBooks,
    deleteBookById,
    updateBookTitle,
    createBook,
  }

  return (
    <BooksContext.Provider value={valuesToShare}>
      {children}
    </BooksContext.Provider>
  )
}

export { Provider }
export default BooksContext
