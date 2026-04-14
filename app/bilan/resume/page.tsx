'use client'

import {PageHeader} from "@/components/layout/PageHeader";
import {FileText} from "lucide-react";
import {ResumeTransmission} from "@/components/bilan/ResumeTransmission";

export default function ResumePage() {
  return (
      <div className='flex flex-col min-h-full'>
        <PageHeader
          title='Résumé & Transmission'
          subtitle='Synthèse du bilan complet'
          icon={<FileText className='w-6 h-6' />}
          color='orange'
        />
        <ResumeTransmission />
      </div>
  )
}