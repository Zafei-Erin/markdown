import { NoteData, Tag } from "./Type"
import { NoteForm } from "./NoteForm"
import { useContext } from "react"
import { appContext } from "./Context"
import styled from "styled-components"
import { Container } from "react-bootstrap"

export function NewNote() {
  const context = useContext(appContext)
  const onSubmit = context!.onCreateNote

  return (
    <Container className="justify-content-center pb-6">
      <h1 className="mb-4 ">Create note</h1>
      <NoteForm onSubmit={onSubmit} />
    </Container>
  )
}
