import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

export function Text({ className, children, ...props }: TextProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}
