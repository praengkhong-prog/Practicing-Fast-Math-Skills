import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-[var(--transition-smooth)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-math-card",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-math-card",
        outline:
          "border border-input bg-background/80 backdrop-blur hover:bg-accent hover:text-accent-foreground shadow-math-card",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-math-card",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero:
          "math-gradient text-white shadow-math-glow hover:shadow-math-elevated hover:brightness-110 active:brightness-95 font-semibold",
        soft:
          "bg-accent text-accent-foreground hover:bg-accent/80 shadow-math-card",
        premium:
          "bg-gradient-to-br from-brand-accent/20 to-brand/10 backdrop-blur border border-brand/20 text-foreground hover:from-brand-accent/30 hover:to-brand/20 shadow-math-elevated",
        success:
          "bg-brand-success text-white hover:bg-brand-success/90 shadow-math-success",
        math:
          "bg-gradient-to-r from-brand to-brand-2 text-white hover:from-brand/90 hover:to-brand-2/90 shadow-math-glow font-mono font-bold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-12 rounded-lg px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
