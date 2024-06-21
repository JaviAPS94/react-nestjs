import { Book } from "../context/books"
import React, { useState } from "react"
import BookEdit from "./BookEdit"
import useBooksContext from "../hooks/useBooksContext"

interface BookShowProps {
  book: Book
}

function BookShow({ book }: BookShowProps) {
  const { deleteBookById } = useBooksContext()
  const [showEdit, setShowEdit] = useState(false)

  let content = <h3>{book.title}</h3>

  const handleEditClick = () => {
    setShowEdit(!showEdit)
  }

  const handleOnSubmit = () => {
    setShowEdit(false)
  }

  const handleDeleteClick = () => {
    deleteBookById(book.id)
  }

  if (showEdit) {
    //contenido debería ser el componente de edición
    content = <BookEdit book={book} onSubmit={handleOnSubmit} />
  }

  return (
    <div className="book-show">
      <img alt="book" src={`https://picsum.photos/seed/${book.id}/300/200`} />
      {content}
      <div className="actions">
        <button className="edit" onClick={handleEditClick}>
          Edit
        </button>
        <button className="delete" onClick={handleDeleteClick}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default BookShow
