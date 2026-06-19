import { Timestamp } from "firebase/firestore";

export interface iBattle {
  id: string;
  Edition: number;
  IsCompleted: boolean;
  Show: boolean;

  Date: { seconds: number };
  ChapterApprovedVersion: string;
  PrimaryMission: string;
  Size: string;
  MissionRule: string;
  Deployment: string;
  Attacker: string;
  AttackerArmy: string;
  AttackerDetachment: string;
  AttackerList: string;
  Defender: string;
  DefenderArmy: string;
  DefenderDetachment: string;
  DefenderList: string;
  FirstTurn: string;
  IsAttackerFirst: boolean;

  // 11th edition fields
  AttackerForceDisposition?: string;
  DefenderForceDisposition?: string;
  AttackerSecondaryType?: string;
  DefenderSecondaryType?: string;
  AttackerDetachments?: string[];
  DefenderDetachments?: string[];
  AttackerPrimaryMission?: string;
  DefenderPrimaryMission?: string;
  Layout?: string;

  T1AttackerPrimary: number;
  T2AttackerPrimary: number;
  T3AttackerPrimary: number;
  T4AttackerPrimary: number;
  T5AttackerPrimary: number;
  AttackerMissionBonus: number;
  TotalAttackerPrimary: number;

  T1AttackerSecondary1Title: string;
  T1AttackerSecondary1: number;
  T1AttackerSecondary2Title: string;
  T1AttackerSecondary2: number;
  T2AttackerSecondary1Title: string;
  T2AttackerSecondary1: number;
  T2AttackerSecondary2Title: string;
  T2AttackerSecondary2: number;
  T3AttackerSecondary1Title: string;
  T3AttackerSecondary1: number;
  T3AttackerSecondary2Title: string;
  T3AttackerSecondary2: number;
  T4AttackerSecondary1Title: string;
  T4AttackerSecondary1: number;
  T4AttackerSecondary2Title: string;
  T4AttackerSecondary2: number;
  T5AttackerSecondary1Title: string;
  T5AttackerSecondary1: number;
  T5AttackerSecondary2Title: string;
  T5AttackerSecondary2: number;
  TotalAttackerSecondary: number;

  T2AttackerChallengerTitle: string;
  T2AttackerChallenger: number;
  T3AttackerChallenger: number;
  T3AttackerChallengerTitle: string;
  T4AttackerChallengerTitle: string;
  T4AttackerChallenger: number;
  T5AttackerChallengerTitle: string;
  T5AttackerChallenger: number;
  TotalAttackerChallenger: number;

  TotalAttacker: number;

  T1DefenderPrimary: number;
  T2DefenderPrimary: number;
  T3DefenderPrimary: number;
  T4DefenderPrimary: number;
  T5DefenderPrimary: number;
  DefenderMissionBonus: number;
  TotalDefenderPrimary: number;

  T1DefenderSecondary1Title: string;
  T1DefenderSecondary1: number;
  T1DefenderSecondary2Title: string;
  T1DefenderSecondary2: number;
  T2DefenderSecondary1Title: string;
  T2DefenderSecondary1: number;
  T2DefenderSecondary2Title: string;
  T2DefenderSecondary2: number;
  T3DefenderSecondary1Title: string;
  T3DefenderSecondary1: number;
  T3DefenderSecondary2Title: string;
  T3DefenderSecondary2: number;
  T4DefenderSecondary1Title: string;
  T4DefenderSecondary1: number;
  T4DefenderSecondary2Title: string;
  T4DefenderSecondary2: number;
  T5DefenderSecondary1Title: string;
  T5DefenderSecondary1: number;
  T5DefenderSecondary2Title: string;
  T5DefenderSecondary2: number;
  TotalDefenderSecondary: number;

  T2DefenderChallengerTitle: string;
  T2DefenderChallenger: number;
  T3DefenderChallenger: number;
  T3DefenderChallengerTitle: string;
  T4DefenderChallengerTitle: string;
  T4DefenderChallenger: number;
  T5DefenderChallengerTitle: string;
  T5DefenderChallenger: number;
  TotalDefenderChallenger: number;

  TotalDefender: number;

  Victor: string;
  VictoryType: string;
  TurnEnded: number;
  AttackerMVP: string;
  DefenderMVP: string;
  AttackerLVP: string;
  DefenderLVP: string;
  BattleNotes: string;
}

export interface iBattleSummary {
  id: string;
  Edition: number;
  IsCompleted: boolean;
  Show: boolean;
  Date: Timestamp;
  PrimaryMission: string;
  MissionRule: string;
  Deployment: string;
  Size?: string;
  Attacker: string;
  AttackerArmy: string;
  AttackerPrimaryMission?: string;
  AttackerForceDisposition?: string;
  Defender: string;
  DefenderArmy: string;
  DefenderPrimaryMission?: string;
  DefenderForceDisposition?: string;
  Layout?: string;
  TotalAttacker: number;
  TotalDefender: number;
  Victor: string;
  FirstTurn: string;
}