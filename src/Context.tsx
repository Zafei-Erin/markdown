import React, { createContext, useEffect, useMemo, useState } from "react"
import { Column, Note, NoteData, RawNote, Tag } from "./Type"
import { v4 as uuidV4 } from "uuid"
import { io, Socket } from "socket.io-client"
import { useParams } from "react-router-dom"

type ContextProviderProps = {
  children: React.ReactNode
  socket: Socket
}

type value = {
  notes: RawNote[]
  tags: Tag[]
  column: Column
  socket: Socket
  onSaveColumn: (columnOrder: string[]) => void
  onUpdateNote: ({ tags, ...data }: NoteData, _id: string) => void
  onDeleteNote: (_id: string) => void
  addTag: (tag: Tag) => void
  updateTag: (tag: Tag) => void
  deleteTag: (_id: string) => void
}

export const appContext = createContext<value | null>(null)

export const ContextProvider = ({ socket, children }: ContextProviderProps) => {
  const [notes, setNotes] = useState<RawNote[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [column, setColumn] = useState<Column>({
    _id: "1",
    noteIds: [],
  })
  console.log("C")

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

  // 修改note，直接修改rawnote[]
  function onUpdateNote({ tags, ...data }: NoteData, _id: string) {
    const temp = column.noteIds
    const newOrder = temp.filter((id) => id !== _id)
    newOrder.unshift(_id)
    console.log("id" + _id)
    console.log("new Order" + newOrder)

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
    onUpdateNote,
    onDeleteNote,
    addTag,
    updateTag,
    deleteTag,
  }

  return <appContext.Provider value={value}>{children}</appContext.Provider>
}
