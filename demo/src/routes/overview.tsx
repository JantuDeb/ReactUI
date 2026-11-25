import { Link } from "@tanstack/react-router"
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
  Stat,
  StatsBar,
} from "@jantudeb/react-ui"

const groups = [
  { title: "Inputs and forms", text: "Reusable fields and validation-ready form building blocks." },
  { title: "Navigation", text: "Tabs, menus, dialogs, popovers, and route-aware examples." },
  { title: "Data display", text: "Cards, tables, pagination, loading, and empty states." },
]

export function OverviewPage() {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="eyebrow">StudyPath component library</div>
        <h1>Build consistent admin experiences.</h1>
        <p>
          Explore the shared React components and see them in a small app powered by TanStack Router and Table.
        </p>
        <div className="hero-actions">
          <Button asChild>
            <Link to="/components">Browse components</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/table">Open table demo</Link>
          </Button>
        </div>
      </section>

      <StatsBar className="demo-stats">
        <Stat label="UI runtime" value="React 19" />
        <Stat label="Navigation" value="TanStack Router" />
        <Stat label="Data grid" value="TanStack Table" />
      </StatsBar>

      <Alert variant="success">
        <AlertTitle>Demo is ready</AlertTitle>
        <AlertDescription>
          This app imports the built <code>@jantudeb/react-ui</code> package through the pnpm workspace.
        </AlertDescription>
      </Alert>

      <section className="section-heading">
        <div>
          <div className="eyebrow">Explore</div>
          <h2>One library, shared patterns</h2>
        </div>
      </section>

      <div className="group-grid">
        {groups.map((group, index) => (
          <Card key={group.title} className="group-card">
            <CardHeader>
              <span className="group-number">0{index + 1}</span>
              <CardTitle>{group.title}</CardTitle>
              <CardDescription>{group.text}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/components" className="inline-link">
                See examples <span aria-hidden="true">→</span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
