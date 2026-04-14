 'use client'

 import {useRouter} from "next/navigation";
 import {cn} from "@/lib/utils";
 import {Button} from "@/components/ui/button";
 import {ChevronLeft, ChevronRight, FileText} from "lucide-react";

 interface NavigationButtonProps {
   prevPath?: string
   nextPath?: string
   nextLabel?: string
   onNext?: () => void
   nextVariant?: 'default' | 'primary'
 }

 export function NavigationButton({
     prevPath,
     nextPath,
     nextLabel,
     onNext,
     nextVariant = 'default',
}: NavigationButtonProps) {
  const router = useRouter()

   const handleNext = () => {
    onNext?.()
     if (nextPath) router.push(nextPath)
   }

   const handlePrev = () => {
    if (prevPath) router.push(prevPath)
   }

  return (
      <div
        className={cn(
            'flex gap-3 p-4',
        )}
      >
        {prevPath && (
            <Button
              variant='outline'
              size='lg'
              className='flex-1 h-12 border-gray-700 text-gray-300 hover:bg-gray-800'
              onClick={handlePrev}
            >
              <ChevronLeft className='h-5 w-5 mr-1' />
              Retour
            </Button>
        )}

        {nextPath && (
            <Button
              size='lg'
              className={cn(
                  'h-12 bg-red-700 hover:bg-red-600 text-white font-semibold',
                  prevPath ? 'flex-2' : 'flex-1'
              )}
              onClick={handleNext}
            >
              {nextVariant === 'primary' && <FileText className='w-4 h-4 mr-2' />}
              {nextLabel}
              {nextVariant !== 'primary' && <ChevronRight className='h-4 w-4 ml-1'/>}
            </Button>
        )}
      </div>
  )
 }