export interface iGeneral {
  id: string;
  Alias: string;
  Name: string;
  Emoji: string;
  Nicknames: string;
  Bio: string;
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
