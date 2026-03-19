'use client'

import { useBilan } from "@/context/BilanContext";
import { useRouter } from "next/navigation";
import {AlertTriangle, ClipboardList, Clock, Play, Trash2} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {Button} from "@/components/ui/button";

export default function HomePage() {

  const router = useRouter()
  const {bilan, clearBilan} = useBilan()

  const hasActiveBilan = bilan.createdAt !== ''

  const startNewIntervention = () => {
    clearBilan()

    router.push('/bilan/circonstanciel')
  }

  return (
    <div className='min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4'>
      <div className='text-center mb-8'>
        <div className='flex justify-center mb-3'>
          <div className='bg-red-600 p-4 rounded-full'>
            <AlertTriangle className='h-10 w-10 text-white' />
          </div>
        </div>
        <h1 className='text-3xl font-bold text-white'>Bilan Secours</h1>
        <p className='text-gray-400 mt-1'>Outil d'aide à la transmission SAMU</p>
      </div>

      {hasActiveBilan && (
          <Card className='w-full max-w-sm mb-4 border-orange-500 bg-gray-900' >
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <CardTitle className='etxt-orange-400 text-sm flex items-center gap-2'
                >
                  <Clock className='h-4 w-4'/>
                  Intervention en cours
                </CardTitle>
                <Badge variant='outline' className='border-orange-500 text-orange-400'>Actif</Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-gray-300 text-xs' >
                {/*Débutée le {format(new Date(bilan.createdAt), 'dd/MM/yyyy à HH:mm', {locale: fr})}*/}
              </p>
              <div className='grid grid-cols-3 gap-1 text-xs'>
                {['circonstanciel', 'primaire', 'secondaire'].map(step => (
                    <div
                        key={step}
                        className={`text-center py-1 rounded ${
                            Object.keys(bilan[step as keyof typeof bilan] || {}).length > 0
                                ? 'bg-green-900 text-green-400'
                                : 'bg-gray-800 text-gray-500'
                        }`}
                    >
                      {step.charAt(0).toUpperCase() + step.slice(1, 5)}.
                    </div>
                ))}
              </div>
              <Button
                  className='w-full bg-orange-600 hover:bg-orange-700'
                  onClick={() => router.push('/bilan/circonstanciel')}
              >
                <ClipboardList className='h-4 w-4 mr-2' />
                Reprendre le bilan
              </Button>
            </CardContent>
          </Card>
      )}

      <div className='w-full max-w-sm space-y-3'>
        <Button
          size='lg'
          className='w-full h-16 text-lg bg-red-600 hover:bg-red-700 text-white'
          onClick={startNewIntervention}
        >
          <Play className='h-6 w-6 mr-3'/>
          Nouvelle intervention
        </Button>





        {hasActiveBilan && (
            <>
              <Button
                  variant='outline'
                  size='lg'
                  className='w-full h-14 border-green-600 text-green-400 hover:bg-green-900'
                  onClick={() => router.push('/bilan/resume')}
              >
                <ClipboardList className='h-5 w-5 mr-2'/>
                Voir le résumé / Transmission
              </Button>

              <Button
                  variant='outline'
                  size='lg'
                  className='w-full h-12 border-gray-600 text-gray-400 hover:bg-gray-900'
                  onClick={() => {
                    if (confirm('Terminer et supprimer definitivement le bilan ?')) {
                      clearBilan()
                    }
                  }}
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Terminer l'intervention
              </Button>
            </>
        )}
      </div>

      <p className='text-gray-600 text-xs mt-8 text-center'>
        Aucune donnée n'est conservée après la session
      </p>
    </div>
  );
}
