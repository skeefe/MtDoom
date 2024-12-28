"use client";

import React from "react";
import GeneralsTable from "../components/generals-table";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";

import { iGeneralSummary } from "../types/general";
import { iBattleSummary } from "../types/battle";
import { linkListItem } from "../types/link-list-item";
import LinkList from "../components/link-list";

const Armies = () => {
  // Retrieve General collection data.
  const generalCollection = getCollectionSnapshot("Generals", "Alias", "asc");

  // Retrieve battle collection data.
  const battleCollection = getCollectionSnapshot("Battles");

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
      FirstTurn: battle.FirstTurn,
    });
  });

  const generalPlayed = (generalId) => {
    return battles.filter(
      (obj) =>
        (Object.keys(obj).includes("Attacker") && obj["Attacker"]) ===
          generalId ||
        (Object.keys(obj).includes("Defender") && obj["Defender"] === generalId)
    ).length;
  };

  const generalWon = (generalId) => {
    return battles.filter(
      (obj) =>
        ((Object.keys(obj).includes("Victor") &&
          Object.keys(obj).includes("Attacker") &&
          obj["Attacker"]) === generalId &&
          obj["Attacker"] === obj["Victor"]) ||
        ((Object.keys(obj).includes("Victor") &&
          Object.keys(obj).includes("Defender") &&
          obj["Defender"]) === generalId &&
          obj["Defender"] === obj["Victor"])
    ).length;
  };

  const generalLost = (generalId) => {
    return battles.filter(
      (obj) =>
        ((Object.keys(obj).includes("Victor") &&
          Object.keys(obj).includes("Attacker") &&
          obj["Attacker"]) === generalId &&
          obj["Attacker"] !== obj["Victor"]) ||
        ((Object.keys(obj).includes("Victor") &&
          Object.keys(obj).includes("Defender") &&
          obj["Defender"]) === generalId &&
          obj["Defender"] !== obj["Victor"])
    ).length;
  };

  const addGeneralPointsFor = (generalId) => {
    const generalAttackerBattles = battles.filter(
      (obj) =>
        (Object.keys(obj).includes("Attacker") && obj["Attacker"]) === generalId
    );

    let generalAttackerTotal = 0;
    generalAttackerBattles.map(function (battle) {
      generalAttackerTotal += battle.TotalAttacker;
    });

    const generalDefenderBattles = battles.filter(
      (obj) =>
        (Object.keys(obj).includes("Defender") && obj["Defender"]) === generalId
    );

    let generalDefenderTotal = 0;
    generalDefenderBattles.map(function (battle) {
      generalDefenderTotal += battle.TotalDefender;
    });

    return generalAttackerTotal + generalDefenderTotal;
  };

  const addGeneralPointsAgainst = (generalId) => {
    const generalAttackerBattles = battles.filter(
      (obj) =>
        (Object.keys(obj).includes("Attacker") && obj["Attacker"]) === generalId
    );

    let generalAttackerTotal = 0;
    generalAttackerBattles.map(function (battle) {
      generalAttackerTotal += battle.TotalDefender;
    });

    const generalDefenderBattles = battles.filter(
      (obj) =>
        (Object.keys(obj).includes("Defender") && obj["Defender"]) === generalId
    );

    let generalDefenderTotal = 0;
    generalDefenderBattles.map(function (battle) {
      generalDefenderTotal += battle.TotalAttacker;
    });

    return generalAttackerTotal + generalDefenderTotal;
  };

  const generalFirstTurn = (generalId) => {
    return battles.filter(
      (obj) =>
        ((Object.keys(obj).includes("Attacker") &&
          Object.keys(obj).includes("FirstTurn") &&
          obj["Attacker"]) === generalId &&
          obj["Attacker"] === obj["FirstTurn"]) ||
        ((Object.keys(obj).includes("Defender") &&
          Object.keys(obj).includes("FirstTurn") &&
          obj["Defender"]) === generalId &&
          obj["Defender"] === obj["FirstTurn"])
    ).length;
  };

  //Setup array of armies.
  let activeGenerals: iGeneralSummary[] = new Array();
  let inactiveGenerals: linkListItem[] = new Array();

  generalCollection.map((general) => {
    if (generalPlayed(general.id) > 0) {
      activeGenerals.push({
        id: general.id,
        //Name: general.Name,
        Alias: general.Alias,
        Emoji: general.Emoji,
        Played: generalPlayed(general.id),
        Won: generalWon(general.id),
        Lost: generalLost(general.id),
        AveragePoints: Math.round(
          ((addGeneralPointsFor(general.id) / generalPlayed(general.id)) * 10) /
            10
        ),
        TotalPoints: addGeneralPointsFor(general.id),
        PointDifference:
          addGeneralPointsFor(general.id) - addGeneralPointsAgainst(general.id),
        WinPercentage:
          Math.round(
            (generalWon(general.id) / generalPlayed(general.id)) * 1000
          ) / 10,
        FirstTurnPercentage:
          Math.round(
            (generalFirstTurn(general.id) / generalPlayed(general.id)) * 1000
          ) / 10,
      });
    } else {
      inactiveGenerals.push({
        Title:
          general.Emoji !== undefined
            ? `${general.Emoji} ${general.Alias}`
            : general.Alias,
        Destination: `/general/${general.id}`,
      });
    }
  });

  return (
    <>
      {/* Active Generals */}
      <GeneralsTable
        title="Generals"
        generals={activeGenerals}
        showCreateButton={false}
      />

      {/* Inactive Armies */}
      <LinkList title="Inactive Generals" list={inactiveGenerals} />
    </>
  );
};

export default Armies;
