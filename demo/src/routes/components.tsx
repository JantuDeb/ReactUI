import { useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Modal,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@jantudeb/react-ui"

export function ComponentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <div className="eyebrow">Library</div>
          <h1>Component samples</h1>
          <p>Common controls, feedback, and overlays in one place.</p>
        </div>
      </div>

      <div className="example-grid">
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Variants and sizes from the shared Button component.</CardDescription>
          </CardHeader>
          <CardContent className="control-row">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Delete</Button>
            <Button variant="ghost" size="sm">Quiet</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>Alerts use the same semantic color tokens as the rest of the app.</CardDescription>
          </CardHeader>
          <CardContent className="stack-sm">
            <Alert variant="success">
              <AlertTitle>Saved</AlertTitle>
              <AlertDescription>Your changes are ready to review.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Needs attention</AlertTitle>
              <AlertDescription>Check the required fields before continuing.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form field</CardTitle>
            <CardDescription>The same Input can be used in simple forms and larger workflows.</CardDescription>
          </CardHeader>
          <CardContent className="stack-sm">
            <label htmlFor="demo-email" className="field-label">Email address</label>
            <Input id="demo-email" type="email" placeholder="you@example.com" />
            <p className="helper-text">This field is only a visual example.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dialog</CardTitle>
            <CardDescription>Open a controlled modal with a shared action button.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
            <Modal
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              header="Save these changes?"
              description="This modal is controlled by the demo page."
              actions={[
                { id: "close", label: "Cancel", variant: "outline" },
                { id: "save", label: "Save changes" },
              ]}
              onActionClick={() => setDialogOpen(false)}
            >
              <p className="dialog-copy">The dialog is part of the shared component package.</p>
            </Modal>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>Switch between examples without leaving the page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="tab-panel">
              Compose the library components into consistent screens.
            </TabsContent>
            <TabsContent value="usage" className="tab-panel">
              Import from the root package or use a component group subpath.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
