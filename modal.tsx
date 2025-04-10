import * as Dialog from "@radix-ui/react-dialog"
import { ReactNode } from "react"
import Svg from "./svg"
import { Header } from "./header"

export default function Modal({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  )
}

function ModalContent({
  title,
  children,
  close = true,
}: {
  title: string
  children: ReactNode
  close?: boolean
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=closed]:animate-[dialog-overlay-hide_200ms] data-[state=open]:animate-[dialog-overlay-show_200ms]" />
      <Dialog.Content className="fixed left-1/2 top-1/2 min-w-96 -translate-x-1/2 -translate-y-1/2 rounded-md bg-background p-4 text-primary shadow data-[state=closed]:animate-[dialog-content-hide_200ms] data-[state=open]:animate-[dialog-content-show_200ms]">
        <div className="flex items-center justify-between">
          <Dialog.Title asChild>
            <Header.ShortHeader variant="h5" color="primaryDark">
              {title}
            </Header.ShortHeader>
          </Dialog.Title>
          {close && (
            <Dialog.Close className="text-secondary hover:muted">
              <Svg name="cross" className="w-4 h-4" />
            </Dialog.Close>
          )}
        </div>

        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
}

Modal.Button = Dialog.Trigger
Modal.Close = Dialog.Close
Modal.Content = ModalContent
