import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {AlertCircle} from "lucide-react";

interface FieldRowProps {
  label: string
  required?: boolean
  children?: ReactNode
  className?: string
  hint?: string
  alert?: string
}

export function FieldRow({
    label,
    required,
    children,
    className,
    hint,
    alert
}: FieldRowProps) {
  return (
      <div
        className={cn('space-y-1.5', className)}
      >
        <Label
          className="text-gray-300 text-sm font-medium"
        >
          {label}
          {required && <span className='text-red-400 ml-1'>*</span>}
        </Label>
        {children}
        {hint && <p className='text-gray-500 text-xs'>{hint}</p>}
        {alert && <span className='text-orange-400 text-[10px] font-semibold flex items-center gap-1'>
          <AlertCircle className='w-3 h-3' />
          {alert}
        </span>}
      </div>
  )
}