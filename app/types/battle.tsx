import { Timestamp } from "firebase/firestore";

export interface Battle {
  Id: string;
  Date: Timestamp; //Populated on doc creation.
  PrimaryMission: string;
  MissionRule: string;
  Deployment: string;
  Attacker: string;
  AttackerArmy: string;
  AttackerDetachment: string;
  Defender: string;
  DefenderArmy: string;
  DefenderDetachment: string;
  FirstTurn: string;
  Size: string;
  T1AttackerSecondary1Title: string;
  T1AttackerSecondary1: number;
  T1AttackerSecondary2Title: string;
  T1AttackerSecondary2: number;
  T1DefenderSecondary1Title: string;
  T1DefenderSecondary1: number;
  T1DefenderSecondary2Title: string;
  T1DefenderSecondary2: number;
  T2AttackerPrimary: number;
  T2AttackerSecondary1Title: string;
  T2AttackerSecondary1: number;
  T2AttackerSecondary2Title: string;
  T2AttackerSecondary2: number;
  T2DefenderPrimary: number;
  T2DefenderSecondary1Title: string;
  T2DefenderSecondary1: number;
  T2DefenderSecondary2Title: string;
  T2DefenderSecondary2: number;
  T3AttackerPrimary: number;
  T3AttackerSecondary1Title: string;
  T3AttackerSecondary1: number;
  T3AttackerSecondary2Title: string;
  T3AttackerSecondary2: number;
  T3DefenderPrimary: number;
  T3DefenderSecondary1Title: string;
  T3DefenderSecondary1: number;
  T3DefenderSecondary2Title: string;
  T3DefenderSecondary2: number;
  T4AttackerPrimary: number;
  T4AttackerSecondary1Title: string;
  T4AttackerSecondary1: number;
  T4AttackerSecondary2Title: string;
  T4AttackerSecondary2: number;
  T4DefenderPrimary: number;
  T4DefenderSecondary1Title: string;
  T4DefenderSecondary1: number;
  T4DefenderSecondary2Title: string;
  T4DefenderSecondary2: number;
  T5AttackerPrimary: number;
  T5AttackerSecondary1Title: string;
  T5AttackerSecondary1: number;
  T5AttackerSecondary2Title: string;
  T5AttackerSecondary2: number;
  T5DefenderPrimary: number;
  T5DefenderSecondary1Title: string;
  T5DefenderSecondary1: number;
  T5DefenderSecondary2Title: string;
  T5DefenderSecondary2: number;
  AttackerMissionBonus: number;
  DefenderMissionBonus: number;
  Victor: string;
  VictoryType: string;
  TurnEnded: number;
  AttackerMVP: string;
  DefenderMVP: string;
  Notes: string;
  IsCompleted: boolean;
  TotalAttackerPrimary: number; //Max: 50
  TotalAttackerSecondary: number; //Max: 40
  TotalAttacker: number;
  TotalDefenderPrimary: number; //Max: 50
  TotalDefenderSecondary: number; //Max: 40
  TotalDefender: number;
}

export interface BattleSummary {
  Id: string;
  Date: Timestamp; //Populated on doc creation.
  PrimaryMission: string;
  MissionRule: string;
  Deployment: string;
  Attacker: string;
  AttackerArmy: string;
  Defender: string;
  DefenderArmy: string;
  TotalAttacker: number;
  TotalDefender: number;
  Victor: string;
  IsAttackerVictor: boolean;
  IsDefenderVictor: boolean;
  IsCompleted: boolean;
}
