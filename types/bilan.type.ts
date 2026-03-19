export interface BilanCirconstanciel {
  dateHeure: string;
  lieu: string;
  typeIntervention: string;
  mecanisme: string;
  nombreVictimes: number;
  circonstances: string;
  antecedents: string;
  medicaments: string;
  allergies: string;
}

export interface BilanPrimaire {
  conscience: 'ALERTE' | 'VERBAL' | 'DOULEUR' | 'INCONSCIENT';
  ventilation: 'PRESENTE' | 'ABSENTE' | ' ANORMALE';
  frequenceRespiratoire: string;
  pouls: 'PRESENT' | 'ABSENT' | 'FAIBLE';
  frequenceCardiaque: string;
  hemorragie: boolean;
  hemorragieControlee: boolean;
  detresseVitale: string;
  gestesEffectuee: string[];
}

export interface  BilanSecondaireA {
  voiesAeriennes: 'LIBRES' | 'OBSTRUEES' | 'MAINTENUES';
  corpsEtranger: boolean;
  position: string;
  commentaire: string;
}

export interface  BilanSecondaireB {
  fr: string;
  spo2: string;
  spo2SousO2: string;
  debitO2: string;
  murmureVesiculaire: string;
  tirage: boolean;
  cyanose: boolean;
  commentaire: string;
}

export interface BilanSecondaireC {
  fc: string;
  ta: string;
  trc: string;
  teint: string;
  temperature: string;
  glycemie: string;
  commentaire: string;
}

export interface BilanSecondaireD {
  glasgow: {
    ouvertureYeux: number;
    reponseVerbale: number;
    reponseMotrice: number;
    total: number;
  };
  pupilles: 'NORMALES' | 'MYOSIS' | 'MYDRIASE' | 'ANISOCORIE';
  deficit: boolean;
  deficitDescription: string;
  convulsion: boolean;
  commentaire: string;
}

export interface BilanSecondaireE {
  temperature: string;
  douleur: {
    presente: boolean;
    localisation: string;
    intensite: number;
    type: string;
  };
  lesions: string[];
  schemaCorporel: string[];
  commentaire: string;
}

export interface BilanComplet {
  id: string;
  circonstanciel: Partial<BilanCirconstanciel>;
  primaire: Partial<BilanPrimaire>;
  secondaire: {
    A: Partial<BilanSecondaireA>;
    B: Partial<BilanSecondaireB>;
    C: Partial<BilanSecondaireC>;
    D: Partial<BilanSecondaireD>;
    E: Partial<BilanSecondaireE>;
  };
  createdAt: string;
  updatedAt: string;
}
