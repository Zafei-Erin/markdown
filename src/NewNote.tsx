import { NoteData, Tag } from "./Type"
import { NoteForm } from "./NoteForm"
import { useContext } from "react"
import { appContext } from "./Context"
import styled from "styled-components"
import { Container } from "react-bootstrap"

export function NewNote() {
  const context = useContext(appContext)
  const onSubmit = context!.onCreateNote
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href)
    alert("Link copied, share with friends!")
  }

  return (
    <Container className="justify-content-center pb-6">
      <h1 className="mb-4 ">Create note</h1>
      <button
        className="text-truncate my-3 border-2 rounded-full px-2 border-[#3864A5] text-sm font-semibold hover:text-white hover:bg-[#3864A5]"
        onClick={() => copy()}
      >
        write with friends
      </button>
      <NoteForm onSubmit={onSubmit} />
    </Container>
  )
}
