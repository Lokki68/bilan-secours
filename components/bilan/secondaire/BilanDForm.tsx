'use client';

import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { NavigationButton } from '@/components/bilan/NavigationButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Brain } from 'lucide-react';
import { useMemo } from 'react';

// ── AVPU ──
const AVPU_OPTIONS = [
  { value: 'A', label: 'A — Alerte', color: 'green' },
  { value: 'V', label: 'V — Voix', color: 'orange' },
  { value: 'P', label: 'P — Douleur', color: 'orange' },
  { value: 'U', label: 'U — Inconscient', color: 'red' },
] as const;

const PUPILLES_OPTIONS = [
  { value: 'ISOCORES', label: 'Isocores', color: 'green' },
  { value: 'ANISOCORES', label: 'Anisocores', color: 'red' },
  { value: 'MYOSIS', label: 'Myosis', color: 'orange' },
  { value: 'MYDRIASE', label: 'Mydriase', color: 'red' },
] as const;

const REACTION_OPTIONS = [
  { value: 'REACTIVES', label: 'Réactives', color: 'green' },
  { value: 'AREAACTIVES', label: 'Aréactives', color: 'red' },
  { value: 'LENTES', label: 'Lentes', color: 'orange' },
] as const;

const BOOL_OPTIONS = [
  { value: 'false', label: 'Non', color: 'green' },
  { value: 'true', label: 'Oui', color: 'red' },
] as const;

// ── GLASGOW ──
const GLASGOW_YEUX = [
  { score: 4, label: 'Spontanée' },
  { score: 3, label: 'À la voix' },
  { score: 2, label: 'À la douleur' },
  { score: 1, label: 'Aucune' },
] as const;

const GLASGOW_VERBAL = [
  { score: 5, label: 'Orienté' },
  { score: 4, label: 'Confus' },
  { score: 3, label: 'Inapproprié' },
  { score: 2, label: 'Incompréhensible' },
  { score: 1, label: 'Aucun' },
] as const;

const GLASGOW_MOTEUR = [
  { score: 6, label: 'Sur commande' },
  { score: 5, label: 'Orienté' },
  { score: 4, label: 'Évitement' },
  { score: 3, label: 'Décortication' },
  { score: 2, label: 'Décérébration' },
  { score: 1, label: 'Aucun' },
] as const;

interface GlasgowSelectorProps {
  label: string;
  options: readonly { score: number; label: string }[];
  value: number;
  onChange: (v: number) => void;
}

function GlasgowSelector({
                           label,
                           options,
                           value,
                           onChange,
                         }: GlasgowSelectorProps) {
  return (
      <div className="space-y-2">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          {label}
        </p>
        <div className="flex flex-col gap-1.5">
          {options.map((opt) => (
              <button
                  key={opt.score}
                  type="button"
                  onClick={() => onChange(opt.score)}
                  className={`
              flex items-center justify-between rounded-xl border px-3 py-2.5
              text-sm font-semibold transition-all active:scale-98
              ${value === opt.score
                      ? 'bg-blue-800 border-blue-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400'}
            `}
              >
                <span>{opt.label}</span>
                <span
                    className={`
              text-xs font-black px-2 py-0.5 rounded-lg
              ${value === opt.score ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-500'}
            `}
                >
              {opt.score}
            </span>
              </button>
          ))}
        </div>
      </div>
  );
}

export function BilanDForm() {
  const { bilan, updateBilanD } = useBilan();
  const d = bilan.secondaire.D;

  const scoreGlasgow = useMemo(
      () => d.glasgowYeux + d.glasgowVerbal + d.glasgowMoteur,
      [d.glasgowYeux, d.glasgowVerbal, d.glasgowMoteur]
  );

  const handleGlasgow = (field: 'glasgowYeux' | 'glasgowVerbal' | 'glasgowMoteur', v: number) => {
    const next = {
      glasgowYeux: d.glasgowYeux,
      glasgowVerbal: d.glasgowVerbal,
      glasgowMoteur: d.glasgowMoteur,
      [field]: v,
    };
    updateBilanD({
      [field]: v,
      scoreGlasgow: next.glasgowYeux + next.glasgowVerbal + next.glasgowMoteur,
    });
  };

  const glasgowColor =
      scoreGlasgow >= 13
          ? 'text-green-400'
          : scoreGlasgow >= 9
              ? 'text-orange-400'
              : 'text-red-400';

  const glasgowLabel =
      scoreGlasgow >= 13
          ? 'Légère'
          : scoreGlasgow >= 9
              ? 'Modérée'
              : 'Sévère';

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        {/* ── AVPU ── */}
        <SectionCard
            title="AVPU — Niveau de conscience"
            icon={<Brain className="w-4 h-4" />}
            urgent={d.avpu === 'U' || d.avpu === 'P'}
        >
          <ToggleButtonGroup
              options={AVPU_OPTIONS}
              value={d.avpu}
              onChange={(v) => updateBilanD({ avpu: v })}
              columns={2}
              size="lg"
          />
        </SectionCard>

        {/* ── GLASGOW ── */}
        <SectionCard
            title="Score de Glasgow"
            urgent={scoreGlasgow < 9}
        >
          {/* Score total */}
          <div className="flex items-center justify-between bg-gray-800 rounded-xl p-3 mb-4">
            <div>
              <p className="text-gray-400 text-xs font-semibold">Score total</p>
              <p className="text-gray-300 text-xs">{glasgowLabel}</p>
            </div>
            <div className="text-right">
            <span className={`text-4xl font-black ${glasgowColor}`}>
              {scoreGlasgow}
            </span>
              <span className="text-gray-600 text-sm font-semibold">/15</span>
            </div>
          </div>

          <div className="space-y-4">
            <GlasgowSelector
                label={`Yeux (E) — ${d.glasgowYeux}/4`}
                options={GLASGOW_YEUX}
                value={d.glasgowYeux}
                onChange={v => handleGlasgow('glasgowYeux', v)}
            />
            <GlasgowSelector
                label={`Verbal (V) — ${d.glasgowVerbal}/5`}
                options={GLASGOW_VERBAL}
                value={d.glasgowVerbal}
                onChange={(v) => handleGlasgow( 'glasgowVerbal', v )}
            />
            <GlasgowSelector
                label={`Moteur (M) — ${d.glasgowMoteur}/6`}
                options={GLASGOW_MOTEUR}
                value={d.glasgowMoteur}
                onChange={(v) => handleGlasgow('glasgowMoteur', v)}
            />
          </div>
        </SectionCard>

        {/* ── PUPILLES ── */}
        <SectionCard
            title="Pupilles"
            urgent={d.pupilles === 'ANISOCORES' || d.reactionPupilles === 'AREAACTIVES'}
        >
          <FieldRow label="État">
            <ToggleButtonGroup
                options={PUPILLES_OPTIONS}
                value={d.pupilles}
                onChange={(v) => updateBilanD({ pupilles: v })}
                columns={2}
            />
          </FieldRow>

          <FieldRow label="Réactivité">
            <ToggleButtonGroup
                options={REACTION_OPTIONS}
                value={d.reactionPupilles}
                onChange={(v) => updateBilanD({ reactionPupilles: v })}
                columns={3}
            />
          </FieldRow>
        </SectionCard>

        {/* ── DÉFICIT ── */}
        <SectionCard
            title="Déficit neurologique"
            urgent={d.deficit}
        >
          <FieldRow label="Déficit présent ?">
            <ToggleButtonGroup
                options={BOOL_OPTIONS}
                value={String(d.deficit)}
                onChange={(v) => updateBilanD({ deficit: v === 'true' })}
                columns={2}
            />
          </FieldRow>

          {d.deficit && (
              <div className="mt-3 pt-3 border-t border-gray-800">
                <FieldRow label="Type de déficit">
                  <Input
                      value={d.deficitType}
                      onChange={(e) => updateBilanD({ deficitType: e.target.value })}
                      placeholder="Moteur, sensitif, visuel..."
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                  />
                </FieldRow>
              </div>
          )}
        </SectionCard>

        {/* ── CONVULSIONS & AGITATION ── */}
        <SectionCard title="Comportement" urgent={d.convulsions}>
          <FieldRow label="Convulsions">
            <ToggleButtonGroup
                options={BOOL_OPTIONS}
                value={String(d.convulsions)}
                onChange={(v) => updateBilanD({ convulsions: v === 'true' })}
                columns={2}
            />
          </FieldRow>

          <FieldRow label="Agitation">
            <ToggleButtonGroup
                options={BOOL_OPTIONS}
                value={String(d.agitation)}
                onChange={(v) => updateBilanD({ agitation: v === 'true' })}
                columns={2}
            />
          </FieldRow>
        </SectionCard>

        {/* ── GLYCÉMIE ── */}
        <SectionCard title="Glycémie capillaire">
          <FieldRow label="Glycémie (g/L)">
            <Input
                type="number"
                inputMode="decimal"
                value={d.glycemie}
                onChange={(e) => updateBilanD({ glycemie: e.target.value })}
                placeholder="ex: 1.20"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>
        </SectionCard>

        {/* ── COMMENTAIRE ── */}
        <SectionCard title="Commentaire">
          <Textarea
              value={d.commentaire}
              onChange={(e) => updateBilanD({ commentaire: e.target.value })}
              placeholder="Observations neurologiques..."
              rows={3}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 resize-none"
          />
        </SectionCard>

        <NavigationButton
            prevPath="/bilan/secondaire/c"
            nextPath="/bilan/secondaire/e"
            nextLabel="Secondaire E"
        />
      </div>
  );
}
