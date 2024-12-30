"use client";

import React from "react";
import ArmiesTable from "../components/armies-table";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import LinkList from "../components/link-list";

import { iArmySummary } from "../types/army";
import { iBattleSummary } from "../types/battle";
import { linkListItem } from "../types/link-list-item";

const Armies = () => {
  //Required to remove any "Show=FALSE" battles.
  const filterShow = (item) => {
    return item.Show !== false;
  };

  // Retrieve army collection data.
  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc").filter(
    filterShow
  );

  // Retrieve battle collection data.
  const battleCollection = getCollectionSnapshot("Battles").filter(filterShow);

  //Setup array of battles.
  let battles: iBattleSummary[] = new Array();
  battleCollection.map((battle) => {
    battles.push({
      id: battle.id,
      Date: battle.Date,
      PrimaryMission: battle.PrimaryMission,
      MissionRule: battle.MissionRule,
      Deployment: battle.Deployment,
      Attacker: battle.Attacker,
      AttackerArmy: battle.AttackerArmy,
      TotalAttacker: battle.TotalAttacker,
      Defender: battle.Defender,
      DefenderArmy: battle.DefenderArmy,
      TotalDefender: battle.TotalDefender,
      Victor: battle.Victor,
      IsCompleted: battle.IsCompleted,
      Show: battle.Show,
      FirstTurn: battle.FirstTurn,
    });
  });

  const armyPlayed = (armyId) => {
    return battles.filter(
      (obj) =>
        (Object.keys(obj).includes("AttackerArmy") && obj["AttackerArmy"]) ===
          armyId ||
        (Object.keys(obj).includes("DefenderArmy") &&
          obj["DefenderArmy"] === armyId)
    ).length;
  };

  const armyWon = (armyId) => {
    return battles.filter(
      (obj) =>
        ((Object.keys(obj).includes("Victor") &&
          Object.keys(obj).includes("AttackerArmy") &&
          obj["AttackerArmy"]) === armyId &&
          obj["Attacker"] === obj["Victor"]) ||
        ((Object.keys(obj).includes("Victor") &&
          Object.keys(obj).includes("DefenderArmy") &&
          obj["DefenderArmy"]) === armyId &&
          obj["Defender"] === obj["Victor"])
    ).length;
  };

  const armyLost = (armyId) => {
    return battles.filter(
      (obj) =>
        ((Object.keys(obj).includes("Victor") &&
          Object.keys(obj).includes("AttackerArmy") &&
          obj["AttackerArmy"]) === armyId &&
          obj["Attacker"] !== obj["Victor"]) ||
        ((Object.keys(obj).includes("Victor") &&
          Object.keys(obj).includes("DefenderArmy") &&
          obj["DefenderArmy"]) === armyId &&
          obj["Defender"] !== obj["Victor"])
    ).length;
  };

  const addArmyPointsFor = (armyId) => {
    const armyAttackerBattles = battles.filter(
      (obj) =>
        (Object.keys(obj).includes("AttackerArmy") && obj["AttackerArmy"]) ===
        armyId
    );

    let armyAttackerTotal = 0;
    armyAttackerBattles.map(function (battle) {
      armyAttackerTotal += battle.TotalAttacker;
    });

    const armyDefenderBattles = battles.filter(
      (obj) =>
        (Object.keys(obj).includes("DefenderArmy") && obj["DefenderArmy"]) ===
        armyId
    );

    let armyDefenderTotal = 0;
    armyDefenderBattles.map(function (battle) {
      armyDefenderTotal += battle.TotalDefender;
    });

    return armyAttackerTotal + armyDefenderTotal;
  };

  const addArmyPointsAgainst = (armyId) => {
    const armyAttackerBattles = battles.filter(
      (obj) =>
        (Object.keys(obj).includes("AttackerArmy") && obj["AttackerArmy"]) ===
        armyId
    );

    let armyAttackerTotal = 0;
    armyAttackerBattles.map(function (battle) {
      armyAttackerTotal += battle.TotalDefender;
    });

    const armyDefenderBattles = battles.filter(
      (obj) =>
        (Object.keys(obj).includes("DefenderArmy") && obj["DefenderArmy"]) ===
        armyId
    );

    let armyDefenderTotal = 0;
    armyDefenderBattles.map(function (battle) {
      armyDefenderTotal += battle.TotalAttacker;
    });

    return armyAttackerTotal + armyDefenderTotal;
  };

  const armyFirstTurn = (armyId) => {
    return battles.filter(
      (obj) =>
        ((Object.keys(obj).includes("AttackerArmy") &&
          Object.keys(obj).includes("Attacker") &&
          Object.keys(obj).includes("FirstTurn") &&
          obj["AttackerArmy"]) === armyId &&
          obj["Attacker"] === obj["FirstTurn"]) ||
        ((Object.keys(obj).includes("DefenderArmy") &&
          Object.keys(obj).includes("Defender") &&
          Object.keys(obj).includes("FirstTurn") &&
          obj["DefenderArmy"]) === armyId &&
          obj["Defender"] === obj["FirstTurn"])
    ).length;
  };

  //Setup arraies of armies.
  let activeArmies: iArmySummary[] = new Array();
  let inactiveArmies: linkListItem[] = new Array();

  armyCollection.map((army) => {
    if (armyPlayed(army.id) > 0) {
      activeArmies.push({
        id: army.id,
        Name: army.Name,
        Emoji: army.Emoji,
        Played: armyPlayed(army.id),
        Won: armyWon(army.id),
        Lost: armyLost(army.id),
        AveragePoints: Math.round(
          ((addArmyPointsFor(army.id) / armyPlayed(army.id)) * 10) / 10
        ),
        TotalPoints: addArmyPointsFor(army.id),
        PointDifference:
          addArmyPointsFor(army.id) - addArmyPointsAgainst(army.id),
        WinPercentage:
          Math.round((armyWon(army.id) / armyPlayed(army.id)) * 1000) / 10,
        FirstTurnPercentage:
          Math.round((armyFirstTurn(army.id) / armyPlayed(army.id)) * 1000) /
          10,
      });
    } else {
      inactiveArmies.push({
        Title:
          army.Emoji !== undefined ? `${army.Emoji} ${army.Name}` : army.Name,
        Destination: `/army/${army.id}`,
      });
    }
  });

  return (
    <>
      {/* Active Armies */}
      <ArmiesTable
        title="Active Armies"
        armies={activeArmies}
        showCreateButton={true}
      />

      {/* Inactive Armies */}
      <LinkList title="Inactive Armies" list={inactiveArmies} />
    </>
  );
};

export default Armies;
