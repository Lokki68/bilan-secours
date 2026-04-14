'use client';

import { useBilan } from '@/context/BilanContext';
import { GesteSAP } from '@/types/bilan.types';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Brain, Wind, Heart, Droplet, Stethoscope } from 'lucide-react';
import {NavigationButton} from "@/components/bilan/NavigationButton";

const GESTES: { value: GesteSAP; label: string }[] = [
  { value: 'PLS', label: 'PLS' },
  { value: 'LVA', label: 'LVA' },
  { value: 'ASPIRATION', label: 'Aspiration' },
  { value: 'CANULE_GUEDEL', label: 'Canule' },
  { value: 'INSUFFLATIONS', label: 'Insufflations' },
  { value: 'MCE', label: 'MCE' },
  { value: 'DAE', label: 'DAE' },
  { value: 'O2', label: 'O2' },
  { value: 'GARROT', label: 'Garrot' },
  { value: 'PANSEMENT_COMPRESSIF', label: 'Pans. compressif' },
  { value: 'IMMOBILISATION', label: 'Immobilisation' },
  { value: 'COLLIER_CERVICAL', label: 'Collier cervical' },
  { value: 'COUVERTURE_SURVIE', label: 'Couv. survie' },
  { value: 'MATELAS_COQUILLE', label: 'Matelas coquille' },
];

export function PrimaireForm() {
  const { bilan, updatePrimaire } = useBilan();
  const p = bilan.primaire;

  const toggleGeste = (geste: GesteSAP) => {
    const current = p.gestesEffectues;
    const updated = current.includes(geste)
        ? current.filter((g) => g !== geste)
        : [...current, geste];
    updatePrimaire({ gestesEffectues: updated });
  };

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        <SectionCard
            title="Conscience — AVPU"
            icon={<Brain className="w-4 h-4" />}
            urgent={p.conscience === 'INCONSCIENT' || p.conscience === 'DOULEUR'}
        >
          <ToggleButtonGroup
              options={[
                { value: 'ALERTE', label: 'A — Alerte', color: 'green' },
                { value: 'VERBAL', label: 'V — Verbal', color: 'orange' },
                { value: 'DOULEUR', label: 'D — Douleur', color: 'orange' },
                { value: 'INCONSCIENT', label: 'I — Inconscient', color: 'red' },
              ]}
              value={p.conscience}
              onChange={(v) => updatePrimaire({ conscience: v })}
              columns={2}
              size="md"
          />
        </SectionCard>

        <SectionCard
            title="Ventilation"
            icon={<Wind className="w-4 h-4" />}
            urgent={p.detresseVentilation}
        >
          <ToggleButtonGroup
              options={[
                { value: 'NORMALE', label: 'Normale', color: 'green' },
                { value: 'DIFFICILE', label: 'Difficile', color: 'orange' },
                { value: 'ANORMALE', label: 'Anormale', color: 'red' },
                { value: 'ABSENTE', label: 'Absente', color: 'red' },
              ]}
              value={p.ventilation}
              onChange={(v) => {
                updatePrimaire({
                  ventilation: v,
                  detresseVentilation: v === 'ANORMALE' || v === 'ABSENTE' || v === 'DIFFICILE',
                });
              }}
              columns={2}
              size="md"
          />

          <FieldRow label="Fréquence respiratoire" hint="Cycles / min">
            <div className="relative">
              <Input
                  type="number"
                  placeholder="Ex: 16"
                  value={p.frequenceRespiratoire}
                  onChange={(e) =>
                      updatePrimaire({ frequenceRespiratoire: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
              /min
            </span>
            </div>
          </FieldRow>
        </SectionCard>

        <SectionCard
            title="Circulation"
            icon={<Heart className="w-4 h-4" />}
            urgent={p.detresseCirculation || (p.hemorragie && !p.hemorragieControlee)}
        >
          <FieldRow label="Pouls">
            <ToggleButtonGroup
                options={[
                  { value: 'FORT', label: 'Fort', color: 'green' },
                  { value: 'PRESENT', label: 'Présent', color: 'green' },
                  { value: 'FAIBLE', label: 'Faible', color: 'orange' },
                  { value: 'ABSENT', label: 'Absent', color: 'red' },
                ]}
                value={p.pouls}
                onChange={(v) => {
                  updatePrimaire({
                    pouls: v,
                    detresseCirculation: v === 'ABSENT' || v === 'FAIBLE',
                  });
                }}
                columns={4}
                size="sm"
            />
          </FieldRow>

          <FieldRow label="Fréquence cardiaque">
            <div className="relative">
              <Input
                  type="number"
                  placeholder="Ex: 70"
                  value={p.frequenceCardiaque}
                  onChange={(e) =>
                      updatePrimaire({ frequenceCardiaque: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
              bpm
            </span>
            </div>
          </FieldRow>

          <FieldRow label="Hémorragie">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Non', color: 'green' },
                  { value: 'true', label: 'Oui', color: 'red' },
                ]}
                value={String(p.hemorragie)}
                onChange={(v) => updatePrimaire({ hemorragie: v === 'true' })}
                columns={2}
                size="sm"
            />
          </FieldRow>

          {p.hemorragie && (
              <>
                <FieldRow label="Localisation hémorragie">
                  <Input
                      placeholder="Membre inf. gauche..."
                      value={p.hemorragieLocalisation}
                      onChange={(e) =>
                          updatePrimaire({ hemorragieLocalisation: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                  />
                </FieldRow>

                <FieldRow label="Hémorragie contrôlée ?">
                  <ToggleButtonGroup
                      options={[
                        { value: 'true', label: 'Oui — Contrôlée', color: 'green' },
                        { value: 'false', label: 'Non — Active', color: 'red' },
                      ]}
                      value={String(p.hemorragieControlee)}
                      onChange={(v) =>
                          updatePrimaire({ hemorragieControlee: v === 'true' })
                      }
                      columns={2}
                      size="sm"
                  />
                </FieldRow>
              </>
          )}
        </SectionCard>

        <SectionCard title="Peau" icon={<Droplet className="w-4 h-4" />}>
          <ToggleButtonGroup
              options={[
                { value: 'NORMALE', label: 'Normale', color: 'green' },
                { value: 'PALE', label: 'Pâle', color: 'orange' },
                { value: 'ROUGE', label: 'Rouge', color: 'orange' },
                { value: 'CYANOSEE', label: 'Cyanosée', color: 'red' },
                { value: 'MARBRE', label: 'Marbrée', color: 'red' },
                { value: 'ICTERE', label: 'Ictère', color: 'default' },
              ]}
              value={p.couleurPeau}
              onChange={(v) => updatePrimaire({ couleurPeau: v })}
              columns={3}
              size="sm"
          />
        </SectionCard>

        <SectionCard
            title="Gestes effectués"
            icon={<Stethoscope className="w-4 h-4" />}
        >
          <div className="flex flex-wrap gap-2">
            {GESTES.map((geste) => {
              const isSelected = p.gestesEffectues.includes(geste.value);
              return (
                  <button
                      key={geste.value}
                      type="button"
                      onClick={() => toggleGeste(geste.value)}
                      className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all active:scale-95',
                          isSelected
                              ? 'bg-blue-700 border-blue-500 text-white'
                              : 'bg-gray-800 border-gray-700 text-gray-400'
                      )}
                  >
                    {geste.label}
                  </button>
              );
            })}
          </div>

          {p.gestesEffectues.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1 border-t border-gray-800">
            <span className="text-gray-500 text-xs w-full mb-1">
              {p.gestesEffectues.length} geste(s) sélectionné(s)
            </span>
                {p.gestesEffectues.map((g) => (
                    <Badge
                        key={g}
                        variant="secondary"
                        className="bg-blue-900/50 text-blue-300 border border-blue-800 text-xs"
                    >
                      {g}
                    </Badge>
                ))}
              </div>
          )}
        </SectionCard>

        <SectionCard title="Observations libres">
          <Textarea
              placeholder="Informations complémentaires..."
              value={p.observations}
              onChange={(e) => updatePrimaire({ observations: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 min-h-[80px]"
          />
        </SectionCard>

        <NavigationButton
            prevPath="/bilan/circonstanciel"
            nextPath="/bilan/secondaire/a"
            nextLabel="Bilan Secondaire"
        />
      </div>
  );
}
