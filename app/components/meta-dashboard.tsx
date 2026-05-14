"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { iBattle } from "../types/battle";

const COLORS = ["#ff006e", "#00ffcc"]; // Neon Pink for 1st, Cyan for 2nd

const MetaDashboard = ({ battles }: { battles: iBattle[] }) => {
  const stats = useMemo(() => {
    let firstTurnWins = 0;
    let validGames = 0;
    const missions: Record<string, { totalPoints: number; games: number }> = {};

    battles.filter(b => b.IsCompleted).forEach((battle) => {
      // 1. First Turn vs Victor Logic
      if (battle.FirstTurn && battle.Victor) {
        validGames++;
        if (battle.FirstTurn === battle.Victor) {
          firstTurnWins++;
        }
      }

      // 2. Mission Aggregation
      const mName = battle.PrimaryMission || "Unknown";
      if (!missions[mName]) missions[mName] = { totalPoints: 0, games: 0 };
      missions[mName].totalPoints += (battle.TotalAttacker + battle.TotalDefender);
      missions[mName].games++;
    });

    const secondTurnWins = validGames - firstTurnWins;

    return {
      validGames,  // add this
      firstTurn: [
        { name: "1st Turn Win", value: firstTurnWins },
        { name: "2nd Turn Win", value: secondTurnWins },
      ],
      missionStats: Object.keys(missions).map((m) => ({
        Mission: m,
        AvgPoints: Math.round(missions[m].totalPoints / missions[m].games),
        Games: missions[m].games,
      })),
    };
  }, [battles]);

  return (
    <section className="section">
      <header className="section-header">
        <h2>Group Meta Analytics</h2>
      </header>

      <div className="dashboard-panels">
        {/* First Turn Advantage Pie Chart */}
        <div className="dashboard-panel">
          <h3>First Turn Advantage</h3>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>
            Winning based on who won the roll for first turn.
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.firstTurn}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                label={({ value }) => `${Math.round((value / stats.validGames) * 100)}%`}
              >
                {stats.firstTurn.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Mission Popularity */}
        <div className="dashboard-panel">
          <h3>Most Played Missions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.missionStats} margin={{ left: -25, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis dataKey="Mission" fontSize={10} interval={0} angle={-15} textAnchor="end" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="Games" fill="#00ffcc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mission Lethality */}
        <div className="dashboard-panel">
          <h3>Avg Total Score per Mission</h3>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>
            Combined score of both players.
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.missionStats} margin={{ left: -25, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis dataKey="Mission" fontSize={10} interval={0} angle={-15} textAnchor="end" />
              <YAxis domain={[0, 100]} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="AvgPoints" fill="#ff006e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default MetaDashboard;