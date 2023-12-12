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
} from "recharts";
import { iBattle } from "../types/battle";
import getDocSnapshot from "../firebase/getDocSnapshot";

const ArmyDashboard = (props: { army: iArmy; battles: iBattle[] }) => {
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
                />
                <Legend verticalAlign="bottom" />

                <Bar dataKey="Won" stackId="a" fill="#667b99" label="1234" />
                <Bar dataKey="Lost" stackId="a" fill="#94a3b8" />
              </BarChart>
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
