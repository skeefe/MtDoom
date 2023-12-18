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
    props.battles.reverse().forEach(getBattleHistory);
    return battleHistory.reverse();
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
    return opponentBattles;
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
      !opponentBattles.some((opponent) => opponent["Army"] === opponentArmyId)
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

    //Only the latest 4
    return { mvps: mvps.slice(0, 4), lvps: lvps.slice(0, 4) };
  };

  return props.battles ? (
    <>
      <section className="section">
        <div className="dashboard-panels">
          <div className="dashboard-panel">
            <h3>Record vs Opponents</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getOpponentRecordData()}
                barCategoryGap={5}
                margin={{ left: -43, bottom: 58 }}
                width={730}
                height={250}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Army" />
                <YAxis allowDecimals={false} domain={[0, yAxisLength()]} />
                <Tooltip
                  wrapperStyle={{
                    color: "#64748b",
                    backgroundColor: "#fff",
                    border: "2px solid #1e293b",
                  }}
                  cursor={false}
                  content={(props) => (
                    <ChartTooltipRecord
                      OpponentArmy={
                        props.payload &&
                        props.payload[0] != null &&
                        props.payload[0].payload.Army
                      }
                      Won={
                        props.payload &&
                        props.payload[0] != null &&
                        props.payload[0].payload.Won
                      }
                      Lost={
                        props.payload &&
                        props.payload[0] != null &&
                        props.payload[0].payload.Lost
                      }
                    />
                  )}
                />
                <Legend verticalAlign="bottom" />
                <Bar dataKey="Won" stackId="a" fill="#667b99" label="1234" />
                <Bar dataKey="Lost" stackId="a" fill="#94a3b8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-panel">
            <h3>MVPs</h3>
            <ol>
              {getVPs().mvps.map((mvp, index) => (
                <li key={index}>{mvp.Unit}</li>
              ))}
            </ol>
            <h3>LVPs</h3>
            <ol>
              {getVPs().lvps.map((lvp, index) => (
                <li key={index}>{lvp.Unit}</li>
              ))}
            </ol>
          </div>

          <div className="dashboard-panel">
            <h3>Points Record</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={730}
                height={250}
                data={getBattleHistoryData()}
                margin={{ left: -35, bottom: 58 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontalValues={[30, 60, 90]}
                />
                <XAxis dataKey="Date" />
                <YAxis
                  allowDecimals={false}
                  ticks={[30, 60, 90]}
                  domain={[0, 90]}
                />
                <Tooltip
                  wrapperStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #1e293b",
                    color: "#64748b",
                  }}
                  cursor={false}
                  content={(props) => (
                    <ChartTooltipPoints
                      Date={
                        props.payload &&
                        props.payload[0] != null &&
                        props.payload[0].payload.Date
                      }
                      Army={armyName}
                      ArmyScore={
                        props.payload &&
                        props.payload[0] != null &&
                        props.payload[0].payload.Score
                      }
                      OpponentArmy={
                        props.payload &&
                        props.payload[0] != null &&
                        props.payload[0].payload.OpponentArmy
                      }
                      OpponentArmyScore={
                        props.payload &&
                        props.payload[0] != null &&
                        props.payload[0].payload.OpponentScore
                      }
                    />
                  )}
                />
                <Legend verticalAlign="bottom" />
                <Line
                  type="monotone"
                  dataKey="Score"
                  stroke="#c2410c"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="OpponentScore"
                  name="Opponent Score"
                  stroke="#94a3b8"
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

export default ArmyDashboard;
