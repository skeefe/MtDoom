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
    Won: 0
  });

  const armyBattles = getArmyBattleCollectionSnapshot(docId);

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

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Armies", docId), (doc) => {
      setDashboard((prev) => {
        return { ...prev, ...doc.data() };
      });
    });
    return () => unsubscribe();
  }, []);


  return (
    <>
      <Head>
        <title>{`Mt. Doom: ${dashboard.Name}`}</title>
      </Head>
      <section id="armyListDashboard" className="lg:flex-1">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8">
          {dashboard.Name} - Under Construction
        </h1>

        <ul>
          <li>Played: {dashboard.Played}</li>
          <li>Won: {dashboard.Won}</li>
          <li>Lost: {dashboard.Lost}</li>
          <li>Primary Points For: {dashboard.PrimaryPointsFor}</li>
          <li>Primary Points Against: {dashboard.PrimaryPointsAgainst}</li>
          <li>Secondary Points For: {dashboard.SecondaryPointsFor}</li>
          <li>Secondary Points Against: {dashboard.SecondaryPointsAgainst}</li>
          <li>First Turn: {dashboard.FirstTurn}</li>
        </ul>


        <div>
          <h2>Record vs Opponents</h2>
        <BarChart
          width={500}
          height={300}
          data={opponentBattles}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barCategoryGap={5}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="Army">
            {/* <Label value="Opponents" offset={0} position="bottom" /> */}
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