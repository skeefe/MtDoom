export interface general {
  Id: string;
  Name: string;
  //To Complete
}

export interface generalSummary {
  Id: string;
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
