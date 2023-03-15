import { NoteForm } from "./NoteForm"
import { useNote } from "./NoteLayout"
import { useContext } from "react"
import { appContext } from "./Context"
import { Container } from "react-bootstrap"
import { useParams } from "react-router-dom"

export function EditNote() {
  const note = useNote()
  const { onUpdateNote: onSubmit } = useContext(appContext)!
  const newId = useParams().id as string
  console.log("!!!!!!!!!111" + newId)
  console.log("note:" + JSON.stringify(note))

  return (
    <Container className="justify-content-center pb-6">
      <h1>Edit note</h1>
      <NoteForm
        _id={note?._id}
        title={note?.title}
        markdown={note?.markdown}
        tags={note?.tags}
        onSubmit={(data) => onSubmit(data, note?._id || newId)}
      />
    </Container>
  )
}
