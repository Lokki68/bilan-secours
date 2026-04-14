'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

// ============================================================
// ÉTAT INITIAL
// ============================================================

const initialBilan = {
  circonstanciel: {
    dateHeure: '',
    lieu: '',
    typeIntervention: '',
    age: '',
    sexe: '',
    poids: '',
    mecanisme: '',
    circonstances: '',
    antecedents: '',
    medicaments: '',
    allergies: '',
    medecinTraitant: '',
  },
  primaire: {
    conscience: '',
    ventilation: '',
    frequenceRespiratoire: '',
    pouls: '',
    frequenceCardiaque: '',
    hemorragie: false,
    hemorragieLocalisation: '',
    hemorragieControlee: false,
    detresse: false,
    observations: '',
  },
  secondaire: {
    A: {
      voiesAeriennes: '',
      corpsEtranger: false,
      corpsEtrangerType: '',
      position: '',
      traumaCervical: false,
      collierCervical: false,
      commentaire: '',
    },
    B: {
      frequenceRespiratoire: '',
      rythme: '',
      amplitude: '',
      spo2: '',
      spo2SousO2: false,
      debitO2: '',
      symetrieThorax: true,
      murmureVesiculaire: '',
      detresseRespiratoire: false,
      signesLutte: false,
      commentaire: '',
    },
    C: {
      pouls: '',
      poulsLocalisation: '',
      frequenceCardiaque: '',
      tensionArterielle: '',
      tensionDiastolique: '',
      couleurPeau: '',
      temperaturePeau: '',
      sueurs: false,
      trc: '',
      hemorragie: false,
      hemorragieLocalisation: '',
      hemorragieControlee: false,
      glycemie: '',
      commentaire: '',
    },
    D: {
      avpu: '',
      conscience: '',
      glasgowYeux: 4,
      glasgowVerbal: 5,
      glasgowMoteur: 6,
      scoreGlasgow: 15,
      pupilles: '',
      reactionPupilles: '',
      deficit: false,
      deficitType: '',
      convulsions: false,
      agitation: false,
      glycemie: '',
      commentaire: '',
    },
    E: {
      temperature: '',
      hypothermie: false,
      hyperthermie: false,
      plaies: false,
      brulures: false,
      fractures: false,
      deformations: false,
      oedemes: false,
      tete: '',
      cou: '',
      thorax: '',
      abdomen: '',
      bassin: '',
      membreSupDroit: '',
      membreSupGauche: '',
      membreInfDroit: '',
      membreInfGauche: '',
      dos: '',
      commentaire: '',
    },
  },
  gestes: {
    liste: [] as string[],
    o2: false,
    debitO2: '',
    dae: false,
    daeChocs: 0,
    immobilisation: false,
    immobilisationType: '',
    perfusion: false,
    perfusionType: '',
    medicaments: '',
    commentaire: '',
  },
};

export type BilanState = typeof initialBilan;

// ============================================================
// CONTEXT
// ============================================================

interface BilanContextType {
  bilan: BilanState;
  updateCirconstanciel: (data: Partial<BilanState['circonstanciel']>) => void;
  updatePrimaire: (data: Partial<BilanState['primaire']>) => void;
  updateBilanA: (data: Partial<BilanState['secondaire']['A']>) => void;
  updateBilanB: (data: Partial<BilanState['secondaire']['B']>) => void;
  updateBilanC: (data: Partial<BilanState['secondaire']['C']>) => void;
  updateBilanD: (data: Partial<BilanState['secondaire']['D']>) => void;
  updateBilanE: (data: Partial<BilanState['secondaire']['E']>) => void;
  updateGestes: (data: Partial<BilanState['gestes']>) => void;
  clearBilan: () => void;
  completionRate: number;
}

const BilanContext = createContext<BilanContextType | null>(null);

// ============================================================
// STORAGE KEY
// ============================================================

const STORAGE_KEY = 'bilan-secours-session';

function loadFromStorage(): BilanState {
  if (typeof window === 'undefined') return initialBilan;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return initialBilan;
    return JSON.parse(stored);
  } catch {
    return initialBilan;
  }
}

function saveToStorage(bilan: BilanState) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bilan));
  } catch {
    console.error('Erreur sessionStorage');
  }
}

// ============================================================
// CALCUL COMPLÉTION
// ============================================================

function computeCompletion(bilan: BilanState): number {
  const checks = [
    // Circonstanciel
    !!bilan.circonstanciel.lieu,
    !!bilan.circonstanciel.typeIntervention,
    !!bilan.circonstanciel.age,
    !!bilan.circonstanciel.sexe,
    // Primaire
    !!bilan.primaire.conscience,
    !!bilan.primaire.ventilation,
    !!bilan.primaire.pouls,
    // Secondaire
    !!bilan.secondaire.A.voiesAeriennes,
    !!bilan.secondaire.B.frequenceRespiratoire,
    !!bilan.secondaire.B.spo2,
    !!bilan.secondaire.C.pouls,
    !!bilan.secondaire.C.frequenceCardiaque,
    !!bilan.secondaire.D.avpu,
    !!bilan.secondaire.E.temperature,
  ];

  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

// ============================================================
// PROVIDER
// ============================================================

export function BilanProvider({ children }: { children: ReactNode }) {
  const [bilan, setBilan] = useState<BilanState>(loadFromStorage);

  const update = useCallback(
      <K extends keyof BilanState>(
          section: K,
          data: Partial<BilanState[K]>
      ) => {
        setBilan((prev) => {
          const next = {
            ...prev,
            [section]: { ...(prev[section] as object), ...data },
          };
          saveToStorage(next);
          return next;
        });
      },
      []
  );

  const updateSecondaire = useCallback(
      <K extends keyof BilanState['secondaire']>(
          sub: K,
          data: Partial<BilanState['secondaire'][K]>
      ) => {
        setBilan((prev) => {
          const next = {
            ...prev,
            secondaire: {
              ...prev.secondaire,
              [sub]: { ...(prev.secondaire[sub] as object), ...data },
            },
          };
          saveToStorage(next);
          return next;
        });
      },
      []
  );

  const clearBilan = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setBilan(initialBilan);
  }, []);

  const value: BilanContextType = {
    bilan,
    updateCirconstanciel: (d) => update('circonstanciel', d),
    updatePrimaire: (d) => update('primaire', d),
    updateBilanA: (d) => updateSecondaire('A', d),
    updateBilanB: (d) => updateSecondaire('B', d),
    updateBilanC: (d) => updateSecondaire('C', d),
    updateBilanD: (d) => updateSecondaire('D', d),
    updateBilanE: (d) => updateSecondaire('E', d),
    updateGestes: (d) => update('gestes', d),
    clearBilan,
    completionRate: computeCompletion(bilan),
  };

  return (
      <BilanContext.Provider value={value}>
        {children}
      </BilanContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useBilan(): BilanContextType {
  const ctx = useContext(BilanContext);
  if (!ctx) throw new Error('useBilan doit être utilisé dans <BilanProvider>');
  return ctx;
}
