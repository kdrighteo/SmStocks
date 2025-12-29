import { cn } from "@/lib/utils"

interface BarChartProps {
  data: unknown[]
  index: string
  categories: string[]
  colors?: string[]
  className?: string
  valueFormatter?: (value: unknown) => string
  yAxisWidth?: number
}

export function BarChart({ data, index, categories, colors, className, valueFormatter, yAxisWidth }: BarChartProps) {
  return (
    <div className={cn("flex items-center justify-center h-64 bg-muted rounded-md", className)}>
      <div className="text-center">
        <div className="text-2xl mb-2">📊</div>
        <p className="text-sm text-muted-foreground">Bar Chart</p>
        <p className="text-xs text-muted-foreground mt-1">
          Install recharts for actual chart rendering
        </p>
      </div>
    </div>
  )
}
