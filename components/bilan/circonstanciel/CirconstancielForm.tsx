'use client';

import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { NavigationButton } from '@/components/bilan/NavigationButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, User, FileText, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { format } from 'date-fns';

const TYPES_INTERVENTION = [
  'Malaise',
  'Traumatisme',
  'Accident AVP',
  'Incendie',
  'Noyade',
  'Intoxication',
  'Accouchement',
  'Autre',
] as const;

const SEXES = [
  { value: 'M', label: 'Homme' },
  { value: 'F', label: 'Femme' },
  { value: 'I', label: 'Inconnu' },
] as const;

export function CirconstancielForm() {
  const { bilan, updateCirconstanciel } = useBilan();
  const c = bilan.circonstanciel;

  // Auto-rempli la date/heure au premier montage si vide
  useEffect(() => {
    if (!c.dateHeure) {
      updateCirconstanciel({
        dateHeure: format(new Date(), "dd/MM/yyyy HH:mm"),
      });
    }
  }, []);

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        {/* ── HEURE & LIEU ── */}
        <SectionCard
            title="Localisation & Heure"
            icon={<MapPin className="w-4 h-4" />}
        >
          <FieldRow label="Date & heure d'appel">
            <Input
                value={c.dateHeure}
                onChange={(e) => updateCirconstanciel({ dateHeure: e.target.value })}
                placeholder="dd/MM/yyyy HH:mm"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>

          <FieldRow label="Lieu d'intervention">
            <Input
                value={c.lieu}
                onChange={(e) => updateCirconstanciel({ lieu: e.target.value })}
                placeholder="Adresse, lieu-dit..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>
        </SectionCard>

        {/* ── TYPE D'INTERVENTION ── */}
        <SectionCard
            title="Type d'intervention"
            icon={<AlertTriangle className="w-4 h-4" />}
        >
          <div className="grid grid-cols-2 gap-2">
            {TYPES_INTERVENTION.map((type) => {
              const isActive = c.typeIntervention === type;
              return (
                  <button
                      key={type}
                      type="button"
                      onClick={() => updateCirconstanciel({ typeIntervention: type })}
                      className={`
                  rounded-xl border-2 py-3 px-2 text-sm font-semibold text-center
                  transition-all active:scale-95
                  ${isActive
                          ? 'bg-purple-800 border-purple-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400'}
                `}
                  >
                    {type}
                  </button>
              );
            })}
          </div>
        </SectionCard>

        {/* ── VICTIME ── */}
        <SectionCard
            title="Victime"
            icon={<User className="w-4 h-4" />}
        >
          <FieldRow label="Sexe">
            <ToggleButtonGroup
                options={SEXES.map((s) => ({ value: s.value, label: s.label }))}
                value={c.sexe}
                onChange={(v) => updateCirconstanciel({ sexe: v })}
                columns={3}
            />
          </FieldRow>

          <FieldRow label="Âge">
            <Input
                type="number"
                inputMode="numeric"
                value={c.age}
                onChange={(e) => updateCirconstanciel({ age: e.target.value })}
                placeholder="ex: 45"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>

          <FieldRow label="Poids estimé (kg)">
            <Input
                type="number"
                inputMode="numeric"
                value={c.poids}
                onChange={(e) => updateCirconstanciel({ poids: e.target.value })}
                placeholder="ex: 70"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>
        </SectionCard>

        {/* ── MÉCANISME ── */}
        <SectionCard
            title="Mécanisme & Circonstances"
            icon={<FileText className="w-4 h-4" />}
        >
          <FieldRow label="Mécanisme lésionnel">
            <Input
                value={c.mecanisme}
                onChange={(e) => updateCirconstanciel({ mecanisme: e.target.value })}
                placeholder="Chute, choc, malaise..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>

          <FieldRow label="Circonstances détaillées">
            <Textarea
                value={c.circonstances}
                onChange={(e) =>
                    updateCirconstanciel({ circonstances: e.target.value })
                }
                placeholder="Décrivez les circonstances..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 resize-none"
            />
          </FieldRow>
        </SectionCard>

        {/* ── ANTÉCÉDENTS ── */}
        <SectionCard
            title="Antécédents & Traitements"
            icon={<FileText className="w-4 h-4" />}
        >
          <FieldRow label="Antécédents médicaux">
            <Textarea
                value={c.antecedents}
                onChange={(e) =>
                    updateCirconstanciel({ antecedents: e.target.value })
                }
                placeholder="HTA, diabète, cardiopathie..."
                rows={2}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 resize-none"
            />
          </FieldRow>

          <FieldRow label="Médicaments">
            <Textarea
                value={c.medicaments}
                onChange={(e) =>
                    updateCirconstanciel({ medicaments: e.target.value })
                }
                placeholder="Traitements en cours..."
                rows={2}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 resize-none"
            />
          </FieldRow>

          <FieldRow label="Allergies">
            <Input
                value={c.allergies}
                onChange={(e) =>
                    updateCirconstanciel({ allergies: e.target.value })
                }
                placeholder="Médicaments, aliments..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>

          <FieldRow label="Médecin traitant">
            <Input
                value={c.medecinTraitant}
                onChange={(e) =>
                    updateCirconstanciel({ medecinTraitant: e.target.value })
                }
                placeholder="Dr..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>
        </SectionCard>

        <NavigationButton
            nextPath="/bilan/primaire"
            nextLabel="Bilan Primaire"
        />
      </div>
  );
}
