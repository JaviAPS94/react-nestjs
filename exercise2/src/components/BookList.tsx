import React from "react"
import useBooksContext from "../hooks/useBooksContext"
import { Book } from "../context/books"
import BookShow from "./BookShow"

function BookList() {
  const { books } = useBooksContext()

  const renderedBooks = books.map((book: Book) => {
    return <BookShow key={book.id} book={book} />
  })

  return <div className="book-list">{renderedBooks}</div>
}

export default BookList
