// sample-sidebar-options.ts
import { Home, BookOpen, Settings, Users } from "lucide-react"
import { SidebarOptions } from "./types"
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from "./sidebar"
import { SideNavMain } from "./sidenav-menu"
import { ReactNode } from "react"

export const sidebarOptions: SidebarOptions = [
  {
    type: "dropdown",
    label: "StudyPath",
    options: [{ id: "studypath", label: "Studypath", type: "item" }],
    key: "app",
  },
  {
    type: "group",
    key: "group-main",
    label: "Main",
    children: [
      {
        type: "item",
        key: "home",
        label: "Home",
        href: "/home",
        icon: <Home />,
      },
      {
        type: "submenu",
        key: "courses",
        label: "Courses",
        icon: <BookOpen />,
        children: [
          {
            type: "item",
            key: "math",
            label: "Math",
            href: "/courses/math",
          },
          {
            type: "item",
            key: "science",
            label: "Science",
            href: "/courses/science",
          },
        ],
      },
      {
        type: "separator",
        key: "sep-1",
      },
      {
        type: "item",
        key: "settings",
        label: "Settings",
        href: "/settings",
        icon: <Settings />,
        disabled: true,
      },
    ],
  },
  {
    type: "group",
    key: "group-admin",
    label: "Admin",
    children: [
      {
        type: "item",
        key: "users",
        label: "Users",
        href: "/admin/users",
        icon: <Users />,
      },
    ],
  },
]

export default function SidebarLayout({ children }: { children?: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SideNavMain items={sidebarOptions} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="text-primary" />
            {/* <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <BreadCrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div> */}
          <div></div>
          <div className="flex-1 rounded-xl md:min-h-min">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
