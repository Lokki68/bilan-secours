'use client'

import {cn} from "@/lib/utils";

interface Option {
  value: string
  label: string
  color?: 'default' | 'green' | 'orange' | 'red' | 'blue'
}

interface ToggleButtonGroupProps<T extends string> {
  options: Option[]
  value: string
  onChange: (value: string) => void
  columns?: 2 | 3 | 4
  size?: 'sm' | 'md' | 'lg'
}

const colorActive = {
  default: 'bg-gray-600 border-gray-500 text-white',
  green: 'bg-green-700 border-green-500 text-white',
  orange: 'bg-orange-700 border-orange-500 text-white',
  red: 'bg-red-700 border-red-500 text-white',
  blue: 'bg-blue-700 border-blue-500 text-white',
}

const sizeMap = {
  sm: 'py-2 text-xs',
  md: 'py-3 text-sm',
  lg: 'py-4 text-base',
}

const colsMap = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

export function ToggleButtonGroup<T extends string>({
    options,
    value,
    onChange,
    columns = 2,
    size = 'sm',
 }: ToggleButtonGroupProps<T>) {
  return (
      <div
        className={cn(
            'grid gap-2',
            colsMap[columns],
        )}
      >
        {options.map((option) => {
          const isSelected = value === option.value
          const color = option.color ?? 'default'

          return (
              <button
                  key={option.value}
                  type='button'
                  onClick={() => onChange(option.value)}
                  className={cn(
                      'rounded-lg border-2 font-semibold transition-all duration-150',
                      'active:scale-95 selec-none',
                      sizeMap[size],
                      isSelected
                        ? colorActive[color]
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      ,
                  )}
              >
                {option.label}
              </button >
          )
        })}
      </div>
  )
}