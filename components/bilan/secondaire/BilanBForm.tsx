'use client';

import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Activity, Gauge, AlertTriangle } from 'lucide-react';
import {NavigationButton} from "@/components/bilan/NavigationButton";

export function BilanBForm() {
  const { bilan, updateBilanB } = useBilan();
  const b = bilan.secondaire.B;

  // Calcul alerte SpO2
  const spo2Value = parseInt(b.spo2);
  const spo2Alert = !isNaN(spo2Value) && spo2Value < 95;
  const spo2Danger = !isNaN(spo2Value) && spo2Value < 90;

  // Calcul alerte FR
  const frValue = parseInt(b.frequenceRespiratoire);
  const frAlert = !isNaN(frValue) && (frValue < 12 || frValue > 20);

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        {/* Fréquence respiratoire */}
        <SectionCard
            title="Fréquence respiratoire"
            icon={<Activity className="w-4 h-4" />}
            urgent={frAlert}
        >
          <FieldRow
              label="Fréquence"
              hint="Normale : 12-20 /min"
              alert={frAlert ? `${frValue}/min — Hors norme !` : undefined}
          >
            <div className="relative">
              <Input
                  type="number"
                  placeholder="Ex: 16"
                  value={b.frequenceRespiratoire}
                  onChange={(e) =>
                      updateBilanB({ frequenceRespiratoire: e.target.value })
                  }
                  className={cn(
                      'bg-gray-800 border-gray-700 text-white pr-16 text-lg font-bold',
                      frAlert && 'border-orange-500',
                      frValue < 8 && 'border-red-500'
                  )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              /min
            </span>
            </div>
          </FieldRow>

          <FieldRow label="Rythme">
            <ToggleButtonGroup
                options={[
                  { value: 'REGULIER', label: 'Régulier', color: 'green' },
                  { value: 'IRREGULIER', label: 'Irrégulier', color: 'red' },
                ]}
                value={b.rythme}
                onChange={(v) => updateBilanB({ rythme: v as typeof b.rythme })}
                columns={2}
                size="sm"
            />
          </FieldRow>

          <FieldRow label="Amplitude">
            <ToggleButtonGroup
                options={[
                  { value: 'NORMALE', label: 'Normale', color: 'green' },
                  { value: 'SUPERFICIELLE', label: 'Superficielle', color: 'orange' },
                  { value: 'PROFONDE', label: 'Profonde', color: 'orange' },
                ]}
                value={b.amplitude}
                onChange={(v) => updateBilanB({ amplitude: v as typeof b.amplitude })}
                columns={3}
                size="sm"
            />
          </FieldRow>
        </SectionCard>

        {/* SpO2 */}
        <SectionCard
            title="Saturation SpO2"
            icon={<Gauge className="w-4 h-4" />}
            urgent={spo2Danger}
        >
          <FieldRow
              label="SpO2"
              hint="Normale > 95%"
              alert={
                spo2Danger
                    ? `${spo2Value}% — Danger !`
                    : spo2Alert
                        ? `${spo2Value}% — Attention`
                        : undefined
              }
          >
            <div className="relative">
              <Input
                  type="number"
                  placeholder="Ex: 98"
                  min={0}
                  max={100}
                  value={b.spo2}
                  onChange={(e) => updateBilanB({ spo2: e.target.value })}
                  className={cn(
                      'bg-gray-800 border-gray-700 text-white pr-8 text-2xl font-bold h-14',
                      spo2Alert && !spo2Danger && 'border-orange-500 text-orange-400',
                      spo2Danger && 'border-red-500 text-red-400'
                  )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
              %
            </span>
            </div>
          </FieldRow>

          <FieldRow label="Sous O2 ?">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Air ambiant', color: 'green' },
                  { value: 'true', label: 'Sous O2', color: 'blue' },
                ]}
                value={String(b.spo2SousO2)}
                onChange={(v) => updateBilanB({ spo2SousO2: v === 'true' })}
                columns={2}
                size="sm"
            />
          </FieldRow>

          {b.spo2SousO2 && (
              <FieldRow label="Débit O2">
                <div className="relative">
                  <Input
                      type="number"
                      placeholder="Ex: 9"
                      value={b.debitO2}
                      onChange={(e) => updateBilanB({ debitO2: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                L/min
              </span>
                </div>
              </FieldRow>
          )}
        </SectionCard>

        {/* Auscultation */}
        <SectionCard title="Auscultation">
          <FieldRow label="Symétrie du thorax">
            <ToggleButtonGroup
                options={[
                  { value: 'true', label: 'Symétrique', color: 'green' },
                  { value: 'false', label: 'Asymétrique', color: 'red' },
                ]}
                value={String(b.symetrieThorax)}
                onChange={(v) => updateBilanB({ symetrieThorax: v === 'true' })}
                columns={2}
                size="sm"
            />
          </FieldRow>

          <FieldRow label="Murmure vésiculaire">
            <ToggleButtonGroup
                options={[
                  { value: 'NORMAL', label: 'Normal', color: 'green' },
                  { value: 'DIMINUE', label: 'Diminué', color: 'orange' },
                  { value: 'ABSENT', label: 'Absent', color: 'red' },
                  { value: 'SIBILANTS', label: 'Sibilants', color: 'orange' },
                  { value: 'RONCHIS', label: 'Ronchis', color: 'orange' },
                ]}
                value={b.murmureVesiculaire}
                onChange={(v) =>
                    updateBilanB({ murmureVesiculaire: v as typeof b.murmureVesiculaire })
                }
                columns={3}
                size="sm"
            />
          </FieldRow>
        </SectionCard>

        {/* Détresse */}
        <SectionCard
            title="Détresse respiratoire"
            icon={<AlertTriangle className="w-4 h-4" />}
            urgent={b.detresseRespiratoire}
        >
          <FieldRow label="Détresse respiratoire ?">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Non', color: 'green' },
                  { value: 'true', label: 'Oui', color: 'red' },
                ]}
                value={String(b.detresseRespiratoire)}
                onChange={(v) =>
                    updateBilanB({ detresseRespiratoire: v === 'true' })
                }
                columns={2}
                size="md"
            />
          </FieldRow>

          <FieldRow label="Signes de lutte ?">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Non', color: 'green' },
                  { value: 'true', label: 'Oui', color: 'orange' },
                ]}
                value={String(b.signesLutte)}
                onChange={(v) => updateBilanB({ signesLutte: v === 'true' })}
                columns={2}
                size="sm"
            />
          </FieldRow>
        </SectionCard>

        <SectionCard title="Commentaire">
          <Textarea
              placeholder="Observations ventilatoires..."
              value={b.commentaire}
              onChange={(e) => updateBilanB({ commentaire: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 min-h-[80px]"
          />
        </SectionCard>

        <NavigationButton
            prevPath="/bilan/secondaire/a"
            nextPath="/bilan/secondaire/c"
            nextLabel="C — Circulation"
        />
      </div>
  );
}
