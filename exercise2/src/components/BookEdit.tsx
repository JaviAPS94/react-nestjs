import { Book } from "../context/books"
import React, { ChangeEvent, FormEvent, useState } from "react"
import useBooksContext from "../hooks/useBooksContext"

interface BookEditProps {
  book: Book
  //onSubmit este evento lo unico que hace es que el componente BookEdit se oculte una vez que se hayan actualizado los datos
  onSubmit: () => void
}

function BookEdit({ book, onSubmit }: BookEditProps) {
  const { updateBookTitle } = useBooksContext()
  const [title, setTitle] = useState(book.title)

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleEditClick = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
    updateBookTitle(book.id, title)
  }

  return (
    <form className="book-edit" onSubmit={handleEditClick}>
      <input className="input" value={title} onChange={handleOnChange} />
      <button className="button is-primary">Save</button>
    </form>
  )
}

export default BookEdit
