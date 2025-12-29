import { cn } from "@/lib/utils"

interface LineChartProps {
  data: unknown[]
  index: string
  categories: string[]
  colors?: string[]
  className?: string
}

export function LineChart({ data, index, categories, colors, className }: LineChartProps) {
  return (
    <div className={cn("flex items-center justify-center h-64 bg-muted rounded-md", className)}>
      <div className="text-center">
        <div className="text-2xl mb-2">📊</div>
        <p className="text-sm text-muted-foreground">Chart visualization</p>
        <p className="text-xs text-muted-foreground mt-1">
          Install recharts for actual chart rendering
        </p>
      </div>
    </div>
  )
}
