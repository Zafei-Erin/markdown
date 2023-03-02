import { NoteData, Tag } from "./Type"
import { NoteForm } from "./NoteForm"
import { useContext } from "react"
import { appContext } from "./Context"

export function NewNote() {
  const context = useContext(appContext)
  const onSubmit = context!.onCreateNote

  return (
    <>
      <h1 className="mb-4">New note</h1>
      <NoteForm onSubmit={onSubmit} />
    </>
  )
}
