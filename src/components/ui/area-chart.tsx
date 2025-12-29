import { cn } from "@/lib/utils"

interface AreaChartProps {
  data: unknown[]
  index: string
  categories: string[]
  colors?: string[]
  className?: string
  valueFormatter?: (value: unknown) => string
  yAxisWidth?: number
}

export function AreaChart({ data, index, categories, colors, className, valueFormatter, yAxisWidth }: AreaChartProps) {
  return (
    <div className={cn("flex items-center justify-center h-64 bg-muted rounded-md", className)}>
      <div className="text-center">
        <div className="text-2xl mb-2">📈</div>
        <p className="text-sm text-muted-foreground">Area Chart</p>
        <p className="text-xs text-muted-foreground mt-1">
          Install recharts for actual chart rendering
        </p>
      </div>
    </div>
  )
}
