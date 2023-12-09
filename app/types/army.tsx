export interface army {
  Id: string;
  Name: string;
  //To Complete
}

export interface armySummary {
  Id: string;
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
