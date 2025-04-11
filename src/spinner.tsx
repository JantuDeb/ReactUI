import loadingSpinner from "@assets/loading-spinner.png"
type SpinnerProps = {
  className?: string
  height?: string
  width?: string
}

export default function Spinner({
  width = "88",
  height = "88",
  className,
}: SpinnerProps) {
  return (
    <div className={className}>
      <img
        width={width}
        height={height}
        className="animate-spin"
        src={loadingSpinner}
      />
    </div>
  )
}
