'use client'

import {PageHeader} from "@/components/layout/PageHeader";
import {Brain} from "lucide-react";
import {BilanDForm} from "@/components/bilan/secondaire/BilanDForm";

export  default  function SecondaireDPage () {
  return (
      <div className='flex flex-col min-h-full'>
        <PageHeader
          title='D - Disability'
          subtitle='Etat neurologique'
          icon={<Brain className='w-6 h-6'/>}
          color='orange'
        />
        <BilanDForm />
      </div>
  )
}