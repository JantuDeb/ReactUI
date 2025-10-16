import * as React from "react"
import { SidePanel, SidePanelAction } from "../side-panel"
import { Button } from "../../buttons/button"
import { Input } from "../../inputs/input"
import { Textarea } from "../../inputs/textarea"

export function SidePanelExample() {
  const [open, setOpen] = React.useState(false)
  const [open2, setOpen2] = React.useState(false)

  const actions: SidePanelAction[] = [
    { id: "save", label: "Save", variant: "default" },
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
        <h3 className="mb-4 text-lg font-semibold">SidePanel 1</h3>
        <Button onClick={() => setOpen(true)}>Open SidePanel</Button>
        <SidePanel
          key="side-panel-1"
          open={open}
          onOpenChange={setOpen}
          header="Panel Title"
          description="This is a description for the side panel."
          actions={actions}
          onActionClick={handleActionClick}
          showCloseButton={true}
        >
          <div>
            <label htmlFor="input" className="block mb-2 font-medium">
              Title
            </label>
            <Input id="input" type="text" placeholder="Type something..." />
          </div>
          <div>
            <label htmlFor="text" className="block mb-2 font-medium">
              Description
            </label>
            <Textarea id="text" placeholder="Type something..." />
          </div>
        </SidePanel>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">SidePanel 2</h3>
        <Button onClick={() => setOpen2(true)}>Open SidePanel</Button>
        <SidePanel
          key="side-panel-2"
          open={open2}
          onOpenChange={setOpen2}
          header="Panel Title 2"
          description="This is a description for the side panel."
          actions={actions}
          onActionClick={handleActionClick}
          actionsOrientation="vertical"
        >
          <div>
            <p>Panel content goes here.</p>
          </div>
        </SidePanel>
      </div>
    </>
  )
}
