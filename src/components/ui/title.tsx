import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string
}

export function Title({ className, children, ...props }: TitleProps) {
  return (
    <h3 className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </h3>
  )
}
