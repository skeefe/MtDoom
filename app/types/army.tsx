export interface iArmy {
  id: string;
  Bio: string;
  Colour: string;
  Crest: string;
  Emoji: string;
  Name: string;
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
  NemesisName: string;
  NemesisEmoji: string;
  PreyName: string;
  PreyEmoji: string;
}
