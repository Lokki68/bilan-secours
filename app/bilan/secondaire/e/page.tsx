import {PageHeader} from "@/components/layout/PageHeader";
import {BilanEForm} from "@/components/bilan/secondaire/BilanEForm";
import {ScanSearch} from "lucide-react";

' use client'

export default function SecondaireEPage() {
  return (
      <div className='flex flex-col min-h-full'>
        <PageHeader
          title="E - Exposure"
          subtitle='Examen tête-pied & exposition'
          icon={<ScanSearch className='w-6 h-6' />}
          color='green'
        />
        <BilanEForm />
      </div>
  )
}