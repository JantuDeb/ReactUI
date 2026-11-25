import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
} from "@tanstack/react-router"
import { ArrowUpRight, Blocks, Layers3, Table2 } from "lucide-react"
import { Button } from "@jantudeb/react-ui"
import { ComponentsPage } from "./routes/components"
import { OverviewPage } from "./routes/overview"
import { TablePage } from "./routes/table"

function AppLayout() {
  return (
    <div className="demo-shell">
      <aside className="demo-sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">S</span>
          <span>
            <strong>StudyPath</strong>
            <small>React UI</small>
          </span>
        </Link>

        <div className="sidebar-label">Playground</div>
        <nav className="side-nav">
          <Link to="/" activeProps={{ className: "nav-link is-active" }} className="nav-link">
            <Layers3 size={17} />
            Overview
          </Link>
          <Link to="/components" activeProps={{ className: "nav-link is-active" }} className="nav-link">
            <Blocks size={17} />
            Components
          </Link>
          <Link to="/table" activeProps={{ className: "nav-link is-active" }} className="nav-link">
            <Table2 size={17} />
            TanStack Table
          </Link>
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          Built with React 19 and TanStack
        </div>
      </aside>

      <div className="demo-main">
        <header className="topbar">
          <span>Component playground</span>
          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <a href="https://github.com/JantuDeb/ReactUI" target="_blank" rel="noreferrer">
              Repository <ArrowUpRight size={14} />
            </a>
          </Button>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const rootRoute = createRootRoute({ component: AppLayout })
const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: OverviewPage,
})
const componentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components",
  component: ComponentsPage,
})
const tableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/table",
  component: TablePage,
})

const routeTree = rootRoute.addChildren([overviewRoute, componentsRoute, tableRoute])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
