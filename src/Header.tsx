import { useState } from "react"
import { Button, Col, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function Header({
  setEditTagModalIsOpen,
}: {
  setEditTagModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <Row className="align-items-center mb-4">
      <Col>
        <h1>Notes</h1>
      </Col>
      <Col xs="auto">
        <Stack gap={2} direction="horizontal">
          <Link to="/new">
            <Button variant="primary">Create</Button>
          </Link>
          <Button
            variant="outline-secondary"
            onClick={() => setEditTagModalIsOpen(true)}
          >
            Edit Tags
          </Button>
        </Stack>
      </Col>
    </Row>
  )
}
