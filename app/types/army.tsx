export interface Amy {
  Id: string;
  Name: string;
}

export interface ArmySummary {
  Id: string;
  Name: string;
  Played: number;
  Won: number;
  Lost: number;
  AveragePoints: number;
  TotalPoints: number;
  PointDifference: number;
  WinPercentage: number;
  FirstTurnPercentage: number;
}
