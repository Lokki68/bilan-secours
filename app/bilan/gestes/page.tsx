import { HandMetal } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { GestesForm } from '@/components/bilan/gestes/GestesForm';

export default function GestesPage() {
  return (
      <div className="flex flex-col min-h-full">
        <PageHeader
            title="Gestes & Actions"
            subtitle="Gestes effectués sur la victime"
            icon={<HandMetal className="w-6 h-6" />}
            color="green"
        />
        <GestesForm />
      </div>
  );
}
