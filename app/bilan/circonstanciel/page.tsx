'use client'

import {PageHeader} from "@/components/layout/PageHeader";
import {MapPin} from "lucide-react";
import {CirconstancielForm} from "@/components/bilan/circonstanciel/CirconstancielForm";

export default function CirconstancielPage() {
  return (
      <div className='flex flex-col min-h-full'>
        <PageHeader
          title='Bilan Circonstanciel'
          subtitle='Context et informations de la victime'
          icon={<MapPin className='w-6 h-6' />}
          color='orange'
        />
        <CirconstancielForm />
      </div>
  )
}