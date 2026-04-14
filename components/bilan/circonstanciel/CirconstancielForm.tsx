'use client'

import {TypeIntervention} from "@/types/bilan.type";
import {useBilan} from "@/context/BilanContext";
import {SectionCard} from "@/components/ui/SectionCard";
import {MapPin, Pill, User} from "lucide-react";
import {Input} from "@/components/ui/input";
import {FieldRow} from "@/components/ui/FieldRow";
import {ToggleButtonGroup} from "@/components/ui/ToggleButtonGroup";
import {Textarea} from "@/components/ui/textarea";
import {NavigationButton} from "@/components/bilan/NavigationButton";

const TYPE_INTERVENTION_OPTIONS: {
  value: TypeIntervention
  label: string
}[] = [
  {value: "MALAISE", label: "Malaise"},
  {value: "TRAUMATISME", label: 'Traumatisme'},
  {value: 'ACCIDENT_VOIE_PUBLIQUE', label: 'AVP'},
  {value: 'CHUTE', label: 'Chute'},
  {value: 'BRULURE', label: 'Brûlure'},
  {value: 'INTOXICATION', label: 'Intoxication'},
  {value: 'NOYADE', label: 'Noyade'},
  {value: 'ARRET_CARDIO_RESPIRATOIRE', label: 'ACR'},
  {value: 'PSYCHIATRIQUE', label: 'Psy'},
  {value: 'ACCOUCHEMENT', label: 'Accouchement'},
  {value: 'AUTRE', label: 'Autre'},
]

export function CirconstancielForm () {
  const {bilan, updateCirconstanciel} = useBilan()
  const c = bilan.circonstanciel

  return (
      <div
          className='flex flex-col gap-4 p-4 pb-0'
      >
        <SectionCard title='Intervention' icon={<MapPin className='w-4 h-4' />} >
          <FieldRow label='Date et Heure' required>
            <Input
                type='datetime-local'
                value={c.dateHeure}
                onChange={(e => updateCirconstanciel({ dateHeure: e.target.value }))}
                className='bg-gray-800 border-gray-700 text-white'
            />
          </FieldRow>

          <FieldRow label="Type d'intervention" required>
            <ToggleButtonGroup
                options={TYPE_INTERVENTION_OPTIONS}
                value={c.typeIntervention}
                onChange={(v) => updateCirconstanciel({typeIntervention: v})}
                columns={3}
                size='sm'
            />
          </FieldRow>

          <FieldRow label='Circonstances / Mécanismes'>
            <Textarea
                placeholder='Décrivez les circonstances ...'
                value={c.circonstances}
                onChange={e => updateCirconstanciel({circonstances: e.target.value}) }
                className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 min-h-20'
            />
          </FieldRow>
        </SectionCard>

        <SectionCard title='Victime' icon={<User className='h-4 w-4'/>}>
          <div className='grid grid-cols-2 gap-3'>
            <FieldRow label="Age">
              <Input
                  type='number'
                  placeholder='Ans'
                  value={c.age}
                  onChange={(e) => updateCirconstanciel({age: e.target.value})}
                  className='bg-gray-800 border-gray-700 text-white'
              />
            </FieldRow>

            <FieldRow label='Poids estimé'>
              <Input
                  type='number'
                  placeholder='Kg'
                  value={c.poids}
                  onChange={e => updateCirconstanciel({poids: e.target.value})}
                  className='bg-gray-800 border-gray-700 text-white'
              />
            </FieldRow>
          </div>

          <FieldRow label='sexe'>
            <ToggleButtonGroup
                options={[
                  { value: 'MASCULIN', label: 'Masculin', color: 'blue' },
                  { value: 'FEMININ', label: 'Féminin', color: 'blue' },
                  { value: 'INCONNU', label: 'Inconnu' },
                ]}
                value={c.sexe}
                onChange={(v) => updateCirconstanciel({sexe: v})}
                columns={3}
                size='sm'
            />
          </FieldRow>
        </SectionCard>

        <SectionCard title='Antécédents & Traitements' icon={<Pill className='w-4 h-4' />} >
          <FieldRow label='Antécédent médicaux / chirurgicaux'>
            <Textarea
                placeholder='HTA, diabète, cardipathie, ...'
                value={c.antecedents}
                onChange={e => updateCirconstanciel({antecedents: e.target.value})}
                className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 min-h-20'
            />
          </FieldRow>

          <FieldRow label='Médicaments'>
            <Textarea
                placeholder='Traitements en cours'
                value={c.medicaments}
                onChange={e => updateCirconstanciel({medicaments: e.target.value})}
                className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 min-h-20'
            />
          </FieldRow>

          <FieldRow label='Allergies'>
            <Input
                placeholder='Allergies connues ...'
                value={c.allergies}
                onChange={e => updateCirconstanciel({allergies: e.target.value})}
                className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-600'
            />
          </FieldRow>

          <FieldRow label='Médecin traitant'>
            <Input
                placeholder='Dr...'
                value={c.medecinTraitant}
                onChange={e => updateCirconstanciel({medecinTraitant: e.target.value})}
                className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-600'
            />
          </FieldRow>
        </SectionCard>

        <NavigationButton
            nextPath='/bilan/primaire'
            nextLabel='Bilan Primaire'
        />
      </div>
  )
}