"use client";

import React from "react";
import ArmiesTable from "../components/armies-table";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import LinkList from "../components/link-list";

import { iArmySummary } from "../types/army";
import { iBattleSummary } from "../types/battle";
import { linkListItem } from "../types/link-list-item";

const Armies = () => {
  // FIXED: Filter out both hidden battles AND incomplete drafts
  const filterShow = (item) => {
    return item.Show !== false && item.IsCompleted === true;
  };

  // Retrieve army collection data
  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc").filter(
    (a) => a.Show !== false
  );

  // Retrieve battle collection data
  const battleCollection = getCollectionSnapshot("Battles").filter(filterShow);

  // Setup array of battles
  let battles: iBattleSummary[] = new Array();
  battleCollection.forEach((battle) => {
    if (battle.AttackerArmy && battle.DefenderArmy) {
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
    }
  });

  // --- NEMESIS LOGIC (Updated to ignore Draws) ---
  const getNemesis = (armyId: string) => {
    const losses = battles.filter((b) => {
      const isAttacker = b.AttackerArmy === armyId;
      const isDefender = b.DefenderArmy === armyId;
      if (!isAttacker && !isDefender) return false;

      const wasAttackerAndLost = isAttacker && b.Victor === b.Defender && b.Victor !== "DRAW";
      const wasDefenderAndLost = isDefender && b.Victor === b.Attacker && b.Victor !== "DRAW";

      return wasAttackerAndLost || wasDefenderAndLost;
    });

    if (losses.length === 0) return { Name: "None", Emoji: "-", Count: 0 };

    const counts: Record<string, number> = {};
    losses.forEach((b) => {
      const opponentId = b.AttackerArmy === armyId ? b.DefenderArmy : b.AttackerArmy;
      if (opponentId) {
        counts[opponentId] = (counts[opponentId] || 0) + 1;
      }
    });

    const nemesisId = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
    const nemesisArmy = armyCollection.find((a) => a.id === nemesisId);

    return {
      Name: nemesisArmy?.Name || "Unknown",
      Emoji: nemesisArmy?.Emoji || "🥷",
      Count: counts[nemesisId],
    };
  };

  // --- PREY LOGIC ---
  const getPrey = (armyId: string) => {
    const wins = battles.filter((b) => {
      const isAttacker = b.AttackerArmy === armyId;
      const isDefender = b.DefenderArmy === armyId;
      if (!isAttacker && !isDefender) return false;

      const wasAttackerAndWon = isAttacker && b.Victor === b.Attacker;
      const wasDefenderAndWon = isDefender && b.Victor === b.Defender;

      return wasAttackerAndWon || wasDefenderAndWon;
    });

    if (wins.length === 0) return { Name: "None", Emoji: "-", Count: 0 };

    const counts: Record<string, number> = {};
    wins.forEach((b) => {
      const opponentId = b.AttackerArmy === armyId ? b.DefenderArmy : b.AttackerArmy;
      if (opponentId) {
        counts[opponentId] = (counts[opponentId] || 0) + 1;
      }
    });

    const preyId = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
    const preyArmy = armyCollection.find((a) => a.id === preyId);

    return {
      Name: preyArmy?.Name || "Unknown",
      Emoji: preyArmy?.Emoji || "🥷",
      Count: counts[preyId],
    };
  };

  const armyPlayed = (armyId) => battles.filter(b => b.AttackerArmy === armyId || b.DefenderArmy === armyId).length;

  const armyWon = (armyId) => battles.filter(b => 
    (b.AttackerArmy === armyId && b.Attacker === b.Victor) || 
    (b.DefenderArmy === armyId && b.Defender === b.Victor)
  ).length;

  // UPDATED: Excludes DRAW from loss count
  const armyLost = (armyId) => battles.filter(b => 
    (b.AttackerArmy === armyId && b.Victor !== "DRAW" && b.Attacker !== b.Victor) || 
    (b.DefenderArmy === armyId && b.Victor !== "DRAW" && b.Defender !== b.Victor)
  ).length;

  // NEW: Specifically counts DRAWs
  const armyDrawn = (armyId) => battles.filter(b => 
    (b.AttackerArmy === armyId || b.DefenderArmy === armyId) && b.Victor === "DRAW"
  ).length;

  const addArmyPointsFor = (armyId) => {
    const armyAttackerBattles = battles.filter((obj) => obj.AttackerArmy === armyId);
    let total = 0;
    armyAttackerBattles.forEach((b) => total += b.TotalAttacker);
    const armyDefenderBattles = battles.filter((obj) => obj.DefenderArmy === armyId);
    armyDefenderBattles.forEach((b) => total += b.TotalDefender);
    return total;
  };

  const addArmyPointsAgainst = (armyId) => {
    const armyAttackerBattles = battles.filter((obj) => obj.AttackerArmy === armyId);
    let total = 0;
    armyAttackerBattles.forEach((b) => total += b.TotalDefender);
    const armyDefenderBattles = battles.filter((obj) => obj.DefenderArmy === armyId);
    armyDefenderBattles.forEach((b) => total += b.TotalAttacker);
    return total;
  };

  const armyFirstTurn = (armyId) => {
    return battles.filter(
      (obj) =>
        (obj.AttackerArmy === armyId && obj.Attacker === obj.FirstTurn) ||
        (obj.DefenderArmy === armyId && obj.Defender === obj.FirstTurn)
    ).length;
  };

  let activeArmies: iArmySummary[] = new Array();
  let inactiveArmies: linkListItem[] = new Array();

  armyCollection.map((army) => {
    const played = armyPlayed(army.id);
    if (played > 0) {
      const nemesis = getNemesis(army.id); 
      const prey = getPrey(army.id); 
      const won = armyWon(army.id);
      const drawn = armyDrawn(army.id);

      activeArmies.push({
        id: army.id,
        Name: army.Name,
        Emoji: army.Emoji,
        Played: played,
        Won: won,
        Lost: armyLost(army.id),
        Drawn: drawn,
        AveragePoints: Math.round(((addArmyPointsFor(army.id) / played) * 10)) / 10,
        TotalPoints: addArmyPointsFor(army.id),
        PointDifference: addArmyPointsFor(army.id) - addArmyPointsAgainst(army.id),
        // FIXED: Tournament Win Rate Math
        WinPercentage: Math.round(((won + (drawn * 0.5)) / played) * 1000) / 10,
        FirstTurnPercentage: Math.round((armyFirstTurn(army.id) / played) * 1000) / 10,
        NemesisName: nemesis.Name,
        NemesisEmoji: nemesis.Emoji,
        NemesisCount: nemesis.Count,
        PreyName: prey.Name,
        PreyEmoji: prey.Emoji,
        PreyCount: prey.Count,
      });
    } else {
      inactiveArmies.push({
        Title: army.Emoji !== undefined ? `${army.Emoji} ${army.Name}` : army.Name,
        Destination: `/army/${army.id}`,
      });
    }
  });

  return (
    <>
      <ArmiesTable title="Active Armies" armies={activeArmies} showCreateButton={true} />
      <LinkList title="Inactive Armies" list={inactiveArmies} />
    </>
  );
};

export default Armies;