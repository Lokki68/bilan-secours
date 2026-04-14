'use client';

import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { NavigationButton } from '@/components/bilan/NavigationButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wind } from 'lucide-react';
import {useEffect} from "react";

const RYTHME_OPTIONS = [
  { value: 'REGULIER', label: 'Régulier', color: 'green' },
  { value: 'IRREGULIER', label: 'Irrégulier', color: 'orange' },
] as const;

const AMPLITUDE_OPTIONS = [
  { value: 'NORMALE', label: 'Normale', color: 'green' },
  { value: 'SUPERFICIELLE', label: 'Superficielle', color: 'orange' },
  { value: 'PROFONDE', label: 'Profonde', color: 'blue' },
  { value: 'ABSENTE', label: 'Absente', color: 'red' },
] as const;

const SYMETRIE_OPTIONS = [
  { value: 'true', label: 'Symétrique', color: 'green' },
  { value: 'false', label: 'Asymétrique', color: 'red' },
] as const;

const MV_OPTIONS = [
  { value: 'PRESENT', label: 'Présent', color: 'green' },
  { value: 'DIMINUE', label: 'Diminué', color: 'orange' },
  { value: 'ABSENT', label: 'Absent', color: 'red' },
] as const;

const BOOL_OPTIONS = [
  { value: 'false', label: 'Non', color: 'green' },
  { value: 'true', label: 'Oui', color: 'red' },
] as const;

export function BilanBForm() {
  const { bilan, updateBilanB } = useBilan();
  const b = bilan.secondaire.B;

  useEffect(() => {
    if (!b.frequenceRespiratoire && bilan.primaire.frequenceRespiratoire) {
      updateBilanB({frequenceRespiratoire: bilan.primaire.frequenceRespiratoire})
    }
  }, []);


  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        {/* ── FRÉQUENCE ── */}
        <SectionCard
            title="Fréquence Respiratoire"
            icon={<Wind className="w-4 h-4" />}
            urgent={
                b.detresseRespiratoire ||
                Number(b.frequenceRespiratoire) < 12 ||
                Number(b.frequenceRespiratoire) > 20
            }
        >
          <FieldRow label="FR (/min)">
            <Input
                type="number"
                inputMode="numeric"
                value={b.frequenceRespiratoire}
                onChange={(e) =>
                    updateBilanB({ frequenceRespiratoire: e.target.value })
                }
                placeholder="Normale: 12–20"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>

          {b.frequenceRespiratoire && (
              <div className="mt-2">
                {Number(b.frequenceRespiratoire) < 12 && (
                    <p className="text-orange-400 text-xs font-bold">
                      ⚠️ Bradypnée (&lt;12/min)
                    </p>
                )}
                {Number(b.frequenceRespiratoire) > 20 && (
                    <p className="text-orange-400 text-xs font-bold">
                      ⚠️ Tachypnée (&gt;20/min)
                    </p>
                )}
              </div>
          )}
        </SectionCard>

        {/* ── RYTHME & AMPLITUDE ── */}
        <SectionCard title="Qualité Respiratoire">
          <FieldRow label="Rythme">
            <ToggleButtonGroup
                options={RYTHME_OPTIONS}
                value={b.rythme}
                onChange={(v) => updateBilanB({ rythme: v })}
                columns={2}
            />
          </FieldRow>

          <FieldRow label="Amplitude">
            <ToggleButtonGroup
                options={AMPLITUDE_OPTIONS}
                value={b.amplitude}
                onChange={(v) => updateBilanB({ amplitude: v })}
                columns={2}
            />
          </FieldRow>

          <FieldRow label="Symétrie thoracique">
            <ToggleButtonGroup
                options={SYMETRIE_OPTIONS}
                value={String(b.symetrieThorax)}
                onChange={(v) => updateBilanB({ symetrieThorax: v === 'true' })}
                columns={2}
            />
          </FieldRow>

          <FieldRow label="Murmure vésiculaire">
            <ToggleButtonGroup
                options={MV_OPTIONS}
                value={b.murmureVesiculaire}
                onChange={(v) => updateBilanB({ murmureVesiculaire: v })}
                columns={3}
            />
          </FieldRow>
        </SectionCard>

        {/* ── SPO2 ── */}
        <SectionCard
            title="SpO2"
            icon={<Wind className="w-4 h-4" />}
            urgent={Number(b.spo2) < 95}
        >
          <FieldRow label="SpO2 (%)">
            <Input
                type="number"
                inputMode="numeric"
                value={b.spo2}
                onChange={(e) => updateBilanB({ spo2: e.target.value })}
                placeholder="ex: 98"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>

          {b.spo2 && Number(b.spo2) < 95 && (
              <p className="text-red-400 text-xs font-bold mt-1">
                🚨 SpO2 basse — oxygénothérapie recommandée
              </p>
          )}

          <FieldRow label="Sous O2 ?">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Air ambiant', color: 'green' },
                  { value: 'true', label: 'Sous O2', color: 'blue' },
                ]}
                value={String(b.spo2SousO2)}
                onChange={(v) => updateBilanB({ spo2SousO2: v === 'true' })}
                columns={2}
            />
          </FieldRow>

          {b.spo2SousO2 && (
              <FieldRow label="Débit O2 (L/min)">
                <Input
                    type="number"
                    inputMode="decimal"
                    value={b.debitO2}
                    onChange={(e) => updateBilanB({ debitO2: e.target.value })}
                    placeholder="ex: 9"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                />
              </FieldRow>
          )}
        </SectionCard>

        {/* ── DÉTRESSE ── */}
        <SectionCard
            title="Signes de détresse"
            urgent={b.detresseRespiratoire || b.signesLutte}
        >
          <FieldRow label="Détresse respiratoire">
            <ToggleButtonGroup
                options={BOOL_OPTIONS}
                value={String(b.detresseRespiratoire)}
                onChange={(v) =>
                    updateBilanB({ detresseRespiratoire: v === 'true' })
                }
                columns={2}
            />
          </FieldRow>

          <FieldRow label="Signes de lutte">
            <ToggleButtonGroup
                options={BOOL_OPTIONS}
                value={String(b.signesLutte)}
                onChange={(v) => updateBilanB({ signesLutte: v === 'true' })}
                columns={2}
            />
          </FieldRow>
        </SectionCard>

        {/* ── COMMENTAIRE ── */}
        <SectionCard title="Commentaire">
          <Textarea
              value={b.commentaire}
              onChange={(e) => updateBilanB({ commentaire: e.target.value })}
              placeholder="Observations respiratoires..."
              rows={3}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 resize-none"
          />
        </SectionCard>

        <NavigationButton
            prevPath="/bilan/secondaire/a"
            nextPath="/bilan/secondaire/c"
            nextLabel="Secondaire C"
        />
      </div>
  );
}
