import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-full w-11 h-6 relative bg-gray-200 data-[state=on]:bg-blue-500 transition-colors",
  {
    variants: {
      variant: {
        default: "",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-6 w-11 px-2",
        sm: "h-5 w-9 px-1.5",
        lg: "h-7 w-14 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  >
    <span className={cn(
      "inline-block w-4 h-4 transform bg-white rounded-full transition-transform",
      props.pressed ? "translate-x-6" : "translate-x-1"
    )}/>
  </TogglePrimitive.Root>
))

Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }
