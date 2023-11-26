import React, { useEffect, useState } from "react";
import firebase_app from "../firebase/config";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import Head from 'next/head';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import getArmyBattleCollectionSnapshot from "../firebase/getArmyBattleCollectionSnapshot";
import { formatDate } from "../utils/date-format";
import router from "next/router";


const ArmyDashboard = (armyID) => {

  /*
  const primaryPointsFor = isNaN(army.PrimaryPointsFor) ? 0 : army.PrimaryPointsFor;
  const primaryPointsAgainst = isNaN(army.PrimaryPointsAgainst) ? 0 : army.PrimaryPointsAgainst;
  const secondaryPointsFor = isNaN(army.SecondaryPointsFor) ? 0 : army.SecondaryPointsFor;
  const secondaryPointsAgainst = isNaN(army.SecondaryPointsAgainst) ? 0 : army.SecondaryPointsAgainst;
  */

  function handleRowClick(id) {
    router.push(`/battle/${id}`);
  }

  const db = getFirestore(firebase_app);
  const docId: string = armyID.armyID;
  //const docArmysRef = doc(db, "Battles", docId);

  const [dashboard, setDashboard] = useState({
    Name: "",
    Lost: 0,
    FirstTurn: 0,
    Played: 0,
    PrimaryPointsAgainst: 0,
    PrimaryPointsFor: 0,
    SecondaryPointsAgainst: 0,
    SecondaryPointsFor: 0,
    Won: 0,
    Opponent: {
      Name: "",
      Lost: 0,
      FirstTurn: 0,
      Played: 0,
      PrimaryPointsAgainst: 0,
      PrimaryPointsFor: 0,
      SecondaryPointsAgainst: 0,
      SecondaryPointsFor: 0,
      Won: 0,
    }
  });

  const armyBattles = getArmyBattleCollectionSnapshot(docId);


  //Used in:
  //- "Record vs Opponents" graph
  //- Stats
  let opponentBattles = [];
  armyBattles.forEach(groupBattles);
  function groupBattles(battle) {
    //Get opponent Army.
    const opponentArmy = battle.AttackerArmy === docId ? battle.DefenderArmy : battle.AttackerArmy;
    const victor = battle.Attacker === battle.Victor ? battle.AttackerArmy : battle.DefenderArmy;

    //Check if it exists in the opponentBattles array.
    if (!opponentBattles.some(opponent => opponent.Army === opponentArmy)) {
      //Push new opponent to array.
      opponentBattles.push({ Army: opponentArmy, Played: 0, Won: 0, Lost: 0 })
    }

    //Find the opponent armies object.
    const opponent = opponentBattles.find((army) => army["Army"] === opponentArmy);

    //Increment
    ++opponent["Played"];
    victor === docId ? ++opponent["Won"] : ++opponent["Lost"]
  }

  //Get the max number of games played.
  const yAxisLength = Math.max(...opponentBattles.map(opponent => opponent.Played));



  const opponentPrimaryPointsFor = isNaN(dashboard.Opponent.PrimaryPointsFor) ? 0 : dashboard.Opponent.PrimaryPointsFor;
  const opponentPrimaryPointsAgainst = isNaN(dashboard.Opponent.PrimaryPointsAgainst) ? 0 : dashboard.Opponent.PrimaryPointsAgainst;
  const opponentSecondaryPointsFor = isNaN(dashboard.Opponent.SecondaryPointsFor) ? 0 : dashboard.Opponent.SecondaryPointsFor;
  const opponentSecondaryPointsAgainst = isNaN(dashboard.Opponent.SecondaryPointsAgainst) ? 0 : dashboard.Opponent.SecondaryPointsAgainst;
  function handleOpponentChange(e) {
    let value: string = e.target.value;

    //Reset to show all opponent data when no opponent selected.
    if (value === "") {
      setDashboard((prev) => {
        return {
          ...prev, ["Opponent"]: {
            Name: dashboard.Name,
            Lost: dashboard.Lost,
            FirstTurn: dashboard.FirstTurn,
            Played: dashboard.Played,
            PrimaryPointsAgainst: dashboard.PrimaryPointsAgainst,
            PrimaryPointsFor: dashboard.PrimaryPointsFor,
            SecondaryPointsAgainst: dashboard.SecondaryPointsAgainst,
            SecondaryPointsFor: dashboard.SecondaryPointsFor,
            Won: dashboard.Won
          }
        };
      });
      return;
    }

    const opponentData = opponentBattles.filter(opponent => {
      return opponent.Army === value;
    })[0];

    setDashboard((prev) => {
      return { ...prev, ["Opponent"]: opponentData };
    });
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Armies", docId), (doc) => {
      setDashboard((prev) => {
        return { ...prev, ...doc.data(), };
      });
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    setDashboard((prev) => {
      return {
        ...prev, ["Opponent"]: {
          Name: dashboard.Name,
          Lost: dashboard.Lost,
          FirstTurn: dashboard.FirstTurn,
          Played: dashboard.Played,
          PrimaryPointsAgainst: dashboard.PrimaryPointsAgainst,
          PrimaryPointsFor: dashboard.PrimaryPointsFor,
          SecondaryPointsAgainst: dashboard.SecondaryPointsAgainst,
          SecondaryPointsFor: dashboard.SecondaryPointsFor,
          Won: dashboard.Won
        }, };
      });
  }, [
      dashboard.Name,
      dashboard.Lost,
      dashboard.FirstTurn,
      dashboard.Played,
      dashboard.PrimaryPointsAgainst,
      dashboard.PrimaryPointsFor,
      dashboard.SecondaryPointsAgainst,
      dashboard.SecondaryPointsFor,
      dashboard.Won
    ]);

  return (
    <>
      <Head>
        <title>{`Mt. Doom: ${dashboard.Name}`}</title>
      </Head>
      <section id="armyListDashboard" className="lg:flex-1">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-16">
          {dashboard.Name} - Under Construction
        </h1>

        <div className="stats-panel mb-20">
          <header className="flex justify-between w-full items-center">
            <h2 className="text-lg md:text-2xl font-bold mb-0">{dashboard.Name} Stats</h2>
            <div>
              <label className="text-sm">Filter by opponent:</label>
              <select
                id="opponent"
                name="Opponent"
                className="border p-2 ml-2"
                onChange={handleOpponentChange}
                required
              >
                <option value="">All Opponents</option>
                {opponentBattles.map((opponent, index) => <option value={opponent.Army} key={index}>{opponent.Army}</option>)}
              </select>
            </div>
          </header>
          <main className="flex w-full items-stretch gap-4 py-4 px-4">
              <div className="grow w-full"><span>Played</span>{dashboard.Opponent.Played}</div>
              <div className="grow w-full"><span>Won</span>{dashboard.Opponent.Won}</div>
              <div className="grow w-full"><span>Lost</span>{dashboard.Opponent.Lost}</div>
              <div className="grow w-full"><span>Avg. Points</span>{Math.round((opponentPrimaryPointsFor + opponentSecondaryPointsFor)/dashboard.Opponent.Played*10)/10}</div>
              <div className="grow w-full"><span>Total Points</span>{opponentPrimaryPointsFor + opponentSecondaryPointsFor}</div>
              <div className="grow w-full"><span>Points +/-</span>{opponentPrimaryPointsFor + opponentSecondaryPointsFor -  opponentPrimaryPointsAgainst - opponentSecondaryPointsAgainst}</div>
              <div className="grow w-full"><span>Win %</span>{Math.round((dashboard.Opponent.Won/dashboard.Opponent.Played)*1000)/10 + "%"}</div>
              {/* 
                //Come back to this.
                <li>First Turn %: {Math.round((dashboard.Opponent.FirstTurn/dashboard.Opponent.Played)*1000)/10 + "%"}</li>
              */}
          </main>
        </div>


        <div className="dashboard-panels flex gap-4 mb-20">

          <div className="dashboard-panel w-full">
            <h2 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">Record vs Opponents</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={opponentBattles}
                barCategoryGap={5}
                margin={{ left: -43, bottom: 58 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Army">
                </XAxis>
                <YAxis allowDecimals={false} domain={[0, yAxisLength]} />
                <Tooltip wrapperStyle={{
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

          <div className="dashboard-panel w-full">Line Graph showing points and Win/Loss</div>

          <div className="dashboard-panel w-full">Generals</div>

          <div className="dashboard-panel w-full">MVP/LVP</div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">
          Battles
        </h2>
        <table className="battles-list">
          <thead>
            <tr>
              <th>Date</th>
              <th>Mission</th>
              <th>Attacker</th>
              <th>Defender</th>
            </tr>
          </thead>

          <tbody>
            {armyBattles.map((battleItem, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(battleItem.id)}
                className="cursor-pointer"
              >
                <td>{formatDate(battleItem.Date.seconds)}</td>
                <td>
                  <strong>{battleItem.PrimaryMission}</strong>
                  <span>Mission Rule: {battleItem.MissionRule}</span>
                  <span>Deployment: {battleItem.Deployment}</span>
                </td>
                <td>
                  <strong>{battleItem.AttackerArmy}{battleItem.Victor === battleItem.Attacker ? " 🎖" : null}</strong>
                  <span>General: {battleItem.Attacker}</span>
                  <span>Total: {battleItem.TotalAttacker}</span>
                </td>
                <td>
                  <strong>{battleItem.DefenderArmy}{battleItem.Victor === battleItem.Defender ? " 🎖" : null}</strong>
                  <span>General: {battleItem.Defender}</span>
                  <span>Total: {battleItem.TotalDefender}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </section>
    </>
  );
};

export default ArmyDashboard;