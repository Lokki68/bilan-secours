'use client';

import { useRouter } from 'next/navigation';
import { useBilan } from '@/context/BilanContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Play,
  ClipboardList,
  Clock,
  MapPin,
  ChevronRight,
  Stethoscope,
} from 'lucide-react';

// ============================================================
// ÉTAPES DE NAVIGATION
// ============================================================

const STEPS = [
  {
    label: 'Circonstanciel',
    path: '/bilan/circonstanciel',
    icon: MapPin,
    color: 'text-purple-400',
    bg: 'bg-purple-950 border-purple-800',
  },
  {
    label: 'Bilan Primaire',
    path: '/bilan/primaire',
    icon: ClipboardList,
    color: 'text-red-400',
    bg: 'bg-red-950 border-red-800',
  },
  {
    label: 'Secondaire A',
    path: '/bilan/secondaire/a',
    icon: Stethoscope,
    color: 'text-blue-400',
    bg: 'bg-blue-950 border-blue-800',
  },
  {
    label: 'Secondaire B',
    path: '/bilan/secondaire/b',
    icon: Stethoscope,
    color: 'text-cyan-400',
    bg: 'bg-cyan-950 border-cyan-800',
  },
  {
    label: 'Secondaire C',
    path: '/bilan/secondaire/c',
    icon: Stethoscope,
    color: 'text-orange-400',
    bg: 'bg-orange-950 border-orange-800',
  },
  {
    label: 'Secondaire D',
    path: '/bilan/secondaire/d',
    icon: Stethoscope,
    color: 'text-yellow-400',
    bg: 'bg-yellow-950 border-yellow-800',
  },
  {
    label: 'Secondaire E',
    path: '/bilan/secondaire/e',
    icon: Stethoscope,
    color: 'text-green-400',
    bg: 'bg-green-950 border-green-800',
  },
  {
    label: 'Gestes & Actions',
    path: '/bilan/gestes',
    icon: ClipboardList,
    color: 'text-pink-400',
    bg: 'bg-pink-950 border-pink-800',
  },
  {
    label: 'Résumé & Transmission',
    path: '/bilan/resume',
    icon: ClipboardList,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950 border-emerald-800',
  },
] as const;

// ============================================================
// COMPOSANT
// ============================================================

export default function HomePage() {
  const router = useRouter();
  const { bilan, completionRate, clearBilan } = useBilan();
  const c = bilan.circonstanciel;

  const hasSession =
      !!c.lieu || !!c.typeIntervention || !!bilan.primaire.conscience;

  const startNew = () => {
    clearBilan();
    // Initialise la date/heure
    router.push('/bilan/circonstanciel');
  };

  return (
      <div className="flex flex-col min-h-screen bg-gray-950 text-white">

        {/* ── HEADER ── */}
        <div className="bg-gradient-to-b from-red-950 to-gray-950 border-b border-red-900/40 px-5 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-red-700 rounded-xl">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white leading-none">
                Bilan Secours
              </h1>
              <p className="text-red-300 text-xs mt-0.5">
                Outil de recueil secouriste
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5 flex-1">

          {/* ── SESSION EN COURS ── */}
          {hasSession ? (
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-green-400">
                  Intervention en cours
                </span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                {completionRate}% complété
              </span>
                </div>

                {/* Infos session */}
                <div className="space-y-1 mb-3">
                  {c.lieu && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">{c.lieu}</span>
                      </div>
                  )}
                  {c.typeIntervention && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <ClipboardList className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span>{c.typeIntervention}</span>
                      </div>
                  )}
                  {c.dateHeure && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{c.dateHeure}</span>
                      </div>
                  )}
                </div>

                {/* Barre de progression */}
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                  <div
                      className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                  />
                </div>

                {/* Navigation rapide */}
                <div className="grid grid-cols-1 gap-2">
                  {STEPS.map((step) => {
                    const Icon = step.icon;
                    return (
                        <button
                            key={step.path}
                            onClick={() => router.push(step.path)}
                            className={cn(
                                'flex items-center gap-3 p-3 rounded-xl border text-left',
                                'active:scale-98 transition-transform',
                                step.bg
                            )}
                        >
                          <Icon className={cn('w-4 h-4 shrink-0', step.color)} />
                          <span className="flex-1 text-sm font-semibold text-white">
                      {step.label}
                    </span>
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    );
                  })}
                </div>
              </div>
          ) : (
              /* ── PAS DE SESSION ── */
              <div className="flex flex-col items-center justify-center flex-1 gap-6 py-10">
                <div className="p-6 bg-red-950 rounded-full border border-red-800">
                  <Stethoscope className="w-12 h-12 text-red-400" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">
                    Prêt à intervenir
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Démarrez une nouvelle intervention pour commencer le recueil
                  </p>
                </div>
              </div>
          )}

          {/* ── BOUTONS PRINCIPAUX ── */}
          <div className="flex flex-col gap-3 mt-auto">
            <Button
                size="lg"
                className="w-full h-16 text-lg font-black bg-red-700 hover:bg-red-600 text-white rounded-2xl"
                onClick={startNew}
            >
              <Play className="w-6 h-6 mr-3" />
              {hasSession ? 'Nouvelle intervention' : 'Démarrer'}
            </Button>

            {hasSession && (
                <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-12 border-gray-700 text-gray-300 rounded-2xl"
                    onClick={() => router.push('/bilan/resume')}
                >
                  <ClipboardList className="w-5 h-5 mr-2" />
                  Voir le résumé
                </Button>
            )}
          </div>

        </div>
      </div>
  );
}
