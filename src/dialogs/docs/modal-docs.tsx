import * as React from "react"
import { Modal, ModalProps } from "../modal"
import { Button } from "../../buttons/button"
import { Label } from "../../form/label"
import { Input } from "../../inputs/input"

export function ModalExample() {
  const [open, setOpen] = React.useState(false)
  const [open2, setOpen2] = React.useState(false)

  const actions: ModalProps["actions"] = [
    // { id: "save", label: "Save" },
    { id: "close", label: "Close", variant: "secondary" },
  ]

  const handleActionClick = (actionId: string) => {
    if (actionId === "save") {
      alert("Saved!")
    }
  }

  return (
    <>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Modal 1</h3>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          header="Modal Title"
          description="This is a description for the modal."
          actions={actions}
          onActionClick={handleActionClick}
        >
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue="https://ui.shadcn.com/docs/installation" readOnly />
            </div>
          </div>
        </Modal>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Modal 2</h3>
        <Button onClick={() => setOpen2(true)}>Open Modal</Button>
        <Modal
          open={open2}
          onOpenChange={setOpen2}
          header="Edit profile"
          description="Make changes to your profile here. Click save when you're
              done."
          actions={[
            { id: "close", label: "Cancel", variant: "secondary" },
            { id: "save", label: "Save Changes" },
          ]}
          onActionClick={handleActionClick}
          actionsWidth="full"
        >
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}
