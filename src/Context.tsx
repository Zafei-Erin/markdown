import React, { createContext, useEffect, useMemo, useState } from "react"
import { Note, NoteData, RawNote, Tag } from "./Type"
import { v4 as uuidV4 } from "uuid"
import { Socket } from "socket.io-client"

type ContextProviderProps = {
  socket: Socket | undefined
  children: React.ReactNode
}

type value = {
  notes: RawNote[]
  tags: Tag[]
  socket: Socket | undefined
  onCreateNote: ({ tags, ...data }: NoteData) => void
  onUpdateNote: ({ tags, ...data }: NoteData, _id: string) => void
  onDeleteNote: (_id: string) => void
  addTag: (tag: Tag) => void
  updateTag: (tag: Tag) => void
  deleteTag: (_id: string) => void
}

export const appContext = createContext<value | null>(null)

export const ContextProvider = ({
  children,
  ...props
}: ContextProviderProps) => {
  const { socket } = props

  const [notes, setNotes] = useState<RawNote[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  function load() {
    if (socket == null) return
    socket.on("load-notes", (notes) => {
      setNotes(() => notes)
    })

    socket.on("load-tags", (tags) => {
      setTags(() => tags)
    })
  }

  useEffect(() => {
    if (socket == null) return
    socket.emit("get-notes")
    socket.emit("get-tags")
    load()
  }, [])

  // 把创建的note存进notes的db里
  function onCreateNote({ tags, ...data }: NoteData) {
    if (socket == null) return
    socket.emit("save-note", {
      ...data,
      _id: uuidV4(),
      tagIds: tags.map((tag) => tag._id),
    })
    load()
  }

  // 把tag存进tag的db里
  function addTag(tag: Tag) {
    if (socket == null) return
    socket.emit("save-tag", tag)
    load()
  }

  // 修改note，直接修改rawnote[]
  function onUpdateNote({ tags, ...data }: NoteData, _id: string) {
    console.log("onUpdateNote: " + JSON.stringify(data))

    if (socket == null) return
    socket.emit("save-note", {
      ...data,
      _id: _id,
      tagIds: tags.map((tag) => tag._id),
    })

    tags.map((tag) => {
      socket.emit("save-tag", {
        _id: tag._id,
        label: tag.label,
      })
    })
    load()
  }

  // 修改tag
  function updateTag({ _id, label }: Tag) {
    if (socket == null) return
    socket.emit("save-tag", { _id, label })
    load()
  }

  // 删除note
  function onDeleteNote(_id: string) {
    if (socket == null) return
    socket.emit("delete-note", _id)
    load()
  }

  // 删除tag
  function deleteTag(_id: string) {
    if (socket == null) return
    socket.emit("delete-tag", _id)
    load()
  }

  const value = {
    notes,
    tags,
    socket,
    onCreateNote,
    onUpdateNote,
    onDeleteNote,
    addTag,
    updateTag,
    deleteTag,
  }

  return <appContext.Provider value={value}>{children}</appContext.Provider>
}
