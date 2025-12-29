import { cn } from "@/lib/utils"

interface DonutChartProps {
  data: unknown[]
  category?: string
  index?: string
  valueFormatter?: (value: unknown) => string
  colors?: string[]
  className?: string
}

export function DonutChart({ data, category, index, valueFormatter, colors, className }: DonutChartProps) {
  return (
    <div className={cn("flex items-center justify-center h-64 bg-muted rounded-md", className)}>
      <div className="text-center">
        <div className="text-2xl mb-2">🥧</div>
        <p className="text-sm text-muted-foreground">Donut Chart</p>
        <p className="text-xs text-muted-foreground mt-1">
          Install recharts for actual chart rendering
        </p>
      </div>
    </div>
  )
}
