'use client'

import {usePathname, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";

const STEPS = [
  {label: 'Circonstanciel', path: '/bilan/circonstanciel', short: 'Circon.'},
  {label: 'Primaire', path: '/bilan/primaire', short: 'Primaire'},
  {label: 'Secondaire', path: '/bilan/secondaire', short: 'Second.'},
  {label: 'Résumé', path: '/bilan/resume', short: 'Résumé'},
]

export function MobileNav() {
  const router = useRouter()
  const pathname = usePathname()

  const currentIndex = STEPS.findIndex(step => pathname.includes(step.path.split('/')[2]))
  const progress = ((currentIndex +1) / STEPS.length) * 100

  return (
      <div className='bg-gray-900 border-b border-gray-800 px-4 py-3'>
        <div className='flex justify-between mb-2'>
          {STEPS.map((step, idx) => (
              <button
                key={step.path}
                onClick={() => router.push(step.path)}
                className={cn(
                    'text-xs font-medium transition-colors',
                    idx === currentIndex
                    ? 'text-red-400'
                        : idx < currentIndex
                    ? 'text-green-500'
                        : 'text-gray-600'

                )}
              >
                {idx < currentIndex ? '✓ ' : ''}{step.short}
              </button>
          ))}
        </div>

        <Progress value={progress} className='h-1 bg-gray-800' />

        <div className='flex justify-between mt-2'>
          <Button
            variant='ghost'
            size='sm'
            className='text-gray-400 h-7 px-2'
            disabled={currentIndex <= 0}
            onClick={()=> currentIndex > 0 && router.push(STEPS[currentIndex - 1].path)}
          >
            <ChevronLeft className='h-4 w-4 mr-1'/>
            Précédent
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='text-gray-400 h-7 px-2'
            disabled={currentIndex >= STEPS.length -1}
            onClick={() => currentIndex < STEPS.length -1 && router.push(STEPS[currentIndex +1].path)}
          >
            Suivant
            <ChevronRight className='h-4 w-4 ml-1' />
          </Button>
        </div>
      </div>
  )
}