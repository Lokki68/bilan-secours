import {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  color?: 'red' | 'orange' | 'blue' | 'green' | 'purple'
  children?: ReactNode
}

const colorMap = {
  red: 'from-red-900/50 to-red-950/30 border-red-800/50',
  orange: 'from-orange-900/50 to-orange-950/30 border-orange-800/50',
  blue: 'from-blue-900/50 to-blue-950/30 border-blue-800/50',
  green: 'from-green-900/50 to-green-950/30 border-green-800/50',
  purple: 'from-purple-900/50 to-purple-950/30 border-purple-800/50',
}

const iconColorMap = {
  red: 'text-red-400',
  orange: 'text-orange-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
}

export function PageHeader({
    title,
    subtitle,
    icon,
    color = 'red',
    children
}: PageHeaderProps) {
  return (
      <div
        className={cn(
            'bg-linear-to-r border-b px-4 py-3',
            colorMap[color]
        )}
      >
        <div className='flex items-center gap-3'>
          {icon && (
              <div className={cn('shrink-0', iconColorMap[color])}>
                {icon}
              </div>
          )}
          <div className='flex-1 min-w-0'>
            <h1 className='text-white font-bold text-lg leading-tight' >{title}</h1>
            {subtitle && <p className='text-gray-400 text-xs mt-0.5' >{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
  )
}