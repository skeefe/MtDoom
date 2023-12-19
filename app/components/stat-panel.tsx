"use client";

import React, { useEffect, useState } from "react";
import { iBattle } from "../types/battle";
import { selectOption } from "../types/select-option";
import { iStatPanel } from "../types/stat-panel";
import SelectField from "./selectField";
import { propertyFromID } from "../../utils/property-from-id";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";

const StatPanel = (props: {
  Item: string;
  Type: "Armies" | "Generals";
  Battles: iBattle[];
}) => {
  const [stats, setStats] = useState<iStatPanel>({
    id: "",
    Name: "",
    Played: 0,
    Won: 0,
    Lost: 0,
    AveragePoints: 0,
    TotalPoints: 0,
    PointDifference: 0,
    WinPercentage: 0,
    FirstTurnPercentage: 0,
  });

  /*
  //Retrieve Battle
  useEffect(() => {
    setStats((prev) => {
      return { ...prev, ...props.Battles };
    });
  }, []);
  */

  const armiesCollection = getCollectionSnapshot("Armies", "Name", "asc");
  const generalsCollection = getCollectionSnapshot("Generals", "Alias", "asc");

  const getArmiesGenerals = () => {
    let Armies: selectOption[] = [];
    let Generals: selectOption[] = [];
    let ArmiesGenerals: selectOption[] = [];

    props.Battles.forEach((battle) => {
      let isAttacker =
        props.Type === "Armies" && battle.AttackerArmy === props.Item
          ? true
          : props.Type === "Generals" && battle.Attacker === props.Item
          ? true
          : false;

      Armies.push(
        !isAttacker
          ? {
              Label: propertyFromID(
                armiesCollection,
                battle.AttackerArmy,
                "Name"
              ),
              Value: `a-${battle.AttackerArmy}`,
              Active: true,
            }
          : {
              Label: propertyFromID(
                armiesCollection,
                battle.DefenderArmy,
                "Name"
              ),
              Value: `a-${battle.DefenderArmy}`,
              Active: true,
            }
      );
      Generals.push(
        !isAttacker
          ? {
              Label: propertyFromID(
                generalsCollection,
                battle.Attacker,
                "Alias"
              ),
              Value: `g-${battle.Attacker}`,
              Active: true,
            }
          : {
              Label: propertyFromID(
                generalsCollection,
                battle.Defender,
                "Alias"
              ),
              Value: `g-${battle.Defender}`,
              Active: true,
            }
      );
    });

    ArmiesGenerals.push(...Armies, ...Generals);

    return ArmiesGenerals.filter(
      (obj, index) =>
        ArmiesGenerals.findIndex((item) => item.Value === obj.Value) === index
    );
  };

  //const handleChange = (e) => {
  const handleChange = (e) => {
    const value = e.target.value;

    filterStatPanel(value);
  };

  const filterStatPanel = (value) => {
    //Army or General
    const type: "Army" | "General" =
      value.slice(0, 1) === "a" ? "Army" : "General";

    //Drop the prefix.
    const opponentId = value.slice(2);

    //Filter data
    let opponentBattleData: iBattle[] =
      type === "Army"
        ? props.Battles.filter(
            (b) =>
              b.AttackerArmy === opponentId || b.DefenderArmy === opponentId
          )
        : props.Battles.filter(
            (b) => b.Attacker === opponentId || b.Defender === opponentId
          );

    //Make calculations
    let totalPointsFor: number = 0;
    let totalPointsAgainst: number = 0;
    let firstTurnTotal: number = 0;
    let totalWins: number = 0;

    opponentBattleData.forEach((battle) => {
      const isOpponentAttacker =
        type === "Army" && battle.AttackerArmy === opponentId
          ? true
          : type === "General" && battle.Attacker === opponentId
          ? true
          : false;

      totalPointsFor =
        totalPointsFor +
        (isOpponentAttacker ? battle.TotalDefender : battle.TotalAttacker);
      totalPointsAgainst =
        totalPointsAgainst +
        (isOpponentAttacker ? battle.TotalAttacker : battle.TotalDefender);

      firstTurnTotal =
        isOpponentAttacker && battle.Attacker !== battle.FirstTurn
          ? firstTurnTotal + 1
          : !isOpponentAttacker && battle.Defender !== battle.FirstTurn
          ? firstTurnTotal + 1
          : firstTurnTotal;

      totalWins =
        isOpponentAttacker && battle.Attacker !== battle.Victor
          ? totalWins + 1
          : !isOpponentAttacker && battle.Defender !== battle.Victor
          ? totalWins + 1
          : totalWins;
    });

    const opponentData: iStatPanel = {
      id: value,
      Name:
        type === "Army"
          ? propertyFromID(armiesCollection, opponentId, "Name")
          : propertyFromID(generalsCollection, opponentId, "Alias"),

      Played: opponentBattleData.length,
      Won: totalWins,
      Lost: opponentBattleData.length - totalWins,
      AveragePoints: totalPointsFor / opponentBattleData.length,
      TotalPoints: totalPointsFor,
      PointDifference: totalPointsFor - totalPointsAgainst,
      WinPercentage: (totalWins / opponentBattleData.length) * 100,
      FirstTurnPercentage: firstTurnTotal / opponentBattleData.length,
    };

    //Update State
    setStats((prev) => {
      return { ...prev, ...opponentData };
    });
  };

  return (
    <section className="section">
      <header className="section-header">
        <h2>Stats</h2>
        <SelectField
          required={false}
          id="filterStats"
          name="FilterStats"
          changeFunction={handleChange}
          value={stats.id}
          options={getArmiesGenerals()}
          emptyValue="Select an Opponent"
        />
      </header>
      <div className="conent">
        <ul className="stat-panel-list">
          <li>ID {stats.id}</li>
          <li>Name{stats.Name}</li>
          <li>Played {stats.Played}</li>
          <li>Won {stats.Won}</li>
          <li>Lost {stats.Lost}</li>
          <li>AveragePoints {stats.AveragePoints}</li>
          <li>TotalPoints {stats.TotalPoints}</li>
          <li>PointDifference {stats.PointDifference}</li>
          <li>WinPercentage {stats.WinPercentage}</li>
          <li>FirstTurnPercentage {stats.FirstTurnPercentage}</li>
        </ul>
      </div>
    </section>
  );
};

export default StatPanel;
