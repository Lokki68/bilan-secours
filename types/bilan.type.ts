export type NiveauConscienceAVPU = 'ALERTE' | 'VERBAL' | 'DOULEUR' | 'INCONSCIENT';
export type EtatVentilation = 'NORMALE' | 'ABSENTE' | ' ANORMALE' | 'DIFFICILE';
export type EtatPouls = 'FORT' | 'PRESENT' | 'FAIBLE' | 'ABSENT';
export type EtatVoiesAeriennes = 'LIBRES' | 'OBSTRUEES' | 'MAINTENUES';
export type CouleurPeau = 'NORMALE' | 'PALE' | 'ROUGE' | 'CYANOSEE' | 'ICTERE' | 'MARBRURE';
export type EtatPupilles = 'NORMALES' | 'MYOSIS' | 'MYDRIASE' | 'ANISCORIES';
export type ReactionPupilles = 'REACTIVES' | 'PEU_REACTIVES' | 'NON_REACTIVES';
export type EtatGlycemie = 'NORMALE' | 'HYPOGLYCEMIE' | 'HYPERGLYCEMIE';
export type TypeIntervention =
    | 'MALAISE'
    | 'TRAUMATISME'
    | 'ACCIDENT_VOIE_PUBLIQUE'
    | 'CHUTE'
    | 'BRULURE'
    | 'INTOXICATION'
    | 'NOYADE'
    | 'PENDAISON'
    | 'ARRET_CARDIO_RESPIRATOIRE'
    | 'ACCOUCHEMENT'
    | 'PSYCHIATRIQUE'
    | 'AUTRE';
export type GesteSAP =
    | 'PLS'
    | 'LVA'
    | 'ASPIRATION'
    | 'CANULE_GUEDEL'
    | 'INSUFFLATIONS'
    | 'MCE'
    | 'DAE'
    | 'O2'
    | 'GARROT'
    | 'PANSEMENT_COMPRESSIF'
    | 'IMMOBILISATION'
    | 'MATELAS_COQUILLE'
    | 'PLAN_DUR'
    | 'COLLIER_CERVICAL'
    | 'COUVERTURE_SURVIE'
    | 'PERFUSION'
    | 'MEDOC_ADMINISTRE';


export interface BilanCirconstanciel {
  dateHeure: string;
  lieu: string;
  typeIntervention: TypeIntervention;

  age: string;
  sexe: 'MASCULIN' | 'FEMININ' | 'INCONNU';
  poids: string;

  mecanisme: string;
  circonstances: string;

  antecedents: string;
  medicaments: string;
  allergies: string;

  medecinTraitant: string;
}

export interface BilanPrimaire {
  conscience: NiveauConscienceAVPU;

  ventilation: EtatVentilation;
  frequenceRespiratoire: string;

  pouls: EtatPouls;
  frequenceCardiaque: string;
  hemorragie: boolean;
  hemorragieLocalisation: string;
  hemorragieControlee: boolean;

  couleurPeau: CouleurPeau;

  detresseVentilation: boolean;
  detresseCirculation: boolean;
  detresseNeurologique: boolean;

  gestesEffectues: string[];

  observations: string;
}

export interface  BilanSecondaireA {
  voiesAeriennes: EtatVoiesAeriennes;
  corpsEtranger: boolean;
  corpsEtrangerType: string;
  position: string;
  traumaCervical: boolean;
  collierCervical: boolean;
  commentaire: string;
}

export interface  BilanSecondaireB {
  frequenceRespiratoire: string;
  spo2: string;
  spo2SousO2: boolean;
  debitO2: string;
  rythme: 'REGULIER' | 'IRREGULIER' | '';
  amplitude: 'AMPLE' | 'SUPERFICIELLE' | 'INEFFICACE' | '';
  symetrieThorax: boolean;
  murmureVesiculaire: 'NORMAL' | 'DIMINUE' | 'ABSENT' | 'SIBILANTS' | 'RONCHIS' | '';
  detresseRespiratoire: boolean;
  signesLutte: boolean;
  commentaire: string;
}

export interface BilanSecondaireC {
  frequenceCardiaque: string;
  tensionArterielle: string;
  tensionDiastolique: string;
  pouls: EtatPouls;
  poulsLocalisation: string;
  tempsRecolorationCutanee: string;
  couleurPeau: CouleurPeau;
  temperaturePeau: 'CHAUDE' | 'FROIDE' | 'TIEDE' | '';
  sueur: boolean;
  hemorragieActive: boolean;
  hemorragieControlee: boolean;
  hemorragieLocalisation: string;
  glycemie: string;
  etatGlycemie: EtatGlycemie
  commentaire: string;
}

export interface BilanSecondaireD {
  scoreGlasgow: number;
  glasgowYeux: number;
  glasgowVerbal: number;
  glasgowMoteur: number;
  avpu: NiveauConscienceAVPU;
  pupilles: EtatPupilles;
  reactionPupille: ReactionPupilles;
  deficit: boolean;
  deficitType: string;
  convulsions: boolean;
  agitation: boolean;
  glycemie: string;
  commentaire: string;
}

export interface BilanSecondaireE {
  temperature: string;

  tete: string;
  cou: string;
  thorax: string;
  abdomen: string;
  bassin: string;
  membreSupDroit: string;
  membreSupGauche: string;
  membreInfDroit: string;
  membreInfGauche: string;
  dos: string;

  plaies: boolean;
  brulures: boolean;
  fractures: boolean;
  deformations: boolean;
  oedemes: boolean;

  hypoThermie: boolean;
  hyperThermie: boolean;

  commentaire: string;
}

export interface BilanComplet {
  id: string;
  circonstanciel: Partial<BilanCirconstanciel>;
  primaire: Partial<BilanPrimaire>;
  secondaire: {
    A: BilanSecondaireA;
    B: BilanSecondaireB;
    C: BilanSecondaireC;
    D: BilanSecondaireD;
    E: BilanSecondaireE;
  };
  gesteGlobaux: GesteSAP[];
  heureDebutIntervention: string;
  heureFinBilan: string;
}

export const defaultCirconstanciel: BilanCirconstanciel = {
  dateHeure: '',
  lieu: '',
  typeIntervention: 'MALAISE',
  age: '',
  sexe: 'INCONNU',
  poids: '',
  mecanisme: '',
  circonstances: '',
  antecedents: '',
  medicaments: '',
  allergies: '',
  medecinTraitant: '',

}

export const defaultPrimaire: BilanPrimaire = {
  conscience: 'ALERTE',
  ventilation: 'NORMALE',
  frequenceRespiratoire: '',
  pouls: 'PRESENT',
  frequenceCardiaque: '',
  hemorragie: false,
  hemorragieLocalisation: '',
  hemorragieControlee: false,
  couleurPeau: 'NORMALE',
  detresseVentilation: false,
  detresseCirculation: false,
  detresseNeurologique: false,
  gestesEffectues: [],
  observations: '',
};

export const defaultBilanA: BilanSecondaireA = {
  voiesAeriennes: 'LIBRES',
  corpsEtranger: false,
  corpsEtrangerType: '',
  position: '',
  traumaCervical: false,
  collierCervical: false,
  commentaire: '',
};

export const defaultBilanB: BilanSecondaireB = {
  frequenceRespiratoire: '',
  spo2: '',
  spo2SousO2: false,
  debitO2: '',
  rythme: '',
  amplitude: '',
  symetrieThorax: true,
  murmureVesiculaire: '',
  detresseRespiratoire: false,
  signesLutte: false,
  commentaire: '',
};

export const defaultBilanC: BilanSecondaireC = {
  frequenceCardiaque: '',
  tensionArterielle: '',
  tensionDiastolique: '',
  pouls: 'PRESENT',
  poulsLocalisation: 'Radial',
  tempsRecolorationCutanee: '',
  couleurPeau: 'NORMALE',
  temperaturePeau: '',
  sueur: false,
  hemorragieActive: false,
  hemorragieControlee: false,
  hemorragieLocalisation: '',
  glycemie: '',
  etatGlycemie: 'NORMALE',
  commentaire: '',
};

export const defaultBilanD: BilanSecondaireD = {
  scoreGlasgow: 15,
  glasgowYeux: 4,
  glasgowVerbal: 5,
  glasgowMoteur: 6,
  avpu: 'ALERTE',
  pupilles: 'NORMALES',
  reactionPupille: 'REACTIVES',
  deficit: false,
  deficitType: '',
  convulsions: false,
  agitation: false,
  glycemie: '',
  commentaire: '',
};

export const defaultBilanE: BilanSecondaireE = {
  temperature: '',
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
  plaies: false,
  brulures: false,
  fractures: false,
  deformations: false,
  oedemes: false,
  hypoThermie: false,
  hyperThermie: false,
  commentaire: '',
};

export const defaultBilanComplet: BilanComplet = {
  id: '',
  circonstanciel: defaultCirconstanciel,
  primaire: defaultPrimaire,
  secondaire: {
    A: defaultBilanA,
    B: defaultBilanB,
    C: defaultBilanC,
    D: defaultBilanD,
    E: defaultBilanE,
  },
  gesteGlobaux: [],
  heureDebutIntervention: '',
  heureFinBilan: '',
};
