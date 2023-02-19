import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { Note } from "./App"

type NoteLayoutProps = {
    notes: Note[]
}

// 筛选对应id的note
export function NoteLayout({notes}: NoteLayoutProps) {
    const {id} = useParams()
    const note = notes.find(n => n.id === id)

    if (note === null) return <Navigate to={"/"} replace/>
    return <Outlet context={note}/>
}

// 通过outlet传递给子组件
export function useNote() {
    return useOutletContext<Note>()
}