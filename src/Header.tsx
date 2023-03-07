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
        <h1 className="text-[#3864A5] underline decoration-2  font-style: italic">
          Notegether
        </h1>
      </Col>
      <Col xs="auto">
        <Stack gap={2} direction="horizontal">
          <Link to="/new">
            <button className="bg-[#3864A5] text-white px-2 py-2 rounded-md">
              {" "}
              + Create
            </button>
          </Link>
          <button
            className="border-2 border-[#3864A5] text-[#3864A5] px-2 py-1.5 rounded-md"
            onClick={() => setEditTagModalIsOpen(true)}
          >
            Edit Tags
          </button>
        </Stack>
      </Col>
    </Row>
  )
}
