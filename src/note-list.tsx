import { useContext, useEffect, useMemo, useState } from "react"
import {
  Form,
  Stack,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Modal,
} from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import browserHistory from 'react-router'
import { RawNote, Tag } from "./Type"
import styles from "./NotesList.module.css"
import { appContext } from "./Context"

type SimplifiedNote = {
  tags: Tag[]
  title: string
  _id: string
}

type EditTagModalProps = {
  show: boolean
  handleClose: () => void
}

export function NoteList() {
  const { notes, tags } = useContext(appContext)!

  const notesWithTags = useMemo(() => {
    return notes?.map((note) => {
      return {
        ...note,
        tags: tags?.filter((tag) => note.tagIds.includes(tag._id)),
      }
    })
  }, [notes, tags])

  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState("")
  const [editTagModalIsOpen, setEditTagModalIsOpen] = useState(false)

  // 每个select的id都要匹配到
  const filteredNotes = useMemo(() => {
    return notesWithTags?.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags?.some((notetage) => notetage._id === tag._id)
          ))
      )
    })
  }, [title, selectedTags, notesWithTags])

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
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes?.map((note) => (
          <Col key={note._id}>
            <NoteCard _id={note._id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        show={editTagModalIsOpen}
        handleClose={() => setEditTagModalIsOpen(false)}
      />
    </>
  )
}

function NoteCard({ _id, title, tags }: SimplifiedNote) {
  return (
    <Card
      as={Link}
      to={`/${_id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge className="text-truncate" key={tag._id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  )
}

function EditTagsModal({ show, handleClose }: EditTagModalProps) {
  const context = useContext(appContext)
  const availableTags = context!.tags
  const onUpdateTag = context!.updateTag
  const onDeleteTag = context!.deleteTag

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags?.map((tag) => (
              <Row key={tag._id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) =>
                      onUpdateTag({ ...tag, label: e.target.value })
                    }
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-danger"
                    onClick={() => onDeleteTag(tag._id)}
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
