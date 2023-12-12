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
} from "recharts";
import { iBattle } from "../types/battle";
import getDocSnapshot from "../firebase/getDocSnapshot";

const GeneralDashboard = (props: { general: iGeneral; battles: iBattle[] }) => {
  let opponentGeneralBattles: {
    General: string;
    Played: number;
    Won: number;
    Lost: number;
  }[] = [];

  const getOpponentGeneralRecordData = () => {
    props.battles.forEach(groupOpponentGeneralBattles);
    return opponentGeneralBattles;
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
    return opponentArmyBattles;
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
          <div className="dashboard-panel">
            <h3>Record vs Army</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getOpponentArmyRecordData()}
                barCategoryGap={5}
                margin={{ left: -43, bottom: 58 }}
                width={730}
                height={250}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Army" />
                <YAxis allowDecimals={false} domain={[0, yAxisArmyLength()]} />
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
          <div className="dashboard-panel">
            <h3>Record vs General</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getOpponentGeneralRecordData()}
                barCategoryGap={5}
                margin={{ left: -43, bottom: 58 }}
                width={730}
                height={250}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="General" />
                <YAxis
                  allowDecimals={false}
                  domain={[0, yAxisGeneralLength()]}
                />
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
export default GeneralDashboard;
