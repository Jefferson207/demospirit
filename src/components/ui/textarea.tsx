import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-charcoal shadow-sm outline-none transition focus:border-turquoise focus:ring-4 focus:ring-turquoise/15",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
