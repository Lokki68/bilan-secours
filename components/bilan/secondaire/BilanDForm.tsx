'use client';

import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Brain, Eye, Minus, Plus } from 'lucide-react';
import {NavigationButton} from "@/components/bilan/NavigationButton";

// Sous-composant compteur Glasgow
function GlasgowCounter({
                          label,
                          value,
                          min,
                          max,
                          descriptions,
                          onChange,
                        }: {
  label: string;
  value: number;
  min: number;
  max: number;
  descriptions: string[];
  onChange: (v: number) => void;
}) {
  return (
      <div className="bg-gray-800 rounded-xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm font-semibold">{label}</span>
          <span
              className={cn(
                  'text-2xl font-bold w-10 h-10 rounded-full flex items-center justify-center',
                  value === max
                      ? 'bg-green-700 text-white'
                      : value <= min + 1
                          ? 'bg-red-700 text-white'
                          : 'bg-orange-700 text-white'
              )}
          >
          {value}
        </span>
        </div>

        {/* Description courante */}
        <p className="text-gray-400 text-xs italic min-h-4">
          {descriptions[value - min]}
        </p>

        {/* Contrôles */}
        <div className="flex gap-2">
          <button
              type="button"
              onClick={() => onChange(Math.max(min, value - 1))}
              disabled={value <= min}
              className="flex-1 h-10 rounded-lg bg-gray-700 disabled:opacity-30 flex items-center justify-center active:bg-gray-600 transition-colors"
          >
            <Minus className="w-4 h-4 text-white" />
          </button>
          <button
              type="button"
              onClick={() => onChange(Math.min(max, value + 1))}
              disabled={value >= max}
              className="flex-1 h-10 rounded-lg bg-gray-700 disabled:opacity-30 flex items-center justify-center active:bg-gray-600 transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
  );
}

const GLASGOW_YEUX = [
  'Aucune ouverture',
  'À la douleur',
  'À la voix',
  'Spontanée',
];

const GLASGOW_VERBAL = [
  'Aucune réponse',
  'Sons incompréhensibles',
  'Mots inappropriés',
  'Confus / Désorienté',
  'Orienté',
];

const GLASGOW_MOTEUR = [
  'Aucune réponse',
  'Extension stéréotypée',
  'Flexion stéréotypée',
  'Évitement',
  'Localisation douleur',
  'Obéit aux ordres',
];

export function BilanDForm() {
  const { bilan, updateBilanD } = useBilan();
  const d = bilan.secondaire.D;

  const updateGlasgow = (
      field: 'glasgowYeux' | 'glasgowVerbal' | 'glasgowMoteur',
      value: number
  ) => {
    const updated = { ...bilan.secondaire.D, [field]: value };
    const total = updated.glasgowYeux + updated.glasgowVerbal + updated.glasgowMoteur;
    updateBilanD({ [field]: value, scoreGlasgow: total });
  };

  const glasgowColor =
      d.scoreGlasgow >= 13
          ? 'text-green-400'
          : d.scoreGlasgow >= 9
              ? 'text-orange-400'
              : 'text-red-400';

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        {/* Score Glasgow */}
        <SectionCard
            title="Score de Glasgow"
            icon={<Brain className="w-4 h-4" />}
            urgent={d.scoreGlasgow < 9}
        >
          {/* Score total */}
          <div className="flex items-center justify-center py-2">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-sm">Score total</span>
              <span className={cn('text-6xl font-black', glasgowColor)}>
              {d.scoreGlasgow}
            </span>
              <span className="text-gray-500 text-xs">/ 15</span>
              <span
                  className={cn(
                      'text-xs font-semibold mt-1 px-2 py-0.5 rounded-full',
                      d.scoreGlasgow >= 13
                          ? 'bg-green-900 text-green-400'
                          : d.scoreGlasgow >= 9
                              ? 'bg-orange-900 text-orange-400'
                              : 'bg-red-900 text-red-400'
                  )}
              >
              {d.scoreGlasgow >= 13
                  ? 'Léger'
                  : d.scoreGlasgow >= 9
                      ? 'Modéré'
                      : 'Sévère'}
            </span>
            </div>
          </div>

          {/* Sous-scores */}
          <div className="grid grid-cols-1 gap-3">
            <GlasgowCounter
                label="Y — Ouverture des yeux"
                value={d.glasgowYeux}
                min={1}
                max={4}
                descriptions={GLASGOW_YEUX}
                onChange={(v) => updateGlasgow('glasgowYeux', v)}
            />
            <GlasgowCounter
                label="V — Réponse verbale"
                value={d.glasgowVerbal}
                min={1}
                max={5}
                descriptions={GLASGOW_VERBAL}
                onChange={(v) => updateGlasgow('glasgowVerbal', v)}
            />
            <GlasgowCounter
                label="M — Réponse motrice"
                value={d.glasgowMoteur}
                min={1}
                max={6}
                descriptions={GLASGOW_MOTEUR}
                onChange={(v) => updateGlasgow('glasgowMoteur', v)}
            />
          </div>
        </SectionCard>

        {/* AVPU */}
        <SectionCard title="AVPU — Rappel primaire">
          <ToggleButtonGroup
              options={[
                { value: 'ALERTE', label: 'A — Alerte', color: 'green' },
                { value: 'VERBAL', label: 'V — Verbal', color: 'orange' },
                { value: 'DOULEUR', label: 'D — Douleur', color: 'orange' },
                { value: 'INCONSCIENT', label: 'I — Inconscient', color: 'red' },
              ]}
              value={d.avpu}
              onChange={(v) => updateBilanD({ avpu: v })}
              columns={2}
              size="sm"
          />
        </SectionCard>

        {/* Pupilles */}
        <SectionCard title="Pupilles" icon={<Eye className="w-4 h-4" />}>
          <FieldRow label="État des pupilles">
            <ToggleButtonGroup
                options={[
                  { value: 'NORMALES', label: 'Normales', color: 'green' },
                  { value: 'MYOSIS', label: 'Myosis', color: 'orange' },
                  { value: 'MYDRIASE', label: 'Mydriase', color: 'red' },
                  { value: 'ANISOCORIE', label: 'Anisocorie', color: 'red' },
                ]}
                value={d.pupilles}
                onChange={(v) => updateBilanD({ pupilles: v })}
                columns={2}
                size="sm"
            />
          </FieldRow>

          <FieldRow label="Réactivité pupillaire">
            <ToggleButtonGroup
                options={[
                  { value: 'REACTIVES', label: 'Réactives', color: 'green' },
                  { value: 'PEU_REACTIVES', label: 'Peu réactives', color: 'orange' },
                  { value: 'NON_REACTIVES', label: 'Non réactives', color: 'red' },
                ]}
                value={d.reactionPupilles}
                onChange={(v) => updateBilanD({ reactionPupilles: v })}
                columns={3}
                size="sm"
            />
          </FieldRow>
        </SectionCard>

        {/* Déficits / Signes */}
        <SectionCard title="Signes neurologiques">
          <FieldRow label="Déficit moteur / sensitif ?">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Non', color: 'green' },
                  { value: 'true', label: 'Oui', color: 'red' },
                ]}
                value={String(d.deficit)}
                onChange={(v) => updateBilanD({ deficit: v === 'true' })}
                columns={2}
                size="sm"
            />
          </FieldRow>

          {d.deficit && (
              <FieldRow label="Type de déficit">
                <Input
                    placeholder="Hémiplégie D/G, paresthésies..."
                    value={d.deficitType}
                    onChange={(e) => updateBilanD({ deficitType: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                />
              </FieldRow>
          )}

          <FieldRow label="Convulsions ?">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Non', color: 'green' },
                  { value: 'true', label: 'Oui', color: 'red' },
                ]}
                value={String(d.convulsions)}
                onChange={(v) => updateBilanD({ convulsions: v === 'true' })}
                columns={2}
                size="sm"
            />
          </FieldRow>

          <FieldRow label="Agitation ?">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Non', color: 'green' },
                  { value: 'true', label: 'Oui', color: 'orange' },
                ]}
                value={String(d.agitation)}
                onChange={(v) => updateBilanD({ agitation: v === 'true' })}
                columns={2}
                size="sm"
            />
          </FieldRow>

          <FieldRow label="Glycémie capillaire">
            <div className="relative">
              <Input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 0.95"
                  value={d.glycemie}
                  onChange={(e) => updateBilanD({ glycemie: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
              g/L
            </span>
            </div>
          </FieldRow>
        </SectionCard>

        <SectionCard title="Commentaire">
          <Textarea
              placeholder="Observations neurologiques..."
              value={d.commentaire}
              onChange={(e) => updateBilanD({ commentaire: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 min-h-20"
          />
        </SectionCard>

        <NavigationButton
            prevPath="/bilan/secondaire/c"
            nextPath="/bilan/secondaire/e"
            nextLabel="E — Exposition"
        />
      </div>
  );
}
