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

const SAVE_INTERVAL_MS = 20000

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
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
  const navigate = useNavigate()
  const titleRef = useRef<HTMLInputElement>(null)
  const copy = async (e: FormEvent) => {
    e.preventDefault()
    if (titleRef.current!.value === "") {
      alert("please input a title")
      return
    }
    await navigator.clipboard.writeText(window.location.href)
    alert("Link copied, share with friends!")
    onSubmit({
      title: titleRef.current!.value,
      markdown: JSON.stringify(quill?.getContents()) || "",
      tags: selectedTags,
    })
  }

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
    console.log("getting note from form")

    socket.emit("get-note", _id)

    socket.once("load-note", (note) => {
      quill.setContents(JSON.parse(note))
      quill.enable()
    })
  }, [quill, socket, _id])

  // receive changes from server
  useEffect(() => {
    if (quill == null || socket == null) return

    const handler = (delta: Delta) => {
      // @ts-ignore
      quill.updateContents(delta)
      console.log("receive-changes")
    }
    socket.on("receive-changes", handler)
    return () => {
      socket.off("receive-changes", handler)
    }
  }, [quill, socket])

  // track user's changes, send them to server
  useEffect(() => {
    if (quill == null || socket == null) return

    const handler = (delta: Delta, oldDelta: Delta, source: string) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
      console.log("send-changes")
    }
    // @ts-ignore
    quill.on("text-change", handler)

    return () => {
      // @ts-ignore
      quill.off("text-change", handler)
    }
  }, [quill, socket])

  // autosave doc to db
  useEffect(() => {
    if (quill == null || socket == null) return

    const interval = setInterval(() => {
      onSubmit({
        title: titleRef.current!.value,
        markdown: JSON.stringify(quill?.getContents()) || "",
        tags: selectedTags,
      })
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    onSubmit({
      title: titleRef.current!.value,
      markdown: JSON.stringify(quill?.getContents()) || "",
      tags: selectedTags,
    })

    navigate("..", { replace: true })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <button
          className="my-1 w-[160px] border-2 rounded-full px-2 border-[#3864A5] text-sm font-semibold hover:text-white hover:bg-[#3864A5]"
          onClick={copy}
        >
          write with friends
        </button>
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
            style={{ padding: "0" }}
          ></div>
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Link to=".." replace>
            <Button type="button" variant="ontline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  )
}
