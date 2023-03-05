import { Draggable } from "react-beautiful-dnd"
import { Stack, Card, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"
import styles from "./NotesList.module.css"
import { SimplifiedNote } from "./Type"

export function NoteCard({ _id, title, tags }: SimplifiedNote) {
  return (
    <Card
      as={Link}
      to={`/${_id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack className="align-items-center justify-content-center h-100">
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge className="text-truncate" key={tag._id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  )
}
