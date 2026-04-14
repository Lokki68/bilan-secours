'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import { useBilan } from '@/context/BilanContext';
import { cn } from '@/lib/utils';

// ============================================================
// CONFIG DES ÉTAPES
// ============================================================

const STEPS = [
  {
    key: 'circonstanciel',
    label: 'Circo.',
    path: '/bilan/circonstanciel',
    short: 'C',
  },
  {
    key: 'primaire',
    label: 'Prim.',
    path: '/bilan/primaire',
    short: 'P',
  },
  {
    key: 'secondaire_a',
    label: 'A',
    path: '/bilan/secondaire/a',
    short: 'A',
  },
  {
    key: 'secondaire_b',
    label: 'B',
    path: '/bilan/secondaire/b',
    short: 'B',
  },
  {
    key: 'secondaire_c',
    label: 'C',
    path: '/bilan/secondaire/c',
    short: 'C',
  },
  {
    key: 'secondaire_d',
    label: 'D',
    path: '/bilan/secondaire/d',
    short: 'D',
  },
  {
    key: 'secondaire_e',
    label: 'E',
    path: '/bilan/secondaire/e',
    short: 'E',
  },
  {
    key: 'gestes',
    label: 'Gestes',
    path: '/bilan/gestes',
    short: 'G',
  },
  {
    key: 'resume',
    label: 'Résumé',
    path: '/bilan/resume',
    short: 'R',
  },
] as const;

// ============================================================
// HELPERS — détermine si une étape est "remplie"
// ============================================================

function useStepCompletion() {
  const { bilan } = useBilan();

  return {
    circonstanciel:
        !!bilan.circonstanciel.lieu || !!bilan.circonstanciel.typeIntervention,
    primaire: !!bilan.primaire.conscience,
    secondaire_a: !!bilan.secondaire.A.voiesAeriennes,
    secondaire_b: !!bilan.secondaire.B.frequenceRespiratoire,
    secondaire_c: !!bilan.secondaire.C.pouls,
    secondaire_d: !!bilan.secondaire.D.avpu,
    secondaire_e:
        !!bilan.secondaire.E.temperature || !!bilan.secondaire.E.tete,
    gestes: bilan.gestes.liste.length > 0 || !!bilan.gestes.commentaire,
    resume: false,
  } as const;
}

// ============================================================
// COMPOSANT
// ============================================================

export function StepIndicator() {
  const router = useRouter();
  const pathname = usePathname();
  const completion = useStepCompletion();

  return (
      <div className="w-full bg-gray-900 border-b border-gray-800 px-2 py-2">
        <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          {STEPS.map((step, index) => {
            const isActive = pathname === step.path;
            const isDone = completion[step.key];
            const isLast = index === STEPS.length - 1;

            return (
                <div key={step.key} className="flex items-center shrink-0">
                  {/* ── BOUTON ÉTAPE ── */}
                  <button
                      type="button"
                      onClick={() => router.push(step.path)}
                      className={cn(
                          'flex flex-col items-center gap-0.5 group',
                          'transition-all active:scale-95'
                      )}
                  >
                    {/* Cercle */}
                    <div
                        className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            'border-2 text-xs font-black transition-all',
                            isActive &&
                            'bg-orange-600 border-orange-500 text-white scale-110 shadow-lg shadow-orange-900',
                            !isActive &&
                            isDone &&
                            'bg-green-900 border-green-600 text-green-400',
                            !isActive &&
                            !isDone &&
                            'bg-gray-800 border-gray-700 text-gray-600'
                        )}
                    >
                      {isDone && !isActive ? (
                          <Check className="w-3.5 h-3.5" />
                      ) : (
                          <span>{step.short}</span>
                      )}
                    </div>

                    {/* Label */}
                    <span
                        className={cn(
                            'text-[10px] font-semibold leading-none',
                            isActive && 'text-orange-400',
                            !isActive && isDone && 'text-green-600',
                            !isActive && !isDone && 'text-gray-700'
                        )}
                    >
                  {step.label}
                </span>
                  </button>

                  {/* ── CONNECTEUR ── */}
                  {!isLast && (
                      <div
                          className={cn(
                              'w-3 h-0.5 mx-0.5 rounded-full',
                              isDone ? 'bg-green-800' : 'bg-gray-800'
                          )}
                      />
                  )}
                </div>
            );
          })}
        </div>
      </div>
  );
}
