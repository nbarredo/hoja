import * as React from "react"
import { cn } from "@/lib/utils"

const ScrollArea: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn("relative overflow-auto", className)}>
    {children}
  </div>
)

export { ScrollArea }
