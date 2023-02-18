import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from "react"
import { Container } from "react-bootstrap"
import {Routes, Route, Navigate} from "react-router-dom"
import { NewNote } from "./NewNote"
import { useLocalStorage } from "./useLocalStorage"
import { v4 as uuidV4 } from "uuid"
import { NoteList } from "./note-list"

export type Note = {
  id: string;
} & NoteData

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
}

export type Tag = {
  id: string;
  label: string;
}

export type RawNote = {
  id: string;
} & RawNoteData

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[]; //方便直接修改tags
}


function App() {
  // 自定义hook
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  // 把tag根据id放进note里
  const notesWithTags = useMemo(()=>{
    return notes.map(note =>{
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  // 把创建的note存进notes的localstorage里
  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}
      ]
    })
  }

  // 把tag存进tag的localstorage里
  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route 
          path="/" 
          element={<NoteList notes={notesWithTags} availableTags={tags}/>} />
        <Route 
          path="/new" 
          element={
            <NewNote 
              onSubmit={onCreateNote} 
              onAddTag={addTag}
              availableTags={tags}/>} />
        <Route path="/:id">
          <Route index element={<h1>show</h1>}/>
          <Route path="edit" element={<h1>Edit</h1>}/>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
