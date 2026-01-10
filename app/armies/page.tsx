"use client";

import React from "react";
import ArmiesTable from "../components/armies-table";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import LinkList from "../components/link-list";

import { iArmySummary } from "../types/army";
import { iBattleSummary } from "../types/battle";
import { linkListItem } from "../types/link-list-item";

const Armies = () => {
  // Required to remove any "Show=FALSE" battles.
  const filterShow = (item) => {
    return item.Show !== false;
  };

  // Retrieve army collection data.
  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc").filter(
    filterShow
  );

  // Retrieve battle collection data.
  const battleCollection = getCollectionSnapshot("Battles").filter(filterShow);

  // Setup array of battles.
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

  // --- NEW NEMESIS LOGIC START ---
  const getNemesis = (armyId: string) => {
    // 1. Find all battles this army lost
    const losses = battles.filter((b) => {
      const isAttacker = b.AttackerArmy === armyId;
      const isDefender = b.DefenderArmy === armyId;
      if (!isAttacker && !isDefender) return false;

      // It's a loss if they were the attacker but the defender won, or vice versa
      const wasAttackerAndLost = isAttacker && b.Victor === b.Defender && b.Victor !== undefined;
      const wasDefenderAndLost = isDefender && b.Victor === b.Attacker && b.Victor !== undefined;

      return wasAttackerAndLost || wasDefenderAndLost;
    });

    if (losses.length === 0) return { Name: "None", Emoji: "-" };

    // 2. Count which opponent army ID appears most in those losses
    const counts: Record<string, number> = {};
    losses.forEach((b) => {
      const opponentId = b.AttackerArmy === armyId ? b.DefenderArmy : b.AttackerArmy;
      if (opponentId) {
        counts[opponentId] = (counts[opponentId] || 0) + 1;
      }
    });

    // 3. Find the ID with the max count
    const nemesisId = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));

    // 4. Look up the name/emoji from the armyCollection
    const nemesisArmy = armyCollection.find((a) => a.id === nemesisId);

    return {
      Name: nemesisArmy?.Name || "Unknown",
      Emoji: nemesisArmy?.Emoji || "💀",
    };
  };
  // --- NEW NEMESIS LOGIC END ---

  // --- NEW PREY LOGIC START ---
  const getPrey = (armyId: string) => {
    // 1. Find all battles this army WON
    const wins = battles.filter((b) => {
      const isAttacker = b.AttackerArmy === armyId;
      const isDefender = b.DefenderArmy === armyId;
      if (!isAttacker && !isDefender) return false;

      // It's a win if they were the attacker and won, or defender and won
      const wasAttackerAndWon = isAttacker && b.Victor === b.Attacker && b.Victor !== undefined;
      const wasDefenderAndWon = isDefender && b.Victor === b.Defender && b.Victor !== undefined;

      return wasAttackerAndWon || wasDefenderAndWon;
    });

    if (wins.length === 0) return { Name: "None", Emoji: "-" };

    // 2. Count which opponent army ID appears most in those wins
    const counts: Record<string, number> = {};
    wins.forEach((b) => {
      const opponentId = b.AttackerArmy === armyId ? b.DefenderArmy : b.AttackerArmy;
      if (opponentId) {
        counts[opponentId] = (counts[opponentId] || 0) + 1;
      }
    });

    // 3. Find the ID with the max count
    const preyId = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));

    // 4. Look up the name/emoji from the armyCollection
    const preyArmy = armyCollection.find((a) => a.id === preyId);

    return {
      Name: preyArmy?.Name || "Unknown",
      Emoji: preyArmy?.Emoji || "🎯",
    };
  };
  // --- NEW PREY LOGIC END ---

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

  // Setup arrays of armies.
  let activeArmies: iArmySummary[] = new Array();
  let inactiveArmies: linkListItem[] = new Array();

  armyCollection.map((army) => {
    if (armyPlayed(army.id) > 0) {
      const nemesis = getNemesis(army.id); // Calculate nemesis for this army
      const prey = getPrey(army.id); // Calculate prey for this army

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
        // Add Nemesis data here
        NemesisName: nemesis.Name,
        NemesisEmoji: nemesis.Emoji,
        PreyName: prey.Name,
        PreyEmoji: prey.Emoji,
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