import "bootstrap/dist/css/bootstrap.min.css"
import { useContext, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
import { NewNote } from "./NewNote"
import { NoteList } from "./note-list"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"
import { appContext, ContextProvider } from "./Context"
import { io, Socket } from "socket.io-client"

function App() {
  const [socket, setSocket] = useState<Socket>(io("http://localhost:3001"))

  return (
    <ContextProvider socket={socket}>
      <Container className="my-4">
        <Routes>
          <Route path="/" element={<NoteList />} />
          <Route path="/new" element={<NewNote />} />
          <Route path="/:id" element={<NoteLayout />}>
            <Route index element={<Note />} />
            <Route path="edit" element={<EditNote />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      </Container>
    </ContextProvider>
  )
}

export default App
