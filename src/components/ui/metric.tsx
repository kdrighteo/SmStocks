import { cn } from "@/lib/utils"

interface MetricProps {
  value: string | number
  label?: string
  className?: string
}

export function Metric({ value, label, className }: MetricProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-3xl font-bold">{value}</div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  )
}
