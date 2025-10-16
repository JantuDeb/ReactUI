import { useState } from "react"
import { TriangleAlertIcon } from "lucide-react"
import ConfirmationDialog from "../confirmation-dialog"
import { Button } from "../../buttons/button"
import { Checkbox } from "../../inputs/checkbox"
import { Label } from "../../form/label"

const AlertDialogDestructiveDemo = () => {
  const [dontAskAgain, setDontAskAgain] = useState(false)

  const handleDelete = async () => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900))
    // throw new Error('Failed to delete') // test error path
    return { ok: true, dontAskAgain }
  }

  const onSuccess = (res: any) => {
    // e.g., toast.success('Deleted successfully')
    // console.log('Success:', res)
  }

  const onError = (err: any) => {
    // e.g., toast.error(err.message || 'Something went wrong')
    // console.error('Error:', err)
  }

  return (
    <ConfirmationDialog
      trigger={<Button variant="outline">Alert Dialog Destructive</Button>}
      header="Are you absolutely sure you want to delete?"
      description={
        <div>
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          <span className="mt-4 flex items-center justify-center gap-3">
            <Checkbox id="terms" checked={dontAskAgain} onCheckedChange={(v) => setDontAskAgain(!!v)} />
            <Label htmlFor="terms">Don&apos;t ask next again</Label>
          </span>
        </div>
      }
      icon={<TriangleAlertIcon className="size-6 text-destructive" />}
      submitLabel="Delete"
      cancelLabel="Cancel"
      buttonVariantProps={{
        submit: {
          className:
            "bg-destructive text-white hover:bg-destructive focus-visible:ring-destructive dark:bg-destructive/60",
        },
        cancel: {},
      }}
      // Alignment via cva
      align="center" // 'start' | 'center' | 'end'
      footerAlign="end" // 'start' | 'center' | 'end' | 'between'
      submitFunction={handleDelete}
      onSuccess={onSuccess}
      onError={onError}
    />
  )
}

export default AlertDialogDestructiveDemo
