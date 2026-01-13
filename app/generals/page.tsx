"use client";

import React from "react";
import GeneralsTable from "../components/generals-table";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";

import { iGeneralSummary } from "../types/general";
import { iBattleSummary } from "../types/battle";
import { linkListItem } from "../types/link-list-item";
import LinkList from "../components/link-list";

// Component name updated to Generals
const Generals = () => {
  const generalCollection = getCollectionSnapshot("Generals", "Alias", "asc");

  const filterShow = (battle) => {
    // Only count battles explicitly marked to show AND marked as finished
    return battle.Show !== false && battle.IsCompleted === true;
  };

  const battleCollection = getCollectionSnapshot("Battles").filter(filterShow);

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

  const generalPlayed = (generalId) => {
    return battles.filter(
      (obj) => obj.Attacker === generalId || obj.Defender === generalId
    ).length;
  };

  const generalWon = (generalId) => {
    return battles.filter(
      (obj) =>
        (obj.Attacker === generalId && obj.Attacker === obj.Victor) ||
        (obj.Defender === generalId && obj.Defender === obj.Victor)
    ).length;
  };

  const generalLost = (generalId) => {
    return battles.filter(
      (obj) =>
        (obj.Attacker === generalId && obj.Victor !== "DRAW" && obj.Attacker !== obj.Victor) ||
        (obj.Defender === generalId && obj.Victor !== "DRAW" && obj.Defender !== obj.Victor)
    ).length;
  };

  const generalDrawn = (generalId) => {
    return battles.filter(
      (obj) =>
        (obj.Attacker === generalId || obj.Defender === generalId) &&
        obj.Victor === "DRAW"
    ).length;
  };

  const addGeneralPointsFor = (generalId) => {
    const generalAttackerBattles = battles.filter((obj) => obj.Attacker === generalId);
    let generalAttackerTotal = 0;
    generalAttackerBattles.map((battle) => generalAttackerTotal += battle.TotalAttacker);

    const generalDefenderBattles = battles.filter((obj) => obj.Defender === generalId);
    let generalDefenderTotal = 0;
    generalDefenderBattles.map((battle) => generalDefenderTotal += battle.TotalDefender);

    return generalAttackerTotal + generalDefenderTotal;
  };

  const addGeneralPointsAgainst = (generalId) => {
    const generalAttackerBattles = battles.filter((obj) => obj.Attacker === generalId);
    let generalAttackerTotal = 0;
    generalAttackerBattles.map((battle) => generalAttackerTotal += battle.TotalDefender);

    const generalDefenderBattles = battles.filter((obj) => obj.Defender === generalId);
    let generalDefenderTotal = 0;
    generalDefenderBattles.map((battle) => generalDefenderTotal += battle.TotalAttacker);

    return generalAttackerTotal + generalDefenderTotal;
  };

  const generalFirstTurn = (generalId) => {
    return battles.filter(
      (obj) =>
        (obj.Attacker === generalId && obj.Attacker === obj.FirstTurn) ||
        (obj.Defender === generalId && obj.Defender === obj.FirstTurn)
    ).length;
  };

  let activeGenerals: iGeneralSummary[] = new Array();
  let inactiveGenerals: linkListItem[] = new Array();

  generalCollection.map((general) => {
    const played = generalPlayed(general.id);
    if (played > 0) {
      const won = generalWon(general.id);
      const drawn = generalDrawn(general.id);

      activeGenerals.push({
        id: general.id,
        Alias: general.Alias,
        Emoji: general.Emoji,
        Played: played,
        Won: won,
        Lost: generalLost(general.id),
        Drawn: drawn,
        AveragePoints: Math.round(((addGeneralPointsFor(general.id) / played) * 10)) / 10,
        TotalPoints: addGeneralPointsFor(general.id),
        PointDifference: addGeneralPointsFor(general.id) - addGeneralPointsAgainst(general.id),
        WinPercentage: Math.round(
          ((won + (drawn * 0.5)) / played) * 1000
        ) / 10,
        FirstTurnPercentage: Math.round((generalFirstTurn(general.id) / played) * 1000) / 10,
      });
    } else {
      inactiveGenerals.push({
        Title: general.Emoji !== undefined ? `${general.Emoji} ${general.Alias}` : general.Alias,
        Destination: `/general/${general.id}`,
      });
    }
  });

  return (
    <>
      <GeneralsTable
        title="Generals"
        generals={activeGenerals}
        showCreateButton={false}
      />
      <LinkList title="Inactive Generals" list={inactiveGenerals} />
    </>
  );
};

export default Generals;