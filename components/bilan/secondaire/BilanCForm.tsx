'use client';

import {BilanState, useBilan} from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { NavigationButton } from '@/components/bilan/NavigationButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Droplets } from 'lucide-react';
import {useEffect} from "react";

const POULS_LOCALISATION = [
  { value: 'RADIAL', label: 'Radial' },
  { value: 'CAROTIDIEN', label: 'Carotidien' },
  { value: 'FÉMORAL', label: 'Fémoral' },
] as const;

const COULEUR_PEAU = [
  { value: 'NORMALE', label: 'Normale', color: 'green' },
  { value: 'PALE', label: 'Pâle', color: 'blue' },
  { value: 'CYANOSEE', label: 'Cyanosée', color: 'red' },
  { value: 'ROUGE', label: 'Rouge', color: 'orange' },
  { value: 'ICTERE', label: 'Ictère', color: 'orange' },
] as const;

const TEMPERATURE_PEAU = [
  { value: 'NORMALE', label: 'Normale', color: 'green' },
  { value: 'FROIDE', label: 'Froide', color: 'blue' },
  { value: 'CHAUDE', label: 'Chaude', color: 'red' },
  { value: 'MOITE', label: 'Moite', color: 'orange' },
] as const;

const TRC_OPTIONS = [
  { value: 'NORMAL', label: '< 3s', color: 'green' },
  { value: 'ALLONGE', label: '≥ 3s', color: 'red' },
] as const;

const BOOL_OPTIONS = [
  { value: 'false', label: 'Non', color: 'green' },
  { value: 'true', label: 'Oui', color: 'red' },
] as const;

export function BilanCForm() {
  const { bilan, updateBilanC } = useBilan();
  const c = bilan.secondaire.C;

  useEffect(() => {
    const updates: Partial<BilanState['secondaire']['C']> = {}

    if (!c.pouls && bilan.primaire.pouls) {
      updates.pouls = bilan.primaire.pouls
    }

    if (!c.frequenceCardiaque && bilan.primaire.frequenceCardiaque) {
      updates.frequenceCardiaque = bilan.primaire.frequenceCardiaque
    }

    if (Object.keys(updates).length > 0) {
      updateBilanC(updates)
    }
  }, []);

  const taNum = Number(c.tensionArterielle);
  const taAbnormal = taNum > 0 && (taNum < 90 || taNum > 140);

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        {/* ── POULS ── */}
        <SectionCard
            title="Pouls"
            icon={<Heart className="w-4 h-4" />}
            urgent={
                Number(c.frequenceCardiaque) < 50 ||
                Number(c.frequenceCardiaque) > 120
            }
        >
          <FieldRow label="Localisation pouls">
            <ToggleButtonGroup
                options={POULS_LOCALISATION}
                value={c.poulsLocalisation}
                onChange={(v) => updateBilanC({ poulsLocalisation: v })}
                columns={3}
            />
          </FieldRow>

          <FieldRow label="Fréquence cardiaque (/min)">
            <Input
                type="number"
                inputMode="numeric"
                value={c.frequenceCardiaque}
                onChange={(e) =>
                    updateBilanC({ frequenceCardiaque: e.target.value })
                }
                placeholder="ex: 75"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>

          {c.frequenceCardiaque && (
              <div className="mt-1">
                {Number(c.frequenceCardiaque) < 50 && (
                    <p className="text-orange-400 text-xs font-bold">
                      ⚠️ Bradycardie (&lt;50/min)
                    </p>
                )}
                {Number(c.frequenceCardiaque) > 120 && (
                    <p className="text-orange-400 text-xs font-bold">
                      ⚠️ Tachycardie (&gt;120/min)
                    </p>
                )}
              </div>
          )}
        </SectionCard>

        {/* ── TENSION ARTÉRIELLE ── */}
        <SectionCard
            title="Tension Artérielle"
            urgent={taAbnormal}
        >
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Systolique (mmHg)">
              <Input
                  type="number"
                  inputMode="numeric"
                  value={c.tensionArterielle}
                  onChange={(e) =>
                      updateBilanC({ tensionArterielle: e.target.value })
                  }
                  placeholder="ex: 120"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
              />
            </FieldRow>

            <FieldRow label="Diastolique (mmHg)">
              <Input
                  type="number"
                  inputMode="numeric"
                  value={c.tensionDiastolique}
                  onChange={(e) =>
                      updateBilanC({ tensionDiastolique: e.target.value })
                  }
                  placeholder="ex: 80"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
              />
            </FieldRow>
          </div>

          {taAbnormal && (
              <p className="text-red-400 text-xs font-bold mt-2">
                🚨 TA anormale — surveiller
              </p>
          )}
        </SectionCard>

        {/* ── PEAU ── */}
        <SectionCard title="État cutané">
          <FieldRow label="Couleur">
            <ToggleButtonGroup
                options={COULEUR_PEAU}
                value={c.couleurPeau}
                onChange={(v) => updateBilanC({ couleurPeau: v })}
                columns={3}
            />
          </FieldRow>

          <FieldRow label="Température">
            <ToggleButtonGroup
                options={TEMPERATURE_PEAU}
                value={c.temperaturePeau}
                onChange={(v) => updateBilanC({ temperaturePeau: v })}
                columns={2}
            />
          </FieldRow>

          <FieldRow label="Sueurs">
            <ToggleButtonGroup
                options={BOOL_OPTIONS}
                value={String(c.sueurs)}
                onChange={(v) => updateBilanC({ sueurs: v === 'true' })}
                columns={2}
            />
          </FieldRow>

          <FieldRow label="TRC">
            <ToggleButtonGroup
                options={TRC_OPTIONS}
                value={c.trc}
                onChange={(v) => updateBilanC({ trc: v })}
                columns={2}
            />
          </FieldRow>
        </SectionCard>

        {/* ── HÉMORRAGIE ── */}
        <SectionCard
            title="Hémorragie"
            icon={<Droplets className="w-4 h-4" />}
            urgent={c.hemorragie}
        >
          <FieldRow label="Hémorragie présente ?">
            <ToggleButtonGroup
                options={BOOL_OPTIONS}
                value={String(c.hemorragie)}
                onChange={(v) => updateBilanC({ hemorragie: v === 'true' })}
                columns={2}
            />
          </FieldRow>

          {c.hemorragie && (
              <div className="mt-3 pt-3 border-t border-gray-800 space-y-3">
                <FieldRow label="Localisation">
                  <Input
                      value={c.hemorragieLocalisation}
                      onChange={(e) =>
                          updateBilanC({ hemorragieLocalisation: e.target.value })
                      }
                      placeholder="Membre, thorax..."
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                  />
                </FieldRow>
                <FieldRow label="Contrôlée ?">
                  <ToggleButtonGroup
                      options={[
                        { value: 'true', label: 'Oui', color: 'green' },
                        { value: 'false', label: 'Non', color: 'red' },
                      ]}
                      value={String(c.hemorragieControlee)}
                      onChange={(v) =>
                          updateBilanC({ hemorragieControlee: v === 'true' })
                      }
                      columns={2}
                  />
                </FieldRow>
              </div>
          )}
        </SectionCard>

        {/* ── GLYCÉMIE ── */}
        <SectionCard title="Glycémie capillaire">
          <FieldRow label="Glycémie (g/L)">
            <Input
                type="number"
                inputMode="decimal"
                value={c.glycemie}
                onChange={(e) => updateBilanC({ glycemie: e.target.value })}
                placeholder="ex: 1.20"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>

          {c.glycemie && (
              <div className="mt-1">
                {Number(c.glycemie) < 0.6 && (
                    <p className="text-red-400 text-xs font-bold">
                      🚨 Hypoglycémie sévère
                    </p>
                )}
                {Number(c.glycemie) > 2.0 && (
                    <p className="text-orange-400 text-xs font-bold">
                      ⚠️ Hyperglycémie
                    </p>
                )}
              </div>
          )}
        </SectionCard>

        {/* ── COMMENTAIRE ── */}
        <SectionCard title="Commentaire">
          <Textarea
              value={c.commentaire}
              onChange={(e) => updateBilanC({ commentaire: e.target.value })}
              placeholder="Observations circulatoires..."
              rows={3}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 resize-none"
          />
        </SectionCard>

        <NavigationButton
            prevPath="/bilan/secondaire/b"
            nextPath="/bilan/secondaire/d"
            nextLabel="Secondaire D"
        />
      </div>
  );
}
