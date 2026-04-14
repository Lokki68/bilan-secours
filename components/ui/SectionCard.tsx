import {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface SectionCardProps {
  title: string
  icon?: ReactNode
  children:ReactNode
  className?: string
  urgent?: boolean
}

export function SectionCard({
    title,
    icon,
    children,
    className,
    urgent = false
}: SectionCardProps) {
  return (
      <div
        className={cn(
            'rounded-xl border bg-gray-900',
            urgent ? 'border-red-800/60' : 'border-gray-800',
            className
        )}
      >
        <div
          className={cn(
              'flex items-center gap-2 px-4 py-2.5 border-b rounded-t-xl',
              urgent ? 'bg-red-950/40 border-red-800/60' : 'bg-gray-800/50 border-gray-800'
          )}
        >
          {icon && (
              <span className={cn(urgent ? 'text-red-400' : 'text-gra-y-400')}>
                {icon}
              </span>
          )}
          <h3
            className={cn(
                'text-sm font-semiblold uppercase tracking-wide',
                urgent ? 'text-red-300' : 'text-gray-300'
            )}
          >
            {title}
          </h3>
        </div>
        <div className='p-4 space-y-4'>{children}</div>
      </div>
  )
}