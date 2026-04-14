'use client'

import {Stethoscope} from 'lucide-react'

import {PageHeader} from "@/components/layout/PageHeader";
import {BilanBForm} from "@/components/bilan/secondaire/BilanBForm";

export default function SecondaireBPage() {
  return (
      <div className='flex flex-col min-h-full'>
        <PageHeader
          title="B -Breathing"
          subtitle='Ventilation et respiration'
          icon={<Stethoscope/>}
          color='blue'
        />
        <BilanBForm />
      </div>
  )
}