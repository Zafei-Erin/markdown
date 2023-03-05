import React, { useContext, useMemo, useState } from "react"
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import styled from "styled-components"
import { appContext } from "./Context"
import { NewNote } from "./NewNote"
import { NoteList } from "./note-list"
import { RawNote, Tag } from "./Type"

export default function Header() {
  const { notes, tags, column, onSaveColumn } = useContext(appContext)!
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState("")
  const notesOrder = column.noteIds

  const orderedNotes = notesOrder?.map((noteId) => {
    return notes.find((note) => note._id === noteId)
  }) as RawNote[]

  const notesWithTags = useMemo(() => {
    return orderedNotes?.map((note) => {
      return {
        ...note,
        tags: tags?.filter((tag) => note?.tagIds.includes(tag._id)),
      }
    })
  }, [notes, tags])

  // 每个select的id都要匹配到
  const filteredNotes = useMemo(() => {
    return notesWithTags?.filter((note) => {
      return (
        (title === "" ||
          note.title!.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags?.some((notetage) => notetage._id === tag._id)
          ))
      )
    })
  }, [title, selectedTags, notesWithTags])

  return (
    <Container>
      <Form>
        <Row className="mb-4" sm={1}>
          <Form.Group controlId="title">
            {/* <Form.Label>Title</Form.Label> */}
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Input Title"
            />
          </Form.Group>
          <Form.Group controlId="tags">
            <ReactSelect
              value={selectedTags.map((tag) => {
                return { label: tag.label, value: tag._id }
              })}
              options={tags?.map((tag) => {
                return { label: tag.label, value: tag._id }
              })}
              onChange={(tags) => {
                setSelectedTags(
                  tags?.map((tag) => {
                    return { label: tag.label, _id: tag.value }
                  })
                )
              }}
              isMulti
              placeholder="Select Tags"
            />
          </Form.Group>
        </Row>
      </Form>
      <NoteList filteredNotes={filteredNotes} />
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
`
