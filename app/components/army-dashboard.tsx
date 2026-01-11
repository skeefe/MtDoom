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
  // 1. Resetting these inside the functions now to prevent data doubling
  let battleHistory: any[] = [];
  let opponentBattles: any[] = [];

  const armyName: string = props.army.Name;

  // --- Points Record Logic (Oldest to Newest) ---
  const getBattleHistoryData = () => {
  // 1. Always reset the local array to avoid duplicate data on re-renders
  battleHistory = []; 

  // 2. Explicitly sort: Oldest battles first (left), Newest last (right)
  const sortedBattles = [...props.battles].sort((a, b) => a.Date.seconds - b.Date.seconds);
  
  // 3. Process the sorted battles
  sortedBattles.forEach(getBattleHistory);
  
  return battleHistory;
};

  const getBattleHistory = (battle: iBattle) => {
    const isAttacker = battle.AttackerArmy === props.army.id;

    const opponentArmyName = isAttacker
      ? getArmyName(battle.DefenderArmy)
      : getArmyName(battle.AttackerArmy);

    const opponentScore = isAttacker ? battle.TotalDefender : battle.TotalAttacker;
    const score = isAttacker ? battle.TotalAttacker : battle.TotalDefender;

    battleHistory.push({
      OpponentArmy: opponentArmyName,
      OpponentScore: opponentScore,
      Score: score,
      Date: formatDate(battle.Date.seconds).short,
    });
  };

  // --- Record vs Opponent Logic (Sorted by Games Played) ---
  const getOpponentRecordData = () => {
    opponentBattles = []; // Reset
    props.battles.forEach(groupOpponentBattles);
    // Sort by most played so the chart is consistent across tabs
    return opponentBattles.sort((a, b) => b.Played - a.Played);
  };

  const groupOpponentBattles = (battle: iBattle) => {
    const opponentArmyId = battle.AttackerArmy === props.army.id
        ? battle.DefenderArmy
        : battle.AttackerArmy;

    const opponentArmyName = getArmyName(opponentArmyId);

    // Correctly identify victor army
    const victorArmyId = battle.Attacker === battle.Victor 
        ? battle.AttackerArmy 
        : battle.DefenderArmy;

    if (!opponentBattles.some((opponent) => opponent.Army === opponentArmyName)) {
      opponentBattles.push({
        Army: opponentArmyName,
        Played: 0,
        Won: 0,
        Lost: 0,
      });
    }

    let opponent = opponentBattles.find((army) => army.Army === opponentArmyName);

    if (opponent) {
      opponent.Played++;
      if (battle.Victor) {
        victorArmyId === props.army.id ? opponent.Won++ : opponent.Lost++;
      }
    }
  };

  const getArmyName = (armyId: string) => {
    const armyDoc = getDocSnapshot("Armies", armyId);
    return armyDoc["Name"];
  };

  let maxPlayed = 0;
  const yAxisLength = () => {
    maxPlayed = 0; // Reset
    opponentBattles.forEach((battle) => {
      maxPlayed = Math.max(maxPlayed, battle.Played);
    });
    return maxPlayed;
  };

  const getVPs = () => {
    let mvps: { Unit: string }[] = [];
    let lvps: { Unit: string }[] = [];

    props.battles.forEach((battle) => {
      if (battle.AttackerArmy === props.army.id) {
        if (battle.AttackerMVP) mvps.push({ Unit: battle.AttackerMVP });
        if (battle.AttackerLVP) lvps.push({ Unit: battle.AttackerLVP });
      } else {
        if (battle.DefenderMVP) mvps.push({ Unit: battle.DefenderMVP });
        if (battle.DefenderLVP) lvps.push({ Unit: battle.DefenderLVP });
      }
    });

    return { mvps: mvps.slice(0, 10), lvps: lvps.slice(0, 10) };
  };

  return props.battles ? (
    <>
      <section className="section">
        <header className="section-header">
          <h2>Combat Analytics</h2>
        </header>

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
                data={getBattleHistoryData()} // Removed .reverse() here
                margin={{ top: 20, right: 30, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" />
                <XAxis dataKey="Date" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <YAxis allowDecimals={false} domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)' }} />
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
        </div>

        <div className="dashboard-panels">
            <div className="dashboard-panel bg-darker border border-divider">
                <h3 className="text-primary">MVPs</h3>
                <ol className="vp-list">
                {getVPs().mvps.map((mvp, index) => (
                    <li key={index} className="text-secondary">{mvp.Unit}</li>
                ))}
                </ol>
            </div>

            <div className="dashboard-panel bg-darker border border-divider">
                <h3 className="text-primary">LVPs</h3>
                <ol className="vp-list">
                {getVPs().lvps.map((lvp, index) => (
                    <li key={index} className="text-primary-light">{lvp.Unit}</li>
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