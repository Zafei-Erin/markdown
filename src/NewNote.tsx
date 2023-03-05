import { NoteData, Tag } from "./Type"
import { NoteForm } from "./NoteForm"
import { useContext } from "react"
import { appContext } from "./Context"
import styled from "styled-components"

export function NewNote() {
  const context = useContext(appContext)
  const onSubmit = context!.onCreateNote

  return (
    <Container>
      <NoteForm onSubmit={onSubmit} />
    </Container>
  )
}
export const Container = styled.div`
  height: 100vh;
`
