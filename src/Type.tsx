export type Note = {
  _id: string
} & NoteData

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  _id: string
  label: string
}

export type Column = {
  _id: string
  noteIds: string[]
}

export type RawNote = {
  _id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[] //方便直接修改tags
}

export type SimplifiedNote = {
  tags: Tag[]
  title: string
  _id: string
}

export type EditTagModalProps = {
  show: boolean
  handleClose: () => void
}
