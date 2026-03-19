'use client'

import {BilanComplet} from "@/types/bilan.type";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";

const SESSION_KEY = 'bilan_secours_session'

const defaultBilan: BilanComplet = {
  id: '',
  circonstanciel: {},
  primaire: {},
  secondaire: {A: {}, B: {}, C: {}, D: {}, E: {}},
  createdAt: '',
  updatedAt: ''
}

interface BilanContextType {
  bilan: BilanComplet;
  updateCirconstanciel: (data: Partial<BilanComplet['circonstanciel']>) => void;
  updatePrimaire: (data: Partial<BilanComplet['primaire']>) => void;
  updateSecondaire: (section: 'A' | 'B' | 'C' | 'D' | 'E', data: any) => void;
  clearBilan: () => void;
  isInitialized: boolean;
}

const BilanContext = createContext<BilanContextType | null>(null)

export function BilanProvider({children}: {children: React.ReactNode}) {
  const [bilan, setBilan] = useState<BilanComplet>(defaultBilan)
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) {
        setBilan(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Erreur lecture session: ', error)
    }
    setIsInitialized(true)
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

  const updateSecondaire = useCallback((section: 'A' | 'B' | 'C' | 'D' | 'E', data: any) => {
    setBilan(prev => ({
      ...prev,
      secondaire: {
        ...prev.secondaire,
        [section]: {...prev.secondaire[section], ...data}
      }
    }))
  }, [])

  const clearBilan = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setBilan(defaultBilan)
  }, [])

  return (
      <BilanContext.Provider value={{
        bilan,
        updateCirconstanciel,
        updatePrimaire,
        updateSecondaire,
        clearBilan,
        isInitialized
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
