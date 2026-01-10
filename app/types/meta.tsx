export interface iMetaStats {
  firstTurnData: { name: string; value: number }[];
  missionLethality: { Mission: string; AvgPoints: number }[];
  missionPopularity: { Mission: string; Games: number }[];
}