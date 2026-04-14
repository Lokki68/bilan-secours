'use client';

import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { FieldRow } from '@/components/ui/FieldRow';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wind, AlertTriangle } from 'lucide-react';
import {NavigationButton} from "@/components/bilan/NavigationButton";

export function BilanAForm() {
  const { bilan, updateBilanA } = useBilan();
  const a = bilan.secondaire.A;

  return (
      <div className="flex flex-col gap-4 p-4 pb-0">

        <SectionCard
            title="État des voies aériennes"
            icon={<Wind className="w-4 h-4" />}
            urgent={a.voiesAeriennes === 'OBSTRUEES'}
        >
          <ToggleButtonGroup
              options={[
                { value: 'LIBRES', label: 'Libres', color: 'green' },
                { value: 'MAINTENUES', label: 'Maintenues', color: 'orange' },
                { value: 'OBSTRUEES', label: 'Obstruées', color: 'red' },
              ]}
              value={a.voiesAeriennes}
              onChange={(v) => updateBilanA({ voiesAeriennes: v })}
              columns={3}
              size="md"
          />
        </SectionCard>

        <SectionCard
            title="Corps étranger"
            icon={<AlertTriangle className="w-4 h-4" />}
            urgent={a.corpsEtranger}
        >
          <FieldRow label="Corps étranger présent ?">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Non', color: 'green' },
                  { value: 'true', label: 'Oui', color: 'red' },
                ]}
                value={String(a.corpsEtranger)}
                onChange={(v) => updateBilanA({ corpsEtranger: v === 'true' })}
                columns={2}
                size="sm"
            />
          </FieldRow>

          {a.corpsEtranger && (
              <FieldRow label="Nature du corps étranger">
                <Input
                    placeholder="Aliment, vomissements, sang..."
                    value={a.corpsEtrangerType}
                    onChange={(e) => updateBilanA({ corpsEtrangerType: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                />
              </FieldRow>
          )}
        </SectionCard>

        <SectionCard title="Position & Trauma cervical">
          <FieldRow label="Position de la victime">
            <Input
                placeholder="Dorsale, latérale, assise..."
                value={a.position}
                onChange={(e) => updateBilanA({ position: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
            />
          </FieldRow>

          <FieldRow label="Trauma cervical suspecté ?">
            <ToggleButtonGroup
                options={[
                  { value: 'false', label: 'Non', color: 'green' },
                  { value: 'true', label: 'Oui — Suspecté', color: 'red' },
                ]}
                value={String(a.traumaCervical)}
                onChange={(v) => updateBilanA({ traumaCervical: v === 'true' })}
                columns={2}
                size="sm"
            />
          </FieldRow>

          {a.traumaCervical && (
              <FieldRow label="Collier cervical posé ?">
                <ToggleButtonGroup
                    options={[
                      { value: 'false', label: 'Non', color: 'orange' },
                      { value: 'true', label: 'Oui — Posé', color: 'green' },
                    ]}
                    value={String(a.collierCervical)}
                    onChange={(v) => updateBilanA({ collierCervical: v === 'true' })}
                    columns={2}
                    size="sm"
                />
              </FieldRow>
          )}
        </SectionCard>

        <SectionCard title="Commentaire">
          <Textarea
              placeholder="Observations complémentaires sur les voies aériennes..."
              value={a.commentaire}
              onChange={(e) => updateBilanA({ commentaire: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 min-h-[80px]"
          />
        </SectionCard>

        <NavigationButton
            prevPath="/bilan/primaire"
            nextPath="/bilan/secondaire/b"
            nextLabel="B — Ventilation"
        />
      </div>
  );
}
