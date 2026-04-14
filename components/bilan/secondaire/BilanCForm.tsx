'use client';

import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Heart, Droplets, Activity, Thermometer } from 'lucide-react';
import {NavigationButton} from "@/components/bilan/NavigationButton";

export function BilanCForm() {
  const { bilan, updateBilanC } = useBilan();
  const c = bilan.secondaire.C;

  const fcValue = parseInt(c.frequenceCardiaque);
  const fcAlert = !isNaN(fcValue) && (fcValue < 50 || fcValue > 120);
  const fcDanger = !isNaN(fcValue) && (fcValue < 40 || fcValue > 150);

  const glycemieValue = parseFloat(c.glycemie);
  const glycemieAlert =
      !isNaN(glycemieValue) && (glycemieValue < 0.7 || glycemieValue > 1.8);

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        {/* Pouls / FC */}
        <SectionCard
            title="Pouls & Fréquence cardiaque"
            icon={<Heart className="w-4 h-4" />}
            urgent={fcDanger}
        >
          <FieldRow label="Qualité du pouls">
            <ToggleButtonGroup
                options={[
                  { value: 'FORT', label: 'Fort', color: 'green' },
                  { value: 'PRESENT', label: 'Présent', color: 'green' },
                  { value: 'FAIBLE', label: 'Faible', color: 'orange' },
                  { value: 'ABSENT', label: 'Absent', color: 'red' },
                ]}
                value={c.pouls}
                onChange={(v) => updateBilanC({ pouls: v })}
                columns={4}
                size="sm"
            />
          </FieldRow>

          <FieldRow label="Localisation du pouls">
            <ToggleButtonGroup
                options={[
                  { value: 'Radial', label: 'Radial' },
                  { value: 'Carotidien', label: 'Carotidien' },
                  { value: 'Fémoral', label: 'Fémoral' },
                  { value: 'Non perçu', label: 'Non perçu', color: 'red' },
                ]}
                value={c.poulsLocalisation}
                onChange={(v) => updateBilanC({ poulsLocalisation: v })}
                columns={4}
                size="sm"
            />
          </FieldRow>

          <FieldRow
              label="Fréquence cardiaque"
              hint="Normale : 50-120 bpm"
              alert={fcDanger ? `${fcValue} bpm — Danger !` : fcAlert ? `${fcValue} bpm — Attention` : undefined}
          >
            <div className="relative">
              <Input
                  type="number"
                  placeholder="Ex: 70"
                  value={c.frequenceCardiaque}
                  onChange={(e) => updateBilanC({ frequenceCardiaque: e.target.value })}
                  className={cn(
                      'bg-gray-800 border-gray-700 text-white pr-16 text-2xl font-bold h-14',
                      fcAlert && !fcDanger && 'border-orange-500 text-orange-400',
                      fcDanger && 'border-red-500 text-red-400'
                  )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">
              bpm
            </span>
            </div>
          </FieldRow>
        </SectionCard>

        {/* Tension artérielle */}
        <SectionCard title="Tension artérielle" icon={<Activity className="w-4 h-4" />}>
          <FieldRow label="TA Systolique / Diastolique" hint="mmHg">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Input
                    type="number"
                    placeholder="120"
                    value={c.tensionArterielle}
                    onChange={(e) =>
                        updateBilanC({ tensionArterielle: e.target.value })
                    }
                    className="bg-gray-800 border-gray-700 text-white text-xl font-bold h-14 text-center"
                />
                <span className="absolute -bottom-4 left-0 right-0 text-center text-gray-500 text-[10px]">
                Systolique
              </span>
              </div>
              <span className="text-gray-500 text-2xl font-light pb-2">/</span>
              <div className="relative flex-1">
                <Input
                    type="number"
                    placeholder="80"
                    value={c.tensionDiastolique}
                    onChange={(e) =>
                        updateBilanC({ tensionDiastolique: e.target.value })
                    }
                    className="bg-gray-800 border-gray-700 text-white text-xl font-bold h-14 text-center"
                />
                <span className="absolute -bottom-4 left-0 right-0 text-center text-gray-500 text-[10px]">
                Diastolique
              </span>
              </div>
              <span className="text-gray-500 text-xs pb-2">mmHg</span>
            </div>
          </FieldRow>
        </SectionCard>

        {/* Peau & Perfusion */}
        <SectionCard title="Peau & Perfusion" icon={<Thermometer className="w-4 h-4" />}>
          <FieldRow label="Couleur de la peau">
            <ToggleButtonGroup
                options={[
                  { value: 'NORMALE', label: 'Normale', color: 'green' },
                  { value: 'PALE', label: 'Pâle', color: 'orange' },
                  { value: 'ROUGE', label: 'Rouge', color: 'orange' },
                  { value: 'CYANOSEE', label: 'Cyanosée', color: 'red' },
                  { value: 'MARBRE', label: 'Marbrée', color: 'red' },
                  { value: 'ICTERE', label: 'Ictère', color: 'default' },
                ]}
                value={c.couleurPeau}
                onChange={(v) => updateBilanC({ couleurPeau: v })}
                columns={3}
                size="sm"
            />
          </FieldRow>

          <FieldRow label="Température cutanée">
            <ToggleButtonGroup
                options={[
                  { value: 'CHAUDE', label: 'Chaude', color: 'orange' },
                  { value: 'TIEDE', label: 'Tiède', color: 'green' },
                  { value: 'FROIDE', label: 'Froide', color: 'blue' },
                ]}
                value={c.temperaturePeau}
                onChange={(v) => updateBilanC({ temperaturePeau: v as typeof c.temperaturePeau })}
                columns={3}
                size="sm"
            />
          </FieldRow>

          <FieldRow label="Sueurs">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Non', color: 'green' },
                  { value: 'true', label: 'Oui', color: 'orange' },
                ]}
                value={String(c.sueurs)}
                onChange={(v) => updateBilanC({ sueurs: v === 'true' })}
                columns={2}
                size="sm"
            />
          </FieldRow>

          <FieldRow label="TRC (Temps Recoloration Cutanée)" hint="Normale ≤ 2s">
            <div className="relative">
              <Input
                  type="number"
                  placeholder="Ex: 2"
                  value={c.trc}
                  onChange={(e) =>
                      updateBilanC({ trc: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
              s
            </span>
            </div>
          </FieldRow>
        </SectionCard>

        {/* Hémorragie */}
        <SectionCard
            title="Hémorragie"
            icon={<Droplets className="w-4 h-4" />}
            urgent={c.hemorragie && !c.hemorragieControlee}
        >
          <FieldRow label="Hémorragie active ?">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Non', color: 'green' },
                  { value: 'true', label: 'Oui', color: 'red' },
                ]}
                value={String(c.hemorragie)}
                onChange={(v) => updateBilanC({ hemorragie: v === 'true' })}
                columns={2}
                size="md"
            />
          </FieldRow>

          {c.hemorragie && (
              <>
                <FieldRow label="Localisation">
                  <Input
                      placeholder="Membre, plaie..."
                      value={c.hemorragieLocalisation}
                      onChange={(e) =>
                          updateBilanC({ hemorragieLocalisation: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                  />
                </FieldRow>

                <FieldRow label="Contrôlée ?">
                  <ToggleButtonGroup
                      options={[
                        { value: 'true', label: 'Oui — Contrôlée', color: 'green' },
                        { value: 'false', label: 'Non — Active', color: 'red' },
                      ]}
                      value={String(c.hemorragieControlee)}
                      onChange={(v) =>
                          updateBilanC({ hemorragieControlee: v === 'true' })
                      }
                      columns={2}
                      size="sm"
                  />
                </FieldRow>
              </>
          )}
        </SectionCard>

        {/* Glycémie */}
        <SectionCard title="Glycémie" icon={<Activity className="w-4 h-4" />}>
          <FieldRow
              label="Glycémie capillaire"
              hint="Normale : 0.70 - 1.10 g/L"
              alert={glycemieAlert ? `${glycemieValue} g/L — Hors norme` : undefined}
          >
            <div className="relative">
              <Input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 0.95"
                  value={c.glycemie}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    updateBilanC({
                      glycemie: e.target.value,
                    });
                  }}
                  className={cn(
                      'bg-gray-800 border-gray-700 text-white pr-12',
                      glycemieAlert && 'border-orange-500 text-orange-400'
                  )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
              g/L
            </span>
            </div>
          </FieldRow>
        </SectionCard>

        <SectionCard title="Commentaire">
          <Textarea
              placeholder="Observations circulatoires..."
              value={c.commentaire}
              onChange={(e) => updateBilanC({ commentaire: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 min-h-[80px]"
          />
        </SectionCard>

        <NavigationButton
            prevPath="/bilan/secondaire/b"
            nextPath="/bilan/secondaire/d"
            nextLabel="D — Neurologique"
        />
      </div>
  );
}
