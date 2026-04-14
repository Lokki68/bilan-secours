import {ReactNode} from "react";
import {StepIndicator} from "@/components/layout/StepIndicator";

export default function BilanLayout({
    children,
}: {children: ReactNode}) {
  return (
      <div className='flex flex-col flex-1 m-4'>
        <StepIndicator />
        <div className='flex-1 overflow-y-auto'>{children}</div>
      </div>
  )
}