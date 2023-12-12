export interface iGeneral {
  id: string;
  Alias: string;
  Name: string;
  Emoji: string;
  FirstTurn: number;
  Lost: number;
  Nicknames: string;
  Bio: string;
  Played: number;
  PrimaryPointsAgainst: number;
  PrimaryPointsFor: number;
  SecondaryPointsAgainst: number;
  SecondaryPointsFor: number;
  Won: number;
}

export interface iGeneralSummary {
  id: string;
  //Name: string;
  Alias: string;
  Emoji: string;
  Played: number;
  Won: number;
  Lost: number;
  AveragePoints: number;
  TotalPoints: number;
  PointDifference: number;
  WinPercentage: number;
  FirstTurnPercentage: number;
}
