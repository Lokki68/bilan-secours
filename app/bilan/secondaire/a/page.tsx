'use client'

import {PageHeader} from "@/components/layout/PageHeader";
import {Wind} from "lucide-react";
import {BilanAForm} from "@/components/bilan/secondaire/BilanAForm";

export default function SecondairePage() {
  return (
      <div className='flex flex-col min-h-full'>
        <PageHeader
          title="A - Airway"
          subtitle="Voies Aériennes"
          icon={<Wind className='w-6 h-6'/>}
          color='blue'
        />
        <BilanAForm />
      </div>
  )
}