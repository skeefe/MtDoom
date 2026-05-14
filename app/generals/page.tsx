"use client";

import React from "react";
import GeneralsTable from "../components/generals-table";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import LinkList from "../components/link-list";
import { useEdition } from "../context/EditionContext";

import { iGeneralSummary } from "../types/general";
import { iBattleSummary } from "../types/battle";
import { linkListItem } from "../types/link-list-item";

const Generals = () => {
  const { selectedEdition } = useEdition();

  const generalCollection = getCollectionSnapshot("Generals", "Alias", "asc");

  const filterShow = (battle) => {
    return battle.Show !== false && battle.IsCompleted === true;
  };

  const battleCollection = getCollectionSnapshot("Battles").filter(filterShow);

  let battles: iBattleSummary[] = battleCollection
    .filter((battle) =>
      selectedEdition === "all" || battle.Edition === parseInt(selectedEdition)
    )
    .map((battle) => ({
      id: battle.id,
      Edition: battle.Edition,
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
    }));

  const generalPlayed = (generalId) => battles.filter(
    (obj) => obj.Attacker === generalId || obj.Defender === generalId
  ).length;

  const generalWon = (generalId) => battles.filter(
    (obj) =>
      (obj.Attacker === generalId && obj.Attacker === obj.Victor) ||
      (obj.Defender === generalId && obj.Defender === obj.Victor)
  ).length;

  const generalLost = (generalId) => battles.filter(
    (obj) =>
      (obj.Attacker === generalId && obj.Victor !== "DRAW" && obj.Attacker !== obj.Victor) ||
      (obj.Defender === generalId && obj.Victor !== "DRAW" && obj.Defender !== obj.Victor)
  ).length;

  const generalDrawn = (generalId) => battles.filter(
    (obj) =>
      (obj.Attacker === generalId || obj.Defender === generalId) &&
      obj.Victor === "DRAW"
  ).length;

  const addGeneralPointsFor = (generalId) => {
    let total = 0;
    battles.filter((obj) => obj.Attacker === generalId).forEach((b) => total += b.TotalAttacker);
    battles.filter((obj) => obj.Defender === generalId).forEach((b) => total += b.TotalDefender);
    return total;
  };

  const addGeneralPointsAgainst = (generalId) => {
    let total = 0;
    battles.filter((obj) => obj.Attacker === generalId).forEach((b) => total += b.TotalDefender);
    battles.filter((obj) => obj.Defender === generalId).forEach((b) => total += b.TotalAttacker);
    return total;
  };

  const generalFirstTurn = (generalId) => battles.filter(
    (obj) =>
      (obj.Attacker === generalId && obj.Attacker === obj.FirstTurn) ||
      (obj.Defender === generalId && obj.Defender === obj.FirstTurn)
  ).length;

  let activeGenerals: iGeneralSummary[] = [];
  let inactiveGenerals: linkListItem[] = [];

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
        WinPercentage: Math.round(((won + (drawn * 0.5)) / played) * 1000) / 10,
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
      <GeneralsTable title="Generals" generals={activeGenerals} showCreateButton={false} />
      <LinkList title="Inactive Generals" list={inactiveGenerals} />
    </>
  );
};

export default Generals;