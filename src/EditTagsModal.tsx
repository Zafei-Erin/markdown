import { useContext } from "react"
import { Form, Stack, Row, Col, Button, Modal } from "react-bootstrap"
import { appContext } from "./Context"
import { EditTagModalProps } from "./Type"

export function EditTagsModal({ show, handleClose }: EditTagModalProps) {
  const context = useContext(appContext)
  const availableTags = context!.tags
  const onUpdateTag = context!.updateTag
  const onDeleteTag = context!.deleteTag

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags?.map((tag) => (
              <Row key={tag._id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) =>
                      onUpdateTag({ ...tag, label: e.target.value })
                    }
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-danger"
                    onClick={() => onDeleteTag(tag._id)}
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
