'use client'

import {usePathname} from "next/navigation";
import {useBilan} from "@/context/BilanContext";
import {cn} from "@/lib/utils";
import {CheckCircle2} from "lucide-react";

const STEPS = [
  {label: 'Circo', path: '/bilan/circonstanciel', key: 'circonstanciel'},
  {label: 'Primaire', path: '/bilan/primaire', key: 'primaire'},
  {label: 'A', path: '/bilan/secondaire/a', key: 'secondaireA'},
  {label: 'B', path: '/bilan/secondaire/b', key: 'secondaireB'},
  {label: 'C', path: '/bilan/secondaire/c', key: 'secondaireC'},
  {label: 'D', path: '/bilan/secondaire/d', key: 'secondaireD'},
  {label: 'E', path: '/bilan/secondaire/e', key: 'secondaireE'},
  {label: 'Résumé', path: '/bilan/resume', key: null}
] as const

export function StepIndicator() {
  const pathname = usePathname()
  const {completionStatus} = useBilan()

  return (
      <div className='bg-gray-900 border-b border-gray-800 px-2 py-2'>
        <div className='flex items-center justify-between overflow-x-auto gap-1 no-scrollbar'>
          {STEPS.map((step, index) => {
            const isActive = pathname === step.path
            const isDone = step.key !== null ? completionStatus[step.key as keyof typeof completionStatus] : false

            return (
                <div className='flex items-center shrink-0' key={step.path}>
                  <div
                    className={cn(
                        'flex flex-col items-center gap-0.5 px-1',
                        isActive && 'opacity-100',
                        !isActive && 'opacity-50',
                    )}
                  >
                    <div
                      className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                          isActive && 'bg-red-600 text-white ring-2 ring-RED-400 ring-offset-1 ring-offset-gray-900',
                          isDone && !isActive && 'bg-green-700 text-white',
                          !isDone && !isActive && 'bg-gray-700 text-gray-400',
                      )}
                    >
                      {isDone && !isActive ? (
                          <CheckCircle2 className='w-4 h-4' />
                        ) : (
                          <span>{step.label.slice(0, 1)}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                          'text-[9px] font-medium',
                          isActive ? 'text-red-400' : 'text-gray-500'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>

                  <div className='w-3 h-px bg-gray-700 shrink-0 mx-0.5' />
                </div>
            )
          })}
        </div>
      </div>
  )
}