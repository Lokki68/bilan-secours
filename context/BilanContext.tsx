'use client'

import {
  BilanCirconstanciel,
  BilanComplet,
  BilanPrimaire,
  BilanSecondaireA,
  BilanSecondaireB,
  BilanSecondaireC,
  BilanSecondaireD, BilanSecondaireE, defaultBilanComplet
} from "@/types/bilan.type";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";

const SESSION_KEY = 'bilan_secours_session'

export interface CompletionStatus {
  circonstanciel: boolean;
  primaire: boolean;
  secondaireA: boolean;
  secondaireB: boolean;
  secondaireC: boolean;
  secondaireD: boolean;
  secondaireE: boolean;
}

interface BilanContextType {
  bilan: BilanComplet;

  updateCirconstanciel: (data: Partial<BilanCirconstanciel>) => void;
  updatePrimaire: (data: Partial<BilanPrimaire>) => void;
  updateBilanA: (data: Partial<BilanSecondaireA>) => void;
  updateBilanB: (data: Partial<BilanSecondaireB>) => void;
  updateBilanC: (data: Partial<BilanSecondaireC>) => void;
  updateBilanD: (data: Partial<BilanSecondaireD>) => void;
  updateBilanE: (data: Partial<BilanSecondaireE>) => void;
  resetBilan: () => void;
  isInitialized: boolean;
  completionStatus: CompletionStatus;
}

function checkCompletion(bilan: BilanComplet): CompletionStatus {
  const c = bilan.circonstanciel;
  const p = bilan.primaire;
  const {A, B, C: bc, D, E} = bilan.secondaire;

  return {
    circonstanciel: !!(c.lieu && c.typeIntervention && c.dateHeure),
    primaire: !!(p.conscience && p.ventilation && p.pouls),
    secondaireA: !!(A.voiesAeriennes),
    secondaireB: !!(B.frequenceRespiratoire && B.spo2),
    secondaireC: !!(bc.frequenceCardiaque || bc.tensionArterielle),
    secondaireD: !!(D.scoreGlasgow),
    secondaireE: !!(E.tete || E.thorax || E.abdomen || E.membreSupDroit || E.membreInfDroit)
  }
}

const BilanContext = createContext<BilanContextType | null>(null)

export function BilanProvider({children}: {children: React.ReactNode}) {
  const [bilan, setBilan] = useState<BilanComplet>(defaultBilanComplet)
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as BilanComplet
        setBilan(parsed)
      } else {
        const now = new Date()
        const dateHeure = now.toISOString().slice(0, 16)
        setBilan(prev => ({
          ...prev,
          id: crypto.randomUUID(),
          heureDebutIntervention: dateHeure,
          circonstanciel: {
            ...prev.circonstanciel,
            dateHeure
          }
        }))
      }
    } catch (error) {
      console.error('Erreur lecture session: ', error)
    } finally {
      setIsInitialized(true)
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(bilan))
    } catch (error) {
      console.error('Erreur sauvegarde session: ', error)
    }
  }, [bilan, isInitialized]);

  const updateCirconstanciel = useCallback((data: Partial<BilanComplet['circonstanciel']>) => {
    setBilan(prev => ({
      ...prev,
      circonstanciel: {...prev.circonstanciel, ...data},
      updatedAt: new Date().toISOString()
    }))
  }, [])

  const updatePrimaire = useCallback((data: Partial<BilanComplet['primaire']>) => {
    setBilan(prev => ({
      ...prev,
      primaire: {...prev.primaire, ...data},
      updatedAt: new Date().toISOString()
    }))
  }, [])

  const updateBilanA = useCallback((data: Partial<BilanSecondaireA>) => {
    setBilan(prev => ({
      ...prev,
      secondaire: {
        ...prev.secondaire,
        A: { ...prev.secondaire.A, ...data}
      }
    }))
  }, [])

  const updateBilanB = useCallback((data: Partial<BilanSecondaireB>) => {
    setBilan(prev => ({
      ...prev,
      secondaire: {
        ...prev.secondaire,
        B: { ...prev.secondaire.B, ...data}
      }
    }))
  }, [])

  const updateBilanC = useCallback((data: Partial<BilanSecondaireC>) => {
    setBilan(prev => ({
      ...prev,
      secondaire: {
        ...prev.secondaire,
        C: { ...prev.secondaire.C, ...data}
      }
    }))
  }, [])
  const updateBilanD = useCallback((data: Partial<BilanSecondaireD>) => {
    setBilan(prev => ({
      ...prev,
      secondaire: {
        ...prev.secondaire,
        D: { ...prev.secondaire.D, ...data}
      }
    }))
  }, [])
  const updateBilanE = useCallback((data: Partial<BilanSecondaireE>) => {
    setBilan(prev => ({
      ...prev,
      secondaire: {
        ...prev.secondaire,
        E: { ...prev.secondaire.E, ...data}
      }
    }))
  }, [])


  const resetBilan = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.error('Erreur suppression sessionStorage: ', error)
    }

    const now = new Date()
    const dateHeure = now.toISOString().slice(0, 16)

    setBilan(prev => ({
      ...prev,
      id: crypto.randomUUID(),
      heureDebutIntervention: dateHeure,
      circonstanciel: {
        ...prev.circonstanciel,
        dateHeure
      }
    }))
  }, [])

  const completionStatus = checkCompletion(bilan)

  return (
      <BilanContext.Provider value={{
        bilan,
        updateCirconstanciel,
        updatePrimaire,
        updateBilanA,
        updateBilanB,
        updateBilanC,
        updateBilanD,
        updateBilanE,
        resetBilan,
        isInitialized,
        completionStatus
      }}>
        {children}
      </BilanContext.Provider>
  )
}

export function useBilan() {
  const context = useContext(BilanContext)
  if (!context) throw new Error('useBilan doit être utilisé dans BilanProvider')
  return context
}
