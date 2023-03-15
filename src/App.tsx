import "bootstrap/dist/css/bootstrap.min.css"
import { useContext, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { Routes, Route, Navigate, Link, redirect } from "react-router-dom"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"
import { appContext, ContextProvider } from "./Context"
import { io, Socket } from "socket.io-client"
import SideBar from "./SideBar"
import styled from "styled-components"
import Header from "./Header"
import IndexPage from "./IndexPage"
import { EditTagsModal } from "./EditTagsModal"
import { v4 as uuidV4 } from "uuid"

function App() {
  const [editTagModalIsOpen, setEditTagModalIsOpen] = useState(false)
  const [socket, setSocket] = useState<Socket>(io("http://localhost:3001"))
  return (
    <div className="my-4 mx-[2%] h-screen pb-6">
      <div className="h-[10%]">
        <Header setEditTagModalIsOpen={setEditTagModalIsOpen} />
      </div>
      <ContextProvider socket={socket}>
        <div className="flex min-h-screen">
          <SideBar />
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route
              path="/new"
              element={<Navigate to={`/document/${uuidV4()}/edit`} />}
            />
            <Route path="/document/:id" element={<NoteLayout />}>
              <Route index element={<Note />} />
              <Route path="edit" element={<EditNote />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </div>
        <EditTagsModal
          show={editTagModalIsOpen}
          handleClose={() => setEditTagModalIsOpen(false)}
        />
      </ContextProvider>
    </div>
  )
}

export default App
