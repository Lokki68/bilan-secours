'use client'

import { useBilan } from "@/context/BilanContext";
import { useRouter } from "next/navigation";
import {AlertTriangle, ClipboardList, Clock, Play, ShieldAlert, Siren, Trash2} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

export default function HomePage() {

  const router = useRouter()
  const {bilan, resetBilan} = useBilan()

  const hasExistingSession = bilan.heureDebutIntervention !== '' && bilan.id !== ''

  const handleNewIntervention = () => {
    resetBilan()
    router.push('/bilan/circonstanciel')
  }

  const handleResumeIntervention = () => {
    router.push('/bilan/circonstanciel')
  }
  return (
    <div className='flex flex-col min-h-screen bg-gray-950 px-4 py-8'>
      <div className='flex flex-col items-center justify-center flex-1 gap-8'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-20 h-20 rounded-full bg-red-700/20 border-2 border-red-600 flex items-center justify-center '>
            <Siren className='h-10 w-10 text-red-500' />
          </div>
          <h1 className='text-3xl font-bold text-white tracking-tight'>
            Bilan Secours
          </h1>
          <p className='text-gray-400 text-sm text-center max-w-xs'>
            Outils d'aide à la réalisation et transmission de bilan SAP
          </p>
        </div>

        <div className='w-full max-w-sm space-y-3'>
          {hasExistingSession && (
            <div className='rounded-xl border border-orange-800/60 bg-orange-950/30 p-4'>
              <div className='flex items-center gap-2 mb-3'>
                <Clock className='w-4 h-4 text-orange-400' />
                <span className='text-orange-300 text-sm font-semibold'>
                  Intervention en cours
                </span>
              </div>
              <p className='text-gray-400 text-xs mb-3'>
                Débutée à <span className='text-white font-mono' >{bilan.heureDebutIntervention.slice(11,16)}</span>
              </p>
              <Button
                  size='lg'
                className='w-full h-12 bg-orange-700 hover-bg-orange-600 text-white font-semibold'
                  onClick={handleResumeIntervention}
              >
                Reprendre intervention
              </Button>
            </div>
          )}

          <Button
            size='lg'
            className='w-full h-14 bg-red-700 hover:bg-red-600 text-white font-bold text-lg'
            onClick={handleNewIntervention}
          >
            <ShieldAlert className='w-5 h-5 mr-2' />
            Nouvelle intervention
          </Button>

          <p className='text-center text-gray-600 text-xs'>
            Aucune donnée n'est conservée après la session
          </p>
        </div>
      </div>

    </div>
  );
}
