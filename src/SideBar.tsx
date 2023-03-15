import React, { useContext, useMemo, useState } from "react"
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import ReactSelect from "react-select"
import { appContext } from "./Context"
import { NoteList } from "./note-list"
import { RawNote, Tag } from "./Type"

export default function Sidebar() {
  console.log("sidebar")

  const { notes, tags, column } = useContext(appContext)!
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

  const tagStyles = (b: any, s: any) => ({
    ...b,
    width: "90%",
    height: "22px",
    borderWidth: "2px",
    borderColor: "#d1d5db",
    fontSize: "14px",
    color: "#111827",
    paddingLeft: "6px",
    overflow: "hidden",
  })

  return (
    <div className="flex-none max-w-[260px] min-w-[200px] w-[26%] shadow-[10px_0_25px_-24px_rgb(0,0,0,0.3)] mr-10">
      <Form>
        <Row className="mb-4" sm={1}>
          <Form.Group controlId="title">
            <input
              className="rounded-[4px] w-[90%] mb-1 border-2 border-gray-300 pl-3  py-2 text-sm text-gray-500"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="🔍 Search"
            />
          </Form.Group>
          <Form.Group controlId="tags">
            <ReactSelect
              styles={{
                control: tagStyles,
              }}
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
              placeholder="Tags"
            />
          </Form.Group>
        </Row>
      </Form>
      <NoteList filteredNotes={filteredNotes} />
    </div>
  )
}
