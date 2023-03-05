import React, { createContext, useEffect, useMemo, useState } from "react"
import { Column, Note, NoteData, RawNote, Tag } from "./Type"
import { v4 as uuidV4 } from "uuid"
import { Socket } from "socket.io-client"

type ContextProviderProps = {
  socket: Socket
  children: React.ReactNode
}

type value = {
  notes: RawNote[]
  tags: Tag[]
  column: Column
  socket: Socket
  onSaveColumn: (columnOrder: string[]) => void
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
  const [column, setColumn] = useState<Column>({
    _id: "1",
    noteIds: [],
  })

  function load() {
    if (socket == null) return
    socket.on("load-notes", (notes) => {
      if (notes == null) {
        setNotes([])
        return
      }
      setNotes(() => notes)
    })

    socket.on("load-tags", (tags) => {
      if (tags == null) {
        setTags([])
        return
      }
      setTags(() => tags)
    })

    socket.on("load-column", (column) => {
      if (column == null) {
        setColumn({
          _id: "1",
          noteIds: [],
        })
        return
      }
      setColumn(() => column)
    })
  }

  useEffect(() => {
    if (socket == null) return
    socket.emit("get-data")
    load()
  }, [])

  // 把创建的note存进notes的db里并更新column
  function onCreateNote({ tags, ...data }: NoteData) {
    if (socket == null) return
    const newId = uuidV4()
    const newColumn = {
      _id: "1",
      noteIds: [newId, ...column.noteIds],
    }

    socket.emit("save-note", {
      ...data,
      _id: newId,
      tagIds: tags.map((tag) => tag._id),
      column: newColumn,
    })

    load()
  }

  function onSaveColumn(columnOrder: string[]) {
    if (socket == null) return
    const newColumn = {
      _id: "1",
      noteIds: columnOrder,
    }

    setColumn(newColumn)
    socket.emit("save-column", newColumn)
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
    const newOrder = column.noteIds
    newOrder.filter((id) => id !== _id).unshift(_id)

    const newColumn = {
      _id: "1",
      noteIds: newOrder,
    }

    if (socket == null) return
    socket.emit("save-note", {
      ...data,
      _id: _id,
      tagIds: tags.map((tag) => tag._id),
      column: newColumn,
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

    const newColumn = {
      _id: "1",
      noteIds: column.noteIds.filter((id) => id !== _id),
    }

    console.log(JSON.stringify(newColumn))

    socket.emit("delete-note", { _id, newColumn })
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
    column,
    socket,
    setColumn,
    onSaveColumn,
    onCreateNote,
    onUpdateNote,
    onDeleteNote,
    addTag,
    updateTag,
    deleteTag,
  }

  return <appContext.Provider value={value}>{children}</appContext.Provider>
}
