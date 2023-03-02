import {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { Form, Stack, Row, Col, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import CreatableReactSelect from "react-select/creatable"
import { v4 as uuidV4 } from "uuid"
import { Note, NoteData } from "./Type"
import { Tag } from "./Type"
import Quill from "quill"
import Delta from "quill"
import "quill/dist/quill.snow.css"
import { appContext } from "./Context"

type NoteFormProps = {
  onSubmit: (data: NoteData) => void
} & Partial<Note>

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["clean"],
]

export function NoteForm({
  onSubmit,
  _id,
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) {
  const {
    tags: availableTags,
    addTag: onAddTag,
    socket,
  } = useContext(appContext)!

  const [quill, setQuill] = useState<Quill>()

  const titleRef = useRef<HTMLInputElement>(null)

  const markdownRef = useCallback((wrapper: HTMLDivElement) => {
    if (wrapper == null) return

    wrapper.innerHTML = ""

    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })

    q.disable()
    q.setText("Loading")
    setQuill(q)
  }, [])

  // load the right document
  useEffect(() => {
    if (quill == null || socket == null) return
    socket.emit("get-note", _id)

    socket.on("load-note", (note) => {
      quill.setContents(JSON.parse(note))
      quill.enable()
    })
  }, [quill, socket, _id])

  // track user's changes, send them to server
  useEffect(() => {
    if (quill == null || socket == null) return

    const handler = (delta: Delta, oldDelta: Delta, source: string) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [quill, socket])

  // receive changes from server
  useEffect(() => {
    if (quill == null || socket == null) return

    const handler = (delta: Delta) => {
      quill.updateContents(delta)
    }

    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [quill, socket])

  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    onSubmit({
      title: titleRef.current!.value,
      markdown: JSON.stringify(quill?.getContents()) || "",
      tags: selectedTags,
    })

    navigate("..")
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                onCreateOption={(label) => {
                  const newTag = { label, _id: uuidV4() }
                  onAddTag(newTag) //存进localstorage
                  setSelectedTags((prev) => [...prev, newTag])
                }}
                value={selectedTags?.map((tag) => {
                  return { label: tag.label, value: tag._id }
                })}
                options={availableTags?.map((tag) => {
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
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <div
            className="container"
            ref={markdownRef}
            defaultValue={markdown}
          ></div>
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Link to="..">
            <Button type="button" variant="ontline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  )
}
