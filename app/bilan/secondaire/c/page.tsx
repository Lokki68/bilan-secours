'use client'

import {PageHeader} from "@/components/layout/PageHeader";
import {Heart} from "lucide-react";
import {BilanCForm} from "@/components/bilan/secondaire/BilanCForm";

export default function SecondaireCPage() {
  return (
      <div className='flex flex-col min-h-full'>
        <PageHeader
          title='C - Circulation'
          subtitle='Hémodynamique et perfusion'
          icon={<Heart className='w-6 h-6' />}
          color='red'
        />
        <BilanCForm />
      </div>
  )
}