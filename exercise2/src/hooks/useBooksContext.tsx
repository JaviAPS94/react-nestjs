import { useContext } from "react"
import BooksContext, { Book } from "../context/books"

function useBooksContext() {
  return useContext(BooksContext)
}

export default useBooksContext
