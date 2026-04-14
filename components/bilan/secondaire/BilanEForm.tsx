'use client';

import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { NavigationButton } from '@/components/bilan/NavigationButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Thermometer, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Zones corporelles ──
const ZONES = [
  { key: 'tete', label: 'Tête' },
  { key: 'cou', label: 'Cou / Rachis cerv.' },
  { key: 'thorax', label: 'Thorax' },
  { key: 'abdomen', label: 'Abdomen' },
  { key: 'bassin', label: 'Bassin' },
  { key: 'dos', label: 'Dos / Rachis' },
  { key: 'membreSupDroit', label: 'Membre sup. D' },
  { key: 'membreSupGauche', label: 'Membre sup. G' },
  { key: 'membreInfDroit', label: 'Membre inf. D' },
  { key: 'membreInfGauche', label: 'Membre inf. G' },
] as const;

const LESION_TYPES = [
  'RAS',
  'Plaie',
  'Contusion',
  'Fracture',
  'Brûlure',
  'Œdème',
  'Déformation',
  'Douleur',
  'Hématome',
] as const;

const BOOL_OPTIONS = [
  { value: 'false', label: 'Non', color: 'green' },
  { value: 'true', label: 'Oui', color: 'red' },
] as const;

// ── Sélecteur de lésion par zone ──
function ZoneSelector({
                        zone,
                        value,
                        onChange,
                      }: {
  zone: { key: string; label: string };
  value: string;
  onChange: (v: string) => void;
}) {
  return (
      <div className="bg-gray-800 rounded-xl p-3 space-y-2">
        <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">
          {zone.label}
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {LESION_TYPES.map((type) => {
            const isActive = value === type;
            return (
                <button
                    key={type}
                    type="button"
                    onClick={() => onChange(isActive ? '' : type)}
                    className={cn(
                        'rounded-lg border py-1.5 px-1 text-xs font-semibold text-center',
                        'transition-all active:scale-95',
                        isActive
                            ? type === 'RAS'
                                ? 'bg-green-800 border-green-600 text-white'
                                : 'bg-red-800 border-red-600 text-white'
                            : 'bg-gray-900 border-gray-700 text-gray-500'
                    )}
                >
                  {type}
                </button>
            );
          })}
        </div>
      </div>
  );
}

export function BilanEForm() {
  const { bilan, updateBilanE } = useBilan();
  const e = bilan.secondaire.E;

  const updateZone = (key: string, value: string) => {
    updateBilanE({ [key]: value });
  };

  const zoneValues: Record<string, string> = {
    tete: e.tete,
    cou: e.cou,
    thorax: e.thorax,
    abdomen: e.abdomen,
    bassin: e.bassin,
    dos: e.dos,
    membreSupDroit: e.membreSupDroit,
    membreSupGauche: e.membreSupGauche,
    membreInfDroit: e.membreInfDroit,
    membreInfGauche: e.membreInfGauche,
  };

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        {/* ── TEMPÉRATURE ── */}
        <SectionCard
            title="Température"
            icon={<Thermometer className="w-4 h-4" />}
            urgent={e.hypothermie || e.hyperthermie}
        >
          <FieldRow label="Température (°C)">
            <Input
                type="number"
                inputMode="decimal"
                value={e.temperature}
                onChange={(v) => updateBilanE({ temperature: v.target.value })}
                placeholder="ex: 36.8"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>

          <FieldRow label="Hypothermie">
            <ToggleButtonGroup
                options={BOOL_OPTIONS}
                value={String(e.hypothermie)}
                onChange={(v) => updateBilanE({ hypothermie: v === 'true' })}
                columns={2}
            />
          </FieldRow>

          <FieldRow label="Hyperthermie">
            <ToggleButtonGroup
                options={BOOL_OPTIONS}
                value={String(e.hyperthermie)}
                onChange={(v) => updateBilanE({ hyperthermie: v === 'true' })}
                columns={2}
            />
          </FieldRow>
        </SectionCard>

        {/* ── EXPOSITION CORPORELLE ── */}
        <SectionCard
            title="Exposition & Lésions par zone"
            icon={<Search className="w-4 h-4" />}
        >
          <div className="space-y-2">
            {ZONES.map((zone) => (
                <ZoneSelector
                    key={zone.key}
                    zone={zone}
                    value={zoneValues[zone.key] || ''}
                    onChange={(v) => updateZone(zone.key, v)}
                />
            ))}
          </div>
        </SectionCard>

        {/* ── COMMENTAIRE ── */}
        <SectionCard title="Commentaire">
          <Textarea
              value={e.commentaire}
              onChange={(v) => updateBilanE({ commentaire: v.target.value })}
              placeholder="Observations complémentaires..."
              rows={3}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 resize-none"
          />
        </SectionCard>

        <NavigationButton
            prevPath="/bilan/secondaire/d"
            nextPath="/bilan/gestes"
            nextLabel="Gestes & Actions"
        />
      </div>
  );
}
