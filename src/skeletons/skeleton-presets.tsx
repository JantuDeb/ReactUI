import { Skeleton } from "./skeleton"

export function TableSkeleton({ rows = 5, columns = 4, className = "" }) {
  return (
    <div className={`w-full border rounded-md overflow-hidden ${className}`}>
      <div className="flex bg-muted">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="h-8 flex-1" />
        ))}
      </div>
      {[...Array(rows)].map((_, rowIdx) => (
        <div key={rowIdx} className="flex border-t">
          {[...Array(columns)].map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ListCardSkeleton({ count = 4, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function FormSkeleton({ fields = 4, className = "" }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {[...Array(fields)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}
