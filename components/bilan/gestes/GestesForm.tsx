'use client';

import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Wind,
  Heart,
  Scissors,
  Pill,
  Layers,
  ThumbsUp,
} from 'lucide-react';
import {NavigationButton} from "@/components/bilan/NavigationButton";

// ============================================================
// LISTES DE GESTES PAR CATÉGORIE
// ============================================================

const GESTES_AIRWAY = [
  'LVA',
  'Canule de Guedel',
  'Aspiration',
  'Collier cervical',
  'Plan dur',
  'Matelas coquille',
] as const;

const GESTES_VENTILATION = [
  'Insufflations (bouche-à-bouche)',
  'Insufflations (masque)',
  'Oxygénothérapie',
] as const;

const GESTES_CIRCULATION = [
  'MCE',
  'DAE',
  'Garrot',
  'Pansement compressif',
  'Perfusion IV',
] as const;

const GESTES_IMMOBILISATION = [
  'Attelle membre sup.',
  'Attelle membre inf.',
  'Traction axiale maintenue',
  'Immobilisation rachis',
  'PLS',
] as const;

const GESTES_DIVERS = [
  'Couverture de survie',
  'Position demi-assise',
  'Position allongée',
  'Position anti-choc',
  'Réconfort psychologique',
] as const;

// ============================================================
// SOUS-COMPOSANT : TOGGLE MULTI-SÉLECTION
// ============================================================

interface MultiSelectProps {
  options: readonly string[];
  selected: string[];
  onChange: (newList: string[]) => void;
  columns?: 2 | 3;
}

function MultiSelectGestes({
                             options,
                             selected,
                             onChange,
                             columns = 2,
                           }: MultiSelectProps) {
  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
      <div className={cn('grid gap-2', columns === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
        {options.map((opt) => {
          const isActive = selected.includes(opt);
          return (
              <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={cn(
                      'rounded-xl border-2 py-2.5 px-2 text-xs font-semibold text-center',
                      'transition-all active:scale-95 leading-tight',
                      isActive
                          ? 'bg-green-800 border-green-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400'
                  )}
              >
                {opt}
              </button>
          );
        })}
      </div>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export function GestesForm() {
  const { bilan, updateGestes } = useBilan();
  const g = bilan.gestes;

  const toggleGeste = (newList: string[]) => {
    updateGestes({ liste: newList });
  };

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        {/* ── AIRWAY / IMMOBILISATION ── */}
        <SectionCard
            title="Voies aériennes & Rachis"
            icon={<Wind className="w-4 h-4" />}
        >
          <MultiSelectGestes
              options={GESTES_AIRWAY}
              selected={g.liste}
              onChange={toggleGeste}
              columns={2}
          />
        </SectionCard>

        {/* ── VENTILATION ── */}
        <SectionCard
            title="Ventilation"
            icon={<Wind className="w-4 h-4" />}
        >
          <MultiSelectGestes
              options={GESTES_VENTILATION}
              selected={g.liste}
              onChange={toggleGeste}
              columns={2}
          />

          {/* O2 détail */}
          {g.liste.includes('Oxygénothérapie') && (
              <div className="mt-3 pt-3 border-t border-gray-800">
                <FieldRow label="Débit O2 (L/min)">
                  <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="ex: 9"
                      value={g.debitO2}
                      onChange={(e) => updateGestes({ debitO2: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                  />
                </FieldRow>
              </div>
          )}
        </SectionCard>

        {/* ── CIRCULATION ── */}
        <SectionCard
            title="Circulation & Réanimation"
            icon={<Heart className="w-4 h-4" />}
            urgent={g.liste.includes('MCE') || g.liste.includes('DAE')}
        >
          <MultiSelectGestes
              options={GESTES_CIRCULATION}
              selected={g.liste}
              onChange={toggleGeste}
              columns={2}
          />

          {/* DAE — nb chocs */}
          {g.liste.includes('DAE') && (
              <div className="mt-3 pt-3 border-t border-gray-800">
                <FieldRow label="Nombre de chocs DAE">
                  <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="w-10 h-10 rounded-xl bg-gray-700 text-white font-bold text-lg active:scale-95"
                        onClick={() =>
                            updateGestes({ daeChocs: Math.max(0, g.daeChocs - 1) })
                        }
                    >
                      −
                    </button>
                    <span className="flex-1 text-center text-2xl font-black text-white">
                  {g.daeChocs}
                </span>
                    <button
                        type="button"
                        className="w-10 h-10 rounded-xl bg-red-700 text-white font-bold text-lg active:scale-95"
                        onClick={() => updateGestes({ daeChocs: g.daeChocs + 1 })}
                    >
                      +
                    </button>
                  </div>
                </FieldRow>
              </div>
          )}

          {/* Perfusion */}
          {g.liste.includes('Perfusion IV') && (
              <div className="mt-3 pt-3 border-t border-gray-800">
                <FieldRow label="Type de perfusion">
                  <Input
                      placeholder="Sérum phy, Ringer lactate..."
                      value={g.perfusionType}
                      onChange={(e) =>
                          updateGestes({ perfusionType: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                  />
                </FieldRow>
              </div>
          )}
        </SectionCard>

        {/* ── IMMOBILISATION ── */}
        <SectionCard
            title="Immobilisation & Mobilisation"
            icon={<Layers className="w-4 h-4" />}
        >
          <MultiSelectGestes
              options={GESTES_IMMOBILISATION}
              selected={g.liste}
              onChange={toggleGeste}
              columns={2}
          />
        </SectionCard>

        {/* ── DIVERS ── */}
        <SectionCard
            title="Divers & Confort"
            icon={<ThumbsUp className="w-4 h-4" />}
        >
          <MultiSelectGestes
              options={GESTES_DIVERS}
              selected={g.liste}
              onChange={toggleGeste}
              columns={2}
          />
        </SectionCard>

        {/* ── MÉDICAMENTS ── */}
        <SectionCard
            title="Médicaments administrés"
            icon={<Pill className="w-4 h-4" />}
        >
          <Textarea
              placeholder="Ex: Kalinox 15 min, Aspégic 500mg, Ventoline 1 bouffée..."
              value={g.medicaments}
              onChange={(e) => updateGestes({ medicaments: e.target.value })}
              rows={3}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 resize-none"
          />
        </SectionCard>

        {/* ── COMMENTAIRE LIBRE ── */}
        <SectionCard
            title="Notes complémentaires"
            icon={<Scissors className="w-4 h-4" />}
        >
          <Textarea
              placeholder="Observations, évolution, transmissions particulières..."
              value={g.commentaire}
              onChange={(e) => updateGestes({ commentaire: e.target.value })}
              rows={4}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 resize-none"
          />
        </SectionCard>

        {/* ── RÉCAP SÉLECTION ── */}
        {g.liste.length > 0 && (
            <div className="bg-green-950 border border-green-800 rounded-2xl p-3">
              <p className="text-green-400 text-xs font-bold mb-2">
                {g.liste.length} geste{g.liste.length > 1 ? 's' : ''} sélectionné
                {g.liste.length > 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {g.liste.map((g) => (
                    <span
                        key={g}
                        className="bg-green-900 text-green-300 text-xs px-2 py-0.5 rounded-full border border-green-700"
                    >
                {g}
              </span>
                ))}
              </div>
            </div>
        )}

        <NavigationButton
            prevPath="/bilan/secondaire/e"
            nextPath="/bilan/resume"
            nextLabel="Résumé & Transmission"
            nextVariant="primary"
        />
      </div>
  );
}
