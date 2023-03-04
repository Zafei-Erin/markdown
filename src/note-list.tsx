import { useContext, useMemo, useState } from "react"
import { Form, Stack, Row, Col, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import { RawNote, Tag } from "./Type"
import { appContext } from "./Context"
import { EditTagsModal } from "./EditTagsModal"
import { NoteCard } from "./NoteCard"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import styled from "styled-components"

export function NoteList() {
  const { notes, tags, column, onSaveColumn } = useContext(appContext)!
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState("")
  const [editTagModalIsOpen, setEditTagModalIsOpen] = useState(false)
  const notesOrder = column.noteIds

  console.log("notesOrder: " + column.noteIds)
  console.log("notes: " + JSON.stringify(notes))

  const orderedNotes = notesOrder?.map((noteId) => {
    return notes.find((note) => note._id === noteId)
  }) as RawNote[]

  console.log("orderedNotes: " + JSON.stringify(orderedNotes))

  const notesWithTags = useMemo(() => {
    return orderedNotes?.map((note) => {
      return {
        ...note,
        tags: tags?.filter((tag) => note?.tagIds.includes(tag._id)),
      }
    })
  }, [notes, tags])

  console.log("notesWithTags: " + JSON.stringify(notesWithTags))

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

  console.log("filteredNotes: " + JSON.stringify(filteredNotes))

  // 拖曳持久化
  function onDragEnd(result: any) {
    document.body.style.color = "inherit"
    document.body.style.backgroundColor = "inherit"

    const { destination, source, draggableId } = result

    // 拖出了范围
    if (!destination) return

    // 放回原处
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    notesOrder.splice(source.index, 1)
    notesOrder.splice(destination.index, 0, draggableId)
    onSaveColumn(notesOrder)
  }

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              variant="outline-secondary"
              onClick={() => setEditTagModalIsOpen(true)}
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
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
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="1" direction="horizontal">
          {(provided) => (
            <Row
              xs={1}
              sm={2}
              lg={3}
              xl={4}
              className="g-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredNotes?.map((note, index) => (
                <Draggable key={note._id} draggableId={note._id} index={index}>
                  {(provided) => (
                    <Col
                      key={note._id}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <NoteCard
                        _id={note._id}
                        title={note.title}
                        tags={note.tags}
                      />
                    </Col>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Row>
          )}
        </Droppable>
      </DragDropContext>
      <EditTagsModal
        show={editTagModalIsOpen}
        handleClose={() => setEditTagModalIsOpen(false)}
      />
    </>
  )
}

const Container = styled.div`
  display: flex;
`
