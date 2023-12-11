export interface iArmy {
  id: string;
  Bio: string;
  Colour: string;
  Crest: string;
  Emoji: string;
  FirstTurn: number;
  Lost: number;
  Name: string;
  Played: number;
  PrimaryPointsAgainst: number;
  PrimaryPointsFor: number;
  SecondaryPointsAgainst: number;
  SecondaryPointsFor: number;
  Won: number;
}

export interface iArmySummary {
  id: string;
  Name: string;
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
