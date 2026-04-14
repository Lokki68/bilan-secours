'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBilan } from '@/context/BilanContext';
import { SectionCard } from '@/components/ui/SectionCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Copy,
  Check,
  Trash2,
  ChevronRight,
  AlertTriangle,
  Activity,
  Wind,
  Heart,
  Brain,
  ScanSearch,
  User,
} from 'lucide-react';

// ============================================================
// Helper : affichage conditionnel
// ============================================================

function Line({
                label,
                value,
                alert,
                empty = '—',
              }: {
  label: string;
  value?: string | number | boolean | null;
  alert?: boolean;
  empty?: string;
}) {
  const displayValue =
      value === null || value === undefined || value === ''
          ? empty
          : typeof value === 'boolean'
              ? value
                  ? 'Oui'
                  : 'Non'
              : String(value);

  const isEmpty = displayValue === empty;

  return (
      <div className="flex justify-between items-baseline gap-2 py-1 border-b border-gray-800/50 last:border-0">
        <span className="text-gray-500 text-xs shrink-0">{label}</span>
        <span
            className={cn(
                'text-sm font-medium text-right',
                isEmpty
                    ? 'text-gray-700 italic'
                    : alert
                        ? 'text-red-400 font-bold'
                        : 'text-white'
            )}
        >
        {displayValue}
      </span>
      </div>
  );
}

// ============================================================
// Génération du texte de transmission
// ============================================================

function generateText(bilan: ReturnType<typeof useBilan>['bilan']): string {
  const c = bilan.circonstanciel;
  const p = bilan.primaire;
  const a = bilan.secondaire.A;
  const b = bilan.secondaire.B;
  const cc = bilan.secondaire.C;
  const d = bilan.secondaire.D;
  const e = bilan.secondaire.E;
  const g = bilan.gestes;

  const lines: string[] = [
    `=== BILAN SECOURS — ${c.dateHeure || new Date().toLocaleString('fr-FR')} ===`,
    '',
    `📍 LIEU : ${c.lieu || 'Non renseigné'}`,
    `👤 VICTIME : ${c.sexe || '?'} — ${c.age || '?'} ans${c.poids ? ` — ${c.poids} kg` : ''}`,
    `🚨 TYPE : ${c.typeIntervention || 'Non renseigné'}`,
    `📋 CIRCONSTANCES : ${c.circonstances || c.mecanisme || 'Non renseignées'}`,
    '',
    `--- BILAN PRIMAIRE ---`,
    `Conscience AVPU : ${p.conscience || '?'}`,
    `Ventilation : ${p.ventilation || '?'}`,
    `Pouls : ${p.pouls || '?'}`,
    p.hemorragie
        ? `⚠️ HÉMORRAGIE : ${p.hemorragieLocalisation} — ${p.hemorragieControlee ? 'Contrôlée' : 'NON CONTRÔLÉE'}`
        : '',
    '',
    `--- BILAN SECONDAIRE ---`,
    `[A] Voies aériennes : ${a.voiesAeriennes || '?'}${a.traumaCervical ? ' — TRAUMA CERVICAL SUSPECTÉ' : ''}`,
    `[B] FR : ${b.frequenceRespiratoire || '?'}/min — SpO2 : ${b.spo2 || '?'}%${b.spo2SousO2 ? ` sous ${b.debitO2} L/min O2` : ' (air ambiant)'}`,
    `    Détresse respiratoire : ${b.detresseRespiratoire ? 'OUI ⚠️' : 'Non'}`,
    `[C] Pouls : ${cc.pouls || '?'} (${cc.poulsLocalisation || '?'}) — FC : ${cc.frequenceCardiaque || '?'} bpm`,
    `    TA : ${cc.tensionArterielle || '?'}/${cc.tensionDiastolique || '?'} mmHg`,
    `    Peau : ${cc.couleurPeau || '?'} — ${cc.temperaturePeau || '?'}`,
    `[D] AVPU : ${d.avpu || p.conscience || '?'}`,
    `    Glasgow : ${d.scoreGlasgow}/15 (Y${d.glasgowYeux}V${d.glasgowVerbal}M${d.glasgowMoteur})`,
    `    Pupilles : ${d.pupilles || '?'} — ${d.reactionPupilles || '?'}`,
    d.deficit ? `    ⚠️ DÉFICIT : ${d.deficitType}` : '',
    d.convulsions ? `    ⚠️ CONVULSIONS` : '',
    `[E] Température : ${e.temperature || '?'}°C`,
    e.plaies || e.brulures || e.fractures
        ? `    Lésions : ${[
          e.plaies && 'Plaies',
          e.brulures && 'Brûlures',
          e.fractures && 'Fractures',
          e.deformations && 'Déformations',
          e.oedemes && 'Œdèmes',
        ]
            .filter(Boolean)
            .join(', ')}`
        : '',
    '',
    `--- ANTÉCÉDENTS ---`,
    `ATCD : ${c.antecedents || 'Aucun connu'}`,
    `Médicaments : ${c.medicaments || 'Aucun connu'}`,
    `Allergies : ${c.allergies || 'Aucune connue'}`,
    '',
    `--- GESTES EFFECTUÉS ---`,
    g.liste.length > 0 ? g.liste.join(', ') : 'Aucun geste particulier',
    g.o2 ? `O2 : ${g.debitO2} L/min` : '',
    g.dae ? `DAE : ${g.daeChocs} choc(s)` : '',
    g.medicaments ? `Médicaments : ${g.medicaments}` : '',
    g.commentaire ? `Note : ${g.commentaire}` : '',
  ];

  return lines.filter((l) => l !== '').join('\n');
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export function ResumeTransmission() {
  const router = useRouter();
  const { bilan, clearBilan } = useBilan();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume' | 'texte'>('resume');

  const c = bilan.circonstanciel;
  const p = bilan.primaire;
  const b = bilan.secondaire.B;
  const cc = bilan.secondaire.C;
  const d = bilan.secondaire.D;
  const e = bilan.secondaire.E;

  const transmissionText = generateText(bilan);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transmissionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  const handleEnd = () => {
    if (confirm('Terminer l\'intervention et effacer toutes les données ?')) {
      clearBilan();
      router.push('/');
    }
  };

  const hasAlerts =
      p.hemorragie ||
      b.detresseRespiratoire ||
      d.deficit ||
      d.convulsions;

  return (
      <div className="flex flex-col gap-4 p-4">

        {/* Alertes critiques */}
        {hasAlerts && (
            <div className="bg-red-950 border border-red-700 rounded-2xl p-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-red-400 font-bold text-sm">Points critiques</p>
                <ul className="text-red-300 text-xs mt-1 space-y-0.5">
                  {p.hemorragie && (
                      <li>• Hémorragie {!p.hemorragieControlee && '— NON CONTRÔLÉE ⚠️'}</li>
                  )}
                  {b.detresseRespiratoire && <li>• Détresse respiratoire</li>}
                  {d.deficit && <li>• Déficit neuro : {d.deficitType}</li>}
                  {d.convulsions && <li>• Convulsions</li>}
                </ul>
              </div>
            </div>
        )}

        {/* Onglets */}
        <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
          {(['resume', 'texte'] as const).map((tab) => (
              <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                      'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
                      activeTab === tab
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-500'
                  )}
              >
                {tab === 'resume' ? '📋 Résumé' : '📄 Texte'}
              </button>
          ))}
        </div>

        {/* Onglet Résumé */}
        {activeTab === 'resume' && (
            <>
              <SectionCard title="Identité" icon={<User className="w-4 h-4" />}>
                <Line label="Date / heure" value={c.dateHeure} />
                <Line label="Lieu" value={c.lieu} />
                <Line label="Type" value={c.typeIntervention} />
                <Line label="Sexe" value={c.sexe} />
                <Line label="Âge" value={c.age ? `${c.age} ans` : ''} />
                <Line label="Poids" value={c.poids ? `${c.poids} kg` : ''} />
                <Line label="Mécanisme" value={c.mecanisme || c.circonstances} />
              </SectionCard>

              <SectionCard
                  title="Bilan primaire"
                  icon={<Activity className="w-4 h-4" />}
                  urgent={!!p.hemorragie && !p.hemorragieControlee}
              >
                <Line label="Conscience" value={p.conscience} />
                <Line label="Ventilation" value={p.ventilation} />
                <Line label="Pouls" value={p.pouls} />
                {p.hemorragie && (
                    <Line
                        label="Hémorragie"
                        value={`${p.hemorragieLocalisation} — ${p.hemorragieControlee ? 'Contrôlée' : 'NON CONTRÔLÉE'}`}
                        alert={!p.hemorragieControlee}
                    />
                )}
              </SectionCard>

              <SectionCard title="A — Airway" icon={<Wind className="w-4 h-4" />}>
                <Line label="Voies aériennes" value={bilan.secondaire.A.voiesAeriennes} />
                <Line label="Trauma cervical" value={bilan.secondaire.A.traumaCervical} />
              </SectionCard>

              <SectionCard
                  title="B — Ventilation"
                  icon={<Wind className="w-4 h-4" />}
                  urgent={b.detresseRespiratoire}
              >
                <Line label="FR" value={b.frequenceRespiratoire ? `${b.frequenceRespiratoire}/min` : ''} />
                <Line label="SpO2" value={b.spo2 ? `${b.spo2}%` : ''} />
                <Line label="Sous O2" value={b.spo2SousO2 ? `${b.debitO2} L/min` : 'Non'} />
                <Line
                    label="Détresse respiratoire"
                    value={b.detresseRespiratoire ? 'OUI' : 'Non'}
                    alert={b.detresseRespiratoire}
                />
              </SectionCard>

              <SectionCard title="C — Circulation" icon={<Heart className="w-4 h-4" />}>
                <Line label="Pouls" value={`${cc.pouls} (${cc.poulsLocalisation})`} />
                <Line label="FC" value={cc.frequenceCardiaque ? `${cc.frequenceCardiaque} bpm` : ''} />
                <Line
                    label="TA"
                    value={
                      cc.tensionArterielle && cc.tensionDiastolique
                          ? `${cc.tensionArterielle}/${cc.tensionDiastolique} mmHg`
                          : ''
                    }
                />
                <Line label="Peau" value={`${cc.couleurPeau} — ${cc.temperaturePeau}`} />
              </SectionCard>

              <SectionCard
                  title="D — Neurologique"
                  icon={<Brain className="w-4 h-4" />}
                  urgent={d.deficit || d.convulsions}
              >
                <Line label="AVPU" value={d.avpu} />
                <Line label="Glasgow" value={`${d.scoreGlasgow}/15 (Y${d.glasgowYeux}V${d.glasgowVerbal}M${d.glasgowMoteur})`} />
                <Line label="Pupilles" value={`${d.pupilles} — ${d.reactionPupilles}`} />
                {d.deficit && (
                    <Line label="Déficit" value={d.deficitType} alert />
                )}
                {d.convulsions && (
                    <Line label="Convulsions" value="Oui" alert />
                )}
              </SectionCard>

              <SectionCard title="E — Exposition" icon={<ScanSearch className="w-4 h-4" />}>
                <Line label="Température" value={e.temperature ? `${e.temperature}°C` : ''} />
                <Line
                    label="Lésions"
                    value={
                        [
                          e.plaies && 'Plaies',
                          e.brulures && 'Brûlures',
                          e.fractures && 'Fractures',
                          e.deformations && 'Déformations',
                          e.oedemes && 'Œdèmes',
                        ]
                            .filter(Boolean)
                            .join(', ') || 'Aucune'
                    }
                />
              </SectionCard>
            </>
        )}

        {/* Onglet Texte */}
        {activeTab === 'texte' && (
            <SectionCard title="Texte de transmission radio">
          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed bg-gray-900 rounded-xl p-3 border border-gray-800">
            {transmissionText}
          </pre>
            </SectionCard>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pb-8">
          <Button
              size="lg"
              className="w-full h-14 text-base font-bold bg-orange-700 hover:bg-orange-600 text-white"
              onClick={handleCopy}
          >
            {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Copié !
                </>
            ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copier le texte de transmission
                </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
                variant="outline"
                size="lg"
                className="h-12 border-gray-700 text-gray-300"
                onClick={() => router.push('/bilan/gestes')}
            >
              Gestes
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>

            <Button
                variant="outline"
                size="lg"
                className="h-12 border-red-900 text-red-400 hover:bg-red-950"
                onClick={handleEnd}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Fin d'intervention
            </Button>
          </div>
        </div>
      </div>
  );
}
