import React from "react";
import Spinner from "./spinner";
import { iGeneral } from "../types/general";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { iBattle } from "../types/battle";
import getDocSnapshot from "../firebase/getDocSnapshot";
import { formatDate } from "../../utils/date-format";
import ChartTooltipRecord from "./chart-tooltip-record";
import ChartTooltipPoints from "./chart-tooltip-points";

const GeneralDashboard = (props: { general: iGeneral; battles: iBattle[] }) => {
  let battleHistory: {
    Army: string;
    OpponentArmy: string;
    OpponentScore: number;
    Score: number;
    Date: string;
  }[] = [];

  //Need for a tool tip.
  const armyName: string = props.general.Name;

  const getBattleHistoryData = () => {
    [...props.battles].forEach(getBattleHistory);
    return battleHistory;
  };

  const getBattleHistory = (battle) => {
    const isAttacker: boolean =
      battle.Attacker === props.general.id ? true : false;

    const armyName: string = isAttacker
      ? getArmyName(battle.AttackerArmy)
      : getArmyName(battle.DefenderArmy);

    const opponentArmyName: string = isAttacker
      ? getArmyName(battle.DefenderArmy)
      : getArmyName(battle.AttackerArmy);

    const opponentScore = isAttacker
      ? battle.TotalDefender
      : battle.TotalAttacker;

    const score = isAttacker ? battle.TotalAttacker : battle.TotalDefender;

    battleHistory.push({
      Army: armyName,
      OpponentArmy: opponentArmyName,
      OpponentScore: opponentScore,
      Score: score,
      Date: formatDate(battle.Date.seconds).short,
    });

    return battleHistory;
  };

  let opponentGeneralBattles: {
    General: string;
    Played: number;
    Won: number;
    Lost: number;
  }[] = [];

  const getOpponentGeneralRecordData = () => {
    props.battles.forEach(groupOpponentGeneralBattles);
    return opponentGeneralBattles.reverse();
  };

  const groupOpponentGeneralBattles = (battle) => {
    //Get opponent General.
    const opponentGeneralId =
      battle.Attacker === props.general.id ? battle.Defender : battle.Attacker;

    const opponentGeneralName = getGeneralAlias(opponentGeneralId);

    const victor =
      battle.Attacker === battle.Victor ? battle.Attacker : battle.Defender;

    //Check if it exists in the opponentBattles array, if not add it (empty).
    if (
      !opponentGeneralBattles.some(
        (opponent) => opponent["General"] === opponentGeneralName
      )
    ) {
      opponentGeneralBattles.push({
        General: opponentGeneralName,
        Played: 0,
        Won: 0,
        Lost: 0,
      });
    }

    //Find the opponent armies object.
    let opponent = opponentGeneralBattles.find(
      (army) => army["General"] === opponentGeneralName
    );

    //Increment
    opponent && ++opponent["Played"];
    opponent && victor === props.general.id && ++opponent["Won"];
    opponent && victor !== props.general.id && ++opponent["Lost"];
  };

  //----

  let opponentArmyBattles: {
    Army: string;
    Played: number;
    Won: number;
    Lost: number;
  }[] = [];

  const getOpponentArmyRecordData = () => {
    props.battles.forEach(groupOpponentArmyBattles);
    return opponentArmyBattles.reverse();
  };

  const groupOpponentArmyBattles = (battle) => {
    //Get opponent Army.
    const opponentArmyId =
      battle.Attacker === props.general.id
        ? battle.DefenderArmy
        : battle.AttackerArmy;

    const opponentArmyName = getArmyName(opponentArmyId);

    const victor =
      battle.Attacker === battle.Victor ? battle.Attacker : battle.Defender;

    //Check if it exists in the opponentBattles array, if not add it (empty).
    if (
      !opponentArmyBattles.some(
        (opponent) => opponent["Army"] === opponentArmyName
      )
    ) {
      opponentArmyBattles.push({
        Army: opponentArmyName,
        Played: 0,
        Won: 0,
        Lost: 0,
      });
    }

    //Find the opponent armies object.
    let opponent = opponentArmyBattles.find(
      (army) => army["Army"] === opponentArmyName
    );

    //Increment
    opponent && ++opponent["Played"];
    opponent && victor === props.general.id && ++opponent["Won"];
    opponent && victor !== props.general.id && ++opponent["Lost"];
  };

  //Utils
  const getGeneralAlias = (generalId: string) => {
    const generalDoc = getDocSnapshot("Generals", generalId);
    return generalDoc["Alias"];
  };

  const getArmyName = (armyId: string) => {
    const armyDoc = getDocSnapshot("Armies", armyId);
    return armyDoc["Name"];
  };

  //Get the max number of General games played.
  let maxGeneralPlayed = 0;
  const yAxisGeneralLength = () => {
    opponentGeneralBattles.map((battle) => {
      const played = battle.Played;
      maxGeneralPlayed = Math.max(maxGeneralPlayed, played);
    });
    return maxGeneralPlayed;
  };

  //Get the max number of Army games played.
  let maxArmyPlayed = 0;
  const yAxisArmyLength = () => {
    opponentArmyBattles.map((battle) => {
      const played = battle.Played;
      maxArmyPlayed = Math.max(maxArmyPlayed, played);
    });
    return maxArmyPlayed;
  };

  return props.battles ? (
    <>
      <section className="section">
        <div className="dashboard-panels">
          <div className="dashboard-panel bg-darker border border-divider">
            <h3 className="text-primary">Record vs Army</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getOpponentArmyRecordData()}
                barCategoryGap={10}
                margin={{ top: 10, right: 30, left: -20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-divider)" />
                <XAxis
                  dataKey="Army"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                />
                <YAxis allowDecimals={false} domain={[0, yAxisArmyLength()]} tick={{ fill: 'var(--color-text-muted)' }} />
                <Tooltip
                  cursor={{ fill: "var(--color-bg-light)", opacity: 0.1 }}
                  content={(tooltipProps) => (
                    <ChartTooltipRecord
                      OpponentArmy={tooltipProps.payload?.[0]?.payload.Army}
                      Won={tooltipProps.payload?.[0]?.payload.Won}
                      Lost={tooltipProps.payload?.[0]?.payload.Lost}
                    />
                  )}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: "20px" }} />
                <Bar name="Wins" dataKey="Won" stackId="a" fill="var(--color-primary-hover)" />
                <Bar name="Losses" dataKey="Lost" stackId="a" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="dashboard-panel bg-darker border border-divider">
            <h3 className="text-primary">Record vs General</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getOpponentGeneralRecordData()}
                barCategoryGap={10}
                margin={{ top: 10, right: 30, left: -20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-divider)" />
                <XAxis
                  dataKey="General"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                />
                <YAxis allowDecimals={false} domain={[0, yAxisGeneralLength()]} tick={{ fill: 'var(--color-text-muted)' }} />
                <Tooltip
                  cursor={{ fill: "var(--color-bg-light)", opacity: 0.1 }}
                  content={(tooltipProps) => (
                    <ChartTooltipRecord
                      OpponentArmy={tooltipProps.payload?.[0]?.payload.General}
                      Won={tooltipProps.payload?.[0]?.payload.Won}
                      Lost={tooltipProps.payload?.[0]?.payload.Lost}
                    />
                  )}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: "20px" }} />
                <Bar name="Wins" dataKey="Won" stackId="a" fill="var(--color-primary-hover)" />
                <Bar name="Losses" dataKey="Lost" stackId="a" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="dashboard-panels single">
          <div className="dashboard-panel bg-darker border border-divider">
            <h3 className="text-primary">Points Record</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={getBattleHistoryData().reverse()}
                margin={{ top: 10, right: 30, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" />
                <XAxis dataKey="Date" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <YAxis allowDecimals={false} domain={[0, 90]} tick={{ fill: 'var(--color-text-muted)' }} />
                <Tooltip
                  cursor={{ stroke: 'var(--color-divider)', strokeWidth: 2 }}
                  content={(tooltipProps) => (
                    <ChartTooltipPoints
                      Date={tooltipProps.payload?.[0]?.payload.Date}
                      Army={tooltipProps.payload?.[0]?.payload.Army}
                      ArmyScore={tooltipProps.payload?.[0]?.payload.Score}
                      OpponentArmy={tooltipProps.payload?.[0]?.payload.OpponentArmy}
                      OpponentArmyScore={tooltipProps.payload?.[0]?.payload.OpponentScore}
                    />
                  )}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="Score"
                  name="General Score"
                  stroke="var(--color-primary-hover)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary-hover)', r: 4 }}
                  activeDot={{ r: 8, stroke: 'var(--color-primary-hover)', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="OpponentScore"
                  name="Opponent Score"
                  stroke="var(--color-primary)"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </>
  ) : (
    <Spinner />
  );
};
export default GeneralDashboard;
