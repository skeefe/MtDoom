"use client";

import React, { useEffect, useState } from "react";
import { iBattle } from "../types/battle";
import { selectOption } from "../types/select-option";
import { iStatPanel } from "../types/stat-panel";
import SelectField from "./selectField";
import { propertyFromID } from "../../utils/property-from-id";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import getDocSnapshot from "../firebase/getDocSnapshot";

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

  const armiesCollection = getCollectionSnapshot("Armies", "Name", "asc");
  const generalsCollection = getCollectionSnapshot("Generals", "Alias", "asc");
  const itemData = getDocSnapshot(props.Type, props.Item);

  //Retrieve Battle
  useEffect(() => {
    unfilteredStats();
  }, [itemData]);

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

    //Check for "Show All"
    if (value === "") {
      return unfilteredStats();
    }

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
      AveragePoints:
        Math.round((totalPointsFor / opponentBattleData.length) * 10) / 10,
      TotalPoints: totalPointsFor,
      PointDifference: totalPointsFor - totalPointsAgainst,
      WinPercentage:
        Math.round((totalWins / opponentBattleData.length) * 1000) / 10,
      FirstTurnPercentage:
        Math.round((firstTurnTotal / opponentBattleData.length) * 1000) / 10,
    };

    //Update State
    setStats((prev) => {
      return { ...prev, ...opponentData };
    });
  };

  const unfilteredStats = () => {
    const statData: iStatPanel = {
      id: "",
      Name: "",
      Played: itemData["Played"],
      Won: itemData["Won"],
      Lost: itemData["Lost"],
      AveragePoints:
        Math.round(
          ((itemData["PrimaryPointsFor"] + itemData["SecondaryPointsFor"]) /
            itemData["Played"]) *
            10
        ) / 10,
      TotalPoints:
        itemData["PrimaryPointsFor"] + itemData["SecondaryPointsFor"],
      PointDifference:
        itemData["PrimaryPointsFor"] +
        itemData["SecondaryPointsFor"] -
        itemData["PrimaryPointsAgainst"] -
        itemData["SecondaryPointsAgainst"],
      WinPercentage:
        Math.round((itemData["Won"] / itemData["Played"]) * 1000) / 10,
      FirstTurnPercentage:
        Math.round((itemData["FirstTurn"] / itemData["Played"]) * 1000) / 10,
    };

    //Update State
    setStats((prev) => {
      return { ...prev, ...statData };
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
          emptyValue="Show All"
        />
      </header>
      <div className="conent">
        <ul className="stat-panel-list">
          <li>
            <span className="stat-label" title="Battles Played">
              Played
            </span>
            <span className="stat-value">{stats.Played}</span>
          </li>
          <li>
            <span className="stat-label" title="First Turn Percentage">
              First&nbsp;Turn&nbsp;%
            </span>
            <span className="stat-value">{stats.FirstTurnPercentage}%</span>
          </li>
          <li>
            <span className="stat-label" title="Battles Won">
              Won
            </span>
            <span className="stat-value">{stats.Won}</span>
          </li>
          <li>
            <span className="stat-label" title="Battles Lost">
              Lost
            </span>
            <span className="stat-value">{stats.Lost}</span>
          </li>
          <li>
            <span className="stat-label" title="Average Points/Battle">
              Avg.&nbsp;Points
            </span>
            <span className="stat-value">{stats.AveragePoints}</span>
          </li>
          <li>
            <span className="stat-label" title="Total Points">
              Total&nbsp;Points
            </span>
            <span className="stat-value">{stats.TotalPoints}</span>
          </li>
          <li>
            <span className="stat-label" title="Points Difference">
              +/-
            </span>
            <span className="stat-value">{stats.PointDifference}</span>
          </li>
          <li>
            <span className="stat-label" title="Win Percentage">
              Win&nbsp;%
            </span>
            <span className="stat-value">{stats.WinPercentage}%</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default StatPanel;
