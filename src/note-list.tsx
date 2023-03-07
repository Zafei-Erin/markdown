import { useContext, useState } from "react"
import { Form, Stack, Row, Col, Button } from "react-bootstrap"
import { appContext } from "./Context"
import { EditTagsModal } from "./EditTagsModal"
import { NoteCard } from "./NoteCard"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import styled from "styled-components"
import { Tag } from "./Type"

type NoteListProps = {
  filteredNotes: {
    tags: Tag[]
    _id: string
    title: string
    markdown: string
    tagIds: string[]
  }[]
}

export function NoteList({ filteredNotes }: NoteListProps) {
  const { column, onSaveColumn } = useContext(appContext)!
  const notesOrder = column.noteIds

  // 拖曳持久化
  function onDragEnd(result: any) {
    document.body.style.color = "inherit"
    document.body.style.backgroundColor = "inherit"

    const { destination, source, draggableId } = result

    // 拖出了范围
    if (!destination) return

    // 放回原处
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    notesOrder.splice(source.index, 1)
    notesOrder.splice(destination.index, 0, draggableId)
    onSaveColumn(notesOrder)
  }

  const isDragDisabled = filteredNotes.length !== column.noteIds.length

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="1">
          {(provided) => (
            <Col
              className="g-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredNotes?.map((note, index) => (
                <Draggable
                  key={note._id}
                  draggableId={note._id}
                  index={index}
                  isDragDisabled={isDragDisabled}
                >
                  {(provided) => (
                    <Col
                      key={note._id}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="group hover:bg-[#3864A5] hover:text-white h-[80px] overflow-y-auto"
                    >
                      <Container>
                        <NoteCard
                          _id={note._id}
                          title={note.title}
                          tags={note.tags}
                        />
                      </Container>
                    </Col>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Col>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}

const Container = styled.div`
  margin: 2px;
  height: 66px;
`
