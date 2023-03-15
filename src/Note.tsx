import { Badge, Button, Col, Container, Row, Stack } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useNote } from "./NoteLayout"
import ReactMarkdown from "react-markdown"
import { useCallback, useContext, useEffect, useState } from "react"
import { appContext } from "./Context"
import Quill from "quill"
import "quill/dist/quill.bubble.css"

export function Note() {
  const note = useNote()
  const navigate = useNavigate()
  const { onDeleteNote: onDelete, socket } = useContext(appContext)!
  const [quill, setQuill] = useState<Quill>()

  const markdownRef = useCallback((wrapper: HTMLDivElement) => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, { theme: "bubble" })

    q.disable()
    q.setText("Loading")
    setQuill(q)
  }, [])

  const { id } = useParams()

  useEffect(() => {
    if (quill == null || socket == null) return

    socket.emit("get-note", id)

    socket.on("load-note", (note) => {
      quill.setContents(JSON.parse(note))
    })
  }, [quill, socket, id])

  return (
    <Container className="justify-content-center pb-6">
      <Row className="mb-4">
        <h1>{note?.title}</h1>
        {note?.tags.length > 0 && (
          <Stack gap={1} direction="horizontal" className="flex-wrap">
            {note.tags.map((tag) => (
              <Badge className="text-truncate" key={tag._id}>
                {tag.label}
              </Badge>
            ))}
          </Stack>
        )}
      </Row>
      <div className="containerView" ref={markdownRef}></div>
      <Col xs="auto" style={{ float: "right" }}>
        <Stack gap={2} direction="horizontal">
          <Link to={`/${note?._id}/edit`}>
            <Button variant="primary">Edit</Button>
          </Link>
          <Button
            variant="outline-danger"
            onClick={() => {
              onDelete(note._id)
              navigate("/", { replace: true })
            }}
          >
            Delete
          </Button>
          <Link to="/" replace={true}>
            <Button variant="outline-secondary">Back</Button>
          </Link>
        </Stack>
      </Col>
      <div></div>
    </Container>
  )
}
