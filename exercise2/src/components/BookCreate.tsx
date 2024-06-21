import { ChangeEvent, FormEvent, useState } from "react"
import React from "react"
import useBooksContext from "../hooks/useBooksContext"

function BookCreate() {
  const { createBook } = useBooksContext()
  const [title, setTitle] = useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    createBook(title)
    setTitle('')
  }

  return (
    <div className="book-create">
      <h3>Add book</h3>
      <form onSubmit={handleFormSubmit}>
        <label>Title</label>
        <input className="input" value={title} onChange={handleChange} />
        <button className="button">Create</button>
      </form>
    </div>
  )
}

export default BookCreate
