'use client'

import {PageHeader} from "@/components/layout/PageHeader";
import {Activity} from "lucide-react";
import {PrimaireForm} from "@/components/bilan/primaire/PrimaireForm";

export default function PrimairePage() {
  return (
      <div className='flex flex-col min-h-full'>
        <PageHeader
          title="Bilan Primaire"
          subtitle='Détresse vitale - AVPU / Ventilation / Circulation'
          icon={<Activity className='w-6 h-6'/>}
          color='red'
        />
        <PrimaireForm/>
      </div>
  )
}