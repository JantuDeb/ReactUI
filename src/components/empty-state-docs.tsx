import React from "react"
import EmptyState from "./empty-state"
import { PlayCircle } from "lucide-react"

const EmptyStateDocs = () => {
  return (
    <div>
      // Basic usage
      <EmptyState header="No data available" description="There are no items to display at the moment." />
      // With primary action
      <EmptyState
        header="No categories found"
        description="Get started by creating your first category."
        primaryActionText="Create Category"
        onPrimaryAction={() => {}}
      />
      // With both actions
      <EmptyState
        header="No results found"
        description="We couldn't find any items matching your search."
        primaryActionText="Clear Filters"
        onPrimaryAction={() => {
          console.log("c")
        }}
        secondaryActionText="Reset Search"
        onSecondaryAction={() => {
          // resetSearch()
        }}
      />
      // With custom icon
      <EmptyState
        header="No videos available"
        description="Upload your first video to get started."
        icon={<PlayCircle />}
        primaryActionText="Upload Video"
        onPrimaryAction={() => {}}
      />
    </div>
  )
}

export default EmptyStateDocs
