'use client';

import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Wind, Heart, Droplets } from 'lucide-react';
import {NavigationButton} from "@/components/bilan/NavigationButton";

const CONSCIENCE_OPTIONS = [
  { value: 'CONSCIENT', label: 'Conscient', color: 'green' },
  { value: 'INCONSCIENT', label: 'Inconscient', color: 'red' },
  { value: 'ALTERE', label: 'Altéré', color: 'orange' },
] as const;

const VENTILATION_OPTIONS = [
  { value: 'NORMALE', label: 'Normale', color: 'green' },
  { value: 'ALTEREE', label: 'Altérée', color: 'orange' },
  { value: 'ABSENTE', label: 'Absente', color: 'red' },
] as const;

const POULS_OPTIONS = [
  { value: 'PRESENT_FORT', label: 'Fort', color: 'green' },
  { value: 'PRESENT_FAIBLE', label: 'Faible', color: 'orange' },
  { value: 'ABSENT', label: 'Absent', color: 'red' },
] as const;

const DETRESSE_OPTIONS = [
  { value: 'false', label: 'Non', color: 'green' },
  { value: 'true', label: 'Oui', color: 'red' },
] as const;

export function PrimaireForm() {
  const { bilan, updatePrimaire } = useBilan();
  const p = bilan.primaire;

  const isDetresse =
      p.conscience === 'INCONSCIENT' ||
      p.ventilation === 'ABSENTE' ||
      p.pouls === 'ABSENT' ||
      p.hemorragie;

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        {/* ── ALERTE DÉTRESSE ── */}
        {isDetresse && (
            <div className="bg-red-950 border-2 border-red-600 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="text-red-300 font-black text-sm">DÉTRESSE VITALE</p>
                <p className="text-red-500 text-xs">Engager les gestes d'urgence</p>
              </div>
            </div>
        )}

        {/* ── CONSCIENCE ── */}
        <SectionCard
            title="Conscience"
            icon={<Brain className="w-4 h-4" />}
            urgent={p.conscience === 'INCONSCIENT'}
        >
          <ToggleButtonGroup
              options={CONSCIENCE_OPTIONS}
              value={p.conscience}
              onChange={(v) => updatePrimaire({ conscience: v })}
              columns={3}
              size="lg"
          />
        </SectionCard>

        {/* ── VENTILATION ── */}
        <SectionCard
            title="Ventilation"
            icon={<Wind className="w-4 h-4" />}
            urgent={p.ventilation === 'ABSENTE'}
        >
          <ToggleButtonGroup
              options={VENTILATION_OPTIONS}
              value={p.ventilation}
              onChange={(v) => updatePrimaire({ ventilation: v })}
              columns={3}
              size="lg"
          />

          {p.ventilation && p.ventilation !== 'ABSENTE' && (
              <div className="mt-3 pt-3 border-t border-gray-800">
                <FieldRow label="Fréquence respiratoire (/min)">
                  <Input
                      type="number"
                      inputMode="numeric"
                      value={p.frequenceRespiratoire}
                      onChange={(e) =>
                          updatePrimaire({ frequenceRespiratoire: e.target.value })
                      }
                      placeholder="ex: 18"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                  />
                </FieldRow>
              </div>
          )}
        </SectionCard>

        {/* ── POULS / CIRCULATION ── */}
        <SectionCard
            title="Pouls & Circulation"
            icon={<Heart className="w-4 h-4" />}
            urgent={p.pouls === 'ABSENT'}
        >
          <ToggleButtonGroup
              options={POULS_OPTIONS}
              value={p.pouls}
              onChange={(v) => updatePrimaire({ pouls: v })}
              columns={3}
              size="lg"
          />

          {p.pouls && p.pouls !== 'ABSENT' && (
              <div className="mt-3 pt-3 border-t border-gray-800">
                <FieldRow label="Fréquence cardiaque (/min)">
                  <Input
                      type="number"
                      inputMode="numeric"
                      value={p.frequenceCardiaque}
                      onChange={(e) =>
                          updatePrimaire({ frequenceCardiaque: e.target.value })
                      }
                      placeholder="ex: 75"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                  />
                </FieldRow>
              </div>
          )}
        </SectionCard>

        {/* ── HÉMORRAGIE ── */}
        <SectionCard
            title="Hémorragie"
            icon={<Droplets className="w-4 h-4" />}
            urgent={p.hemorragie}
        >
          <FieldRow label="Hémorragie présente ?">
            <ToggleButtonGroup
                options={DETRESSE_OPTIONS}
                value={String(p.hemorragie)}
                onChange={(v) => updatePrimaire({ hemorragie: v === 'true' })}
                columns={2}
                size="lg"
            />
          </FieldRow>

          {p.hemorragie && (
              <div className="mt-3 pt-3 border-t border-gray-800 space-y-3">
                <FieldRow label="Localisation">
                  <Input
                      value={p.hemorragieLocalisation}
                      onChange={(e) =>
                          updatePrimaire({ hemorragieLocalisation: e.target.value })
                      }
                      placeholder="Membre, thorax, abdomen..."
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                  />
                </FieldRow>

                <FieldRow label="Hémorragie contrôlée ?">
                  <ToggleButtonGroup
                      options={[
                        { value: 'true', label: 'Oui', color: 'green' },
                        { value: 'false', label: 'Non', color: 'red' },
                      ]}
                      value={String(p.hemorragieControlee)}
                      onChange={(v) =>
                          updatePrimaire({ hemorragieControlee: v === 'true' })
                      }
                      columns={2}
                  />
                </FieldRow>
              </div>
          )}
        </SectionCard>

        {/* ── OBSERVATIONS ── */}
        <SectionCard title="Observations primaires">
          <Textarea
              value={p.observations}
              onChange={(e) => updatePrimaire({ observations: e.target.value })}
              placeholder="Notes d'urgence..."
              rows={3}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 resize-none"
          />
        </SectionCard>

        <NavigationButton
            prevPath="/bilan/circonstanciel"
            nextPath="/bilan/secondaire/a"
            nextLabel="Secondaire A"
        />
      </div>
  );
}
