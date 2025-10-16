import React, { useState } from "react"

import ComposableTabs, { TabsContent } from "./tab-group"

// Mock icons for demonstration
const UserIcon = () => <span>👤</span>
const LockIcon = () => <span>🔒</span>
const BellIcon = () => <span>🔔</span>

const sampleTabsWithIcons = [
  { id: "profile", label: "Profile", icon: <UserIcon /> },
  { id: "security", label: "Security", icon: <LockIcon /> },
  { id: "notifications", label: "Notifications", icon: <BellIcon /> },
]

const TabsExamples = () => {
  return (
    <div className="p-8 space-y-12">
      <h1 className="text-3xl font-bold">Tabs Component with CVA Variants</h1>

      {/* Example 1: Default Pills */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Variant: "pills" (Default)</h2>
        <ComposableTabs tabs={sampleTabsWithIcons} defaultValue="profile" variant="pills" activeVariant="primary">
          <TabsContent value="profile">
            <p className="p-4 border rounded-md">Content for Pills Profile.</p>
          </TabsContent>
          <TabsContent value="security">
            <p className="p-4 border rounded-md">Content for Pills Security.</p>
          </TabsContent>
        </ComposableTabs>
      </section>

      {/* Example 1: Default Pills */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">
          Variant: "pills" , ActiveVariant: "background", background: "muted"
        </h2>
        <ComposableTabs
          tabs={sampleTabsWithIcons}
          defaultValue="profile"
          variant="pills"
          activeVariant="background"
          background="muted"
        >
          <TabsContent value="profile">
            <p className="p-4 border rounded-md">Content for Pills Profile.</p>
          </TabsContent>
          <TabsContent value="security">
            <p className="p-4 border rounded-md">Content for Pills Security.</p>
          </TabsContent>
        </ComposableTabs>
      </section>

      {/* Example 2: Underline */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Variant: "underline"</h2>
        <ComposableTabs tabs={sampleTabsWithIcons} defaultValue="security" variant="underline">
          <TabsContent value="profile">
            <p className="p-4 rounded-md">Content for Underline Profile.</p>
          </TabsContent>
          <TabsContent value="security">
            <p className="p-4 rounded-md">Content for Underline Security.</p>
          </TabsContent>
        </ComposableTabs>
      </section>

      {/* Example 3: Contained with Hover Effect */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Variant: "contained"</h2>
        <ComposableTabs tabs={sampleTabsWithIcons} defaultValue="notifications" variant="contained" border="none">
          <TabsContent value="notifications">
            <p className="p-4 border rounded-md">Content for Contained Notifications.</p>
          </TabsContent>
        </ComposableTabs>
      </section>

      {/* Example 4: Vertical Navigation */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Orientation: "vertical" with "verticalNav" Variant</h2>
        <ComposableTabs
          tabs={sampleTabsWithIcons}
          defaultValue="profile"
          orientation="vertical"
          variant="verticalNav"
          className="max-w-xl"
          border="none"
          //   background="primary"
        >
          <TabsContent value="profile">
            <p className="p-4 border rounded-md ml-4">Vertical Navigation: Profile Content</p>
          </TabsContent>
          <TabsContent value="security">
            <p className="p-4 border rounded-md ml-4">Vertical Navigation: Security Content</p>
          </TabsContent>
          <TabsContent value="notifications">
            <p className="p-4 border rounded-md ml-4">Vertical Navigation: Notifications Content</p>
          </TabsContent>
        </ComposableTabs>
      </section>
    </div>
  )
}
export default TabsExamples
