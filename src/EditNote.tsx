import { NoteForm } from "./NoteForm"
import { useNote } from "./NoteLayout"
import { useContext } from "react"
import { appContext } from "./Context"

export function EditNote() {
  const note = useNote()
  const { onUpdateNote: onSubmit } = useContext(appContext)!

  return (
    <>
      <h1 className="mb-4">Edit note</h1>
      <NoteForm
        _id={note?._id}
        title={note?.title}
        markdown={note?.markdown}
        tags={note?.tags}
        onSubmit={(data) => onSubmit(data, note?._id)}
      />
    </>
  )
}
