import { useContext, useMemo } from "react"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { appContext } from "./Context"
import { Note } from "./Type"

// 筛选对应id的note
export function NoteLayout() {
  const { id } = useParams()
  const { tags, notes } = useContext(appContext)!
  const notesWithTags = useMemo(() => {
    return notes!.map((note) => {
      return {
        ...note,
        tags: tags?.filter((tag) => note.tagIds.includes(tag._id)),
      }
    })
  }, [notes, tags])
  const note = notesWithTags.find((n) => n._id === id)
  if (note === null) return <Navigate to={"/"} replace />
  return <Outlet context={note} />
}

// 通过outlet传递给子组件
export function useNote() {
  return useOutletContext<Note>()
}
