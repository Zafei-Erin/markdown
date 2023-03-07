import { NoteForm } from "./NoteForm"
import { useNote } from "./NoteLayout"
import { useContext } from "react"
import { appContext } from "./Context"
import { Container } from "react-bootstrap"

export function EditNote() {
  const note = useNote()
  const { onUpdateNote: onSubmit } = useContext(appContext)!
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href)
    alert("Link copied, share with friends!")
  }

  return (
    <Container className="justify-content-center pb-6">
      <h1>Edit note</h1>
      <button
        className="text-truncate my-3 border-2 rounded-full px-2 border-[#3864A5] text-sm font-semibold hover:text-white hover:bg-[#3864A5]"
        onClick={() => copy()}
      >
        write with friends
      </button>

      <NoteForm
        _id={note?._id}
        title={note?.title}
        markdown={note?.markdown}
        tags={note?.tags}
        onSubmit={(data) => onSubmit(data, note?._id)}
      />
    </Container>
  )
}
