'use client';

import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Thermometer, ScanSearch } from 'lucide-react';
import {NavigationButton} from "@/components/bilan/NavigationButton";

// Zone corporelle cliquable
function BodyZone({
                    label,
                    value,
                    onChange,
                    alert,
                  }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  alert?: boolean;
}) {
  return (
      <div
          className={cn(
              'bg-gray-800 rounded-xl p-3 border-2 transition-colors',
              value
                  ? alert
                      ? 'border-red-600'
                      : 'border-green-700'
                  : 'border-gray-700'
          )}
      >
        <label className="text-gray-300 text-xs font-semibold uppercase tracking-wide block mb-1.5">
          {label}
        </label>
        <Input
            placeholder="RAS / Décrire..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-600 text-sm h-9"
        />
      </div>
  );
}

const LESIONS = [
  { key: 'plaies', label: 'Plaies' },
  { key: 'brulures', label: 'Brûlures' },
  { key: 'fractures', label: 'Fractures' },
  { key: 'deformations', label: 'Déformations' },
  { key: 'oedemes', label: 'Œdèmes' },
] as const;

export function BilanEForm() {
  const { bilan, updateBilanE } = useBilan();
  const e = bilan.secondaire.E;

  const tempValue = parseFloat(e.temperature);
  const tempAlert =
      !isNaN(tempValue) && (tempValue < 36 || tempValue > 38.5);

  const hasLesion =
      e.plaies || e.brulures || e.fractures || e.deformations || e.oedemes;

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        {/* Température */}
        <SectionCard
            title="Température"
            icon={<Thermometer className="w-4 h-4" />}
            urgent={tempAlert}
        >
          <FieldRow
              label="Température corporelle"
              hint="Normale : 36°C - 38.5°C"
              alert={tempAlert ? `${tempValue}°C — Hors norme` : undefined}
          >
            <div className="relative">
              <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 37.2"
                  value={e.temperature}
                  onChange={(ev) => updateBilanE({ temperature: ev.target.value })}
                  className={cn(
                      'bg-gray-800 border-gray-700 text-white pr-8 text-2xl font-bold h-14',
                      tempAlert && 'border-orange-500 text-orange-400'
                  )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
              °C
            </span>
            </div>
          </FieldRow>

          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Hypothermie">
              <ToggleButtonGroup
                  options={[
                    { value: 'false', label: 'Non', color: 'green' },
                    { value: 'true', label: 'Oui', color: 'blue' },
                  ]}
                  value={String(e.hypothermie)}
                  onChange={(v) => updateBilanE({ hypothermie: v === 'true' })}
                  columns={2}
                  size="sm"
              />
            </FieldRow>
            <FieldRow label="Hyperthermie">
              <ToggleButtonGroup
                  options={[
                    { value: 'false', label: 'Non', color: 'green' },
                    { value: 'true', label: 'Oui', color: 'red' },
                  ]}
                  value={String(e.hyperthermie)}
                  onChange={(v) => updateBilanE({ hyperthermie: v === 'true' })}
                  columns={2}
                  size="sm"
              />
            </FieldRow>
          </div>
        </SectionCard>

        {/* Lésions identifiées */}
        <SectionCard
            title="Lésions identifiées"
            urgent={hasLesion}
        >
          <div className="flex flex-wrap gap-2">
            {LESIONS.map((lesion) => {
              const isActive = e[lesion.key];
              return (
                  <button
                      key={lesion.key}
                      type="button"
                      onClick={() => updateBilanE({ [lesion.key]: !isActive })}
                      className={cn(
                          'px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all active:scale-95',
                          isActive
                              ? 'bg-red-700 border-red-500 text-white'
                              : 'bg-gray-800 border-gray-700 text-gray-400'
                      )}
                  >
                    {lesion.label}
                  </button>
              );
            })}
          </div>
        </SectionCard>

        {/* Examen tête-pied */}
        <SectionCard
            title="Examen tête-pied"
            icon={<ScanSearch className="w-4 h-4" />}
        >
          <div className="grid grid-cols-1 gap-3">
            <BodyZone
                label="Tête / Face"
                value={e.tete}
                onChange={(v) => updateBilanE({ tete: v })}
            />
            <BodyZone
                label="Cou / Rachis cervical"
                value={e.cou}
                onChange={(v) => updateBilanE({ cou: v })}
            />
            <BodyZone
                label="Thorax"
                value={e.thorax}
                onChange={(v) => updateBilanE({ thorax: v })}
            />
            <BodyZone
                label="Abdomen"
                value={e.abdomen}
                onChange={(v) => updateBilanE({ abdomen: v })}
            />
            <BodyZone
                label="Bassin / Périnée"
                value={e.bassin}
                onChange={(v) => updateBilanE({ bassin: v })}
            />

            {/* Membres */}
            <div className="grid grid-cols-2 gap-3">
              <BodyZone
                  label="Membre Sup. Droit"
                  value={e.membreSupDroit}
                  onChange={(v) => updateBilanE({ membreSupDroit: v })}
              />
              <BodyZone
                  label="Membre Sup. Gauche"
                  value={e.membreSupGauche}
                  onChange={(v) => updateBilanE({ membreSupGauche: v })}
              />
              <BodyZone
                  label="Membre Inf. Droit"
                  value={e.membreInfDroit}
                  onChange={(v) => updateBilanE({ membreInfDroit: v })}
              />
              <BodyZone
                  label="Membre Inf. Gauche"
                  value={e.membreInfGauche}
                  onChange={(v) => updateBilanE({ membreInfGauche: v })}
              />
            </div>

            <BodyZone
                label="Dos / Rachis dorso-lombaire"
                value={e.dos}
                onChange={(v) => updateBilanE({ dos: v })}
            />
          </div>
        </SectionCard>

        <SectionCard title="Commentaire général">
          <Textarea
              placeholder="Observations complémentaires..."
              value={e.commentaire}
              onChange={(ev) => updateBilanE({ commentaire: ev.target.value })}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 min-h-[80px]"
          />
        </SectionCard>

        <NavigationButton
            prevPath="/bilan/secondaire/d"
            nextPath="/bilan/resume"
            nextLabel="Résumé & Transmission"
            nextVariant="primary"
        />
      </div>
  );
}
