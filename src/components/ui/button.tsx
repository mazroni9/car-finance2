"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative",
          variant === "primary" ? "button-primary" : "button-secondary",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button } 