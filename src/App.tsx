import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from "react"
import { Container } from "react-bootstrap"
import {Routes, Route, Navigate} from "react-router-dom"
import { NewNote } from "./NewNote"
import { useLocalStorage } from "./useLocalStorage"
import { v4 as uuidV4 } from "uuid"
import { NoteList } from "./note-list"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"

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

  // 把tag根据id放进note里，note和tag都是obj
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

  // 修改note，直接修改rawnote[]
  function onUpdateNote(id:string, {tags, ...data}: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return {...note, ...data, tagIds: tags.map(tag => tag.id)}
        } else {
          return note
        }
      })
    })
  }

  // 删除note
  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  // 把tag存进tag的localstorage里
  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  // 修改tag
  function updateTag(id:string, label:string) {
    setTags(prevTag => {
      return prevTag.map(tag => {
        if (tag.id === id) {
          return {...tag, label}
        } else {
          return tag
        }
      })
    })
  }

  // 删除tag
  function deleteTag(id: string) {
    setTags(prevTag => {
      return prevTag.filter(tag => tag.id !== id)
    })
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route 
          path="/" 
          element={
            <NoteList 
              notes={notesWithTags} 
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />} 
        />
        <Route 
          path="/new" 
          element={
            <NewNote 
              onSubmit={onCreateNote} 
              onAddTag={addTag}
              availableTags={tags}/>} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags}/>}>
          <Route index element={<Note onDelete={onDeleteNote}/>}/>
          <Route 
            path="edit" 
            element={
              <EditNote
                onSubmit={onUpdateNote} 
                onAddTag={addTag}
                availableTags={tags}
              />}/>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
