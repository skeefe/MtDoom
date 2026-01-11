import React from "react";
import Spinner from "./spinner";
import { iArmy } from "../types/army";
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

const ArmyDashboard = (props: { army: iArmy; battles: iBattle[] }) => {
  let battleHistory: {
    OpponentArmy: string;
    OpponentScore: number;
    Score: number;
    Date: string;
  }[] = [];

  //Need for a tool tip.
  const armyName: string = props.army.Name;

  const getBattleHistoryData = () => {
    [...props.battles].forEach(getBattleHistory);
    return battleHistory;
  };

  const getBattleHistory = (battle) => {
    const isAttacker: boolean =
      battle.AttackerArmy === props.army.id ? true : false;

    const opponentArmyName: string = isAttacker
      ? getArmyName(battle.DefenderArmy)
      : getArmyName(battle.AttackerArmy);

    const opponentScore = isAttacker
      ? battle.TotalDefender
      : battle.TotalAttacker;

    const score = isAttacker ? battle.TotalAttacker : battle.TotalDefender;

    battleHistory.push({
      OpponentArmy: opponentArmyName,
      OpponentScore: opponentScore,
      Score: score,
      Date: formatDate(battle.Date.seconds).short,
    });

    return battleHistory;
  };

  let opponentBattles: {
    Army: string;
    Played: number;
    Won: number;
    Lost: number;
  }[] = [];

  const getOpponentRecordData = () => {
    props.battles.forEach(groupOpponentBattles);
    return opponentBattles.reverse();
  };

  const groupOpponentBattles = (battle) => {
    //Get opponent Army.
    const opponentArmyId =
      battle.AttackerArmy === props.army.id
        ? battle.DefenderArmy
        : battle.AttackerArmy;

    const opponentArmyName = getArmyName(opponentArmyId);

    const victor =
      battle.Attacker === battle.Victor
        ? battle.AttackerArmy
        : battle.DefenderArmy;

    //Check if it exists in the opponentBattles array, if not add it (empty).
    if (
      !opponentBattles.some((opponent) => opponent["Army"] === opponentArmyName)
    ) {
      opponentBattles.push({
        Army: opponentArmyName,
        Played: 0,
        Won: 0,
        Lost: 0,
      });
    }

    //Find the opponent armies object.
    let opponent = opponentBattles.find(
      (army) => army["Army"] === opponentArmyName
    );

    //Increment
    opponent && ++opponent["Played"];
    opponent && victor === props.army.id && ++opponent["Won"];
    opponent && victor !== props.army.id && ++opponent["Lost"];
  };

  const getArmyName = (armyId: string) => {
    const armyDoc = getDocSnapshot("Armies", armyId);
    return armyDoc["Name"];
  };

  //Get the max number of games played.
  let maxPlayed = 0;
  const yAxisLength = () => {
    opponentBattles.map((battle) => {
      const played = battle.Played;
      maxPlayed = Math.max(maxPlayed, played);
    });
    return maxPlayed;
  };

  const getVPs = () => {
    let mvps: { Unit: string }[] = [];
    let lvps: { Unit: string }[] = [];

    props.battles.map((battle) => {
      if (battle.AttackerArmy === props.army.id) {
        if (battle.AttackerMVP) {
          mvps.push({ Unit: battle.AttackerMVP });
        }
        if (battle.AttackerLVP) {
          lvps.push({ Unit: battle.AttackerLVP });
        }
      } else {
        if (battle.DefenderMVP) {
          mvps.push({ Unit: battle.DefenderMVP });
        }
        if (battle.DefenderLVP) {
          lvps.push({ Unit: battle.DefenderLVP });
        }
      }
    });

    //Only the latest 10
    return {
      mvps: mvps.slice(0, 10),
      lvps: lvps.slice(0, 10),
    };
  };



  return props.battles ? (
    <>

      <section className="section">
        <div className="dashboard-panels">
          <div className="dashboard-panel bg-darker border border-divider">
            <h3 className="text-primary">Record vs Opponents</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getOpponentRecordData()}
                barCategoryGap={10}
                margin={{ top: 20, right: 30, left: -20, bottom: 70 }}
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
                <YAxis allowDecimals={false} domain={[0, yAxisLength()]} tick={{ fill: 'var(--color-text-muted)' }} />
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
                <Bar name="Wins" dataKey="Won" stackId="a" fill="var(--color-secondary)" />
                <Bar name="Losses" dataKey="Lost" stackId="a" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-panel bg-darker border border-divider">
            <h3 className="text-primary">Points Record</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={getBattleHistoryData().reverse()}
                margin={{ top: 20, right: 30, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" />
                <XAxis dataKey="Date" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <YAxis allowDecimals={false} domain={[0, 90]} tick={{ fill: 'var(--color-text-muted)' }} />
                <Tooltip
                  cursor={{ stroke: 'var(--color-divider)', strokeWidth: 2 }}
                  content={(tooltipProps) => (
                    <ChartTooltipPoints
                      Date={tooltipProps.payload?.[0]?.payload.Date}
                      Army={armyName}
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
                  name={armyName}
                  stroke="var(--color-secondary)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-secondary)', r: 4 }}
                  activeDot={{ r: 8, stroke: 'var(--color-bg-darker)', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="OpponentScore"
                  name="Opponents"
                  stroke="var(--color-primary)"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="dashboard-panel">
            <h3>MVPs</h3>
            <ol className="vp-list">
              {getVPs().mvps.map((mvp, index) => (
                <li key={index}>{mvp.Unit}</li>
              ))}
            </ol>
          </div>

          <div className="dashboard-panel">
            <h3>LVPs</h3>
            <ol className="vp-list">
              {getVPs().lvps.map((lvp, index) => (
                <li key={index}>{lvp.Unit}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default ArmyDashboard;
