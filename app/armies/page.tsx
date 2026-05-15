"use client";

import React from "react";
import ArmiesTable from "../components/armies-table";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import LinkList from "../components/link-list";
import { useEdition } from "../context/EditionContext";
import Spinner from "../components/spinner";

import { iArmySummary } from "../types/army";
import { iBattleSummary } from "../types/battle";
import { linkListItem } from "../types/link-list-item";

const Armies = () => {
  const { selectedEdition } = useEdition();

  const filterShow = (item) => {
    return item.Show !== false && item.IsCompleted === true;
  };

  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc").filter(
    (a) => a.Show !== false
  );

  const battleCollection = getCollectionSnapshot("Battles").filter(filterShow);
  if (battleCollection.length === 0) return <Spinner />;

  let battles: iBattleSummary[] = battleCollection
    .filter((battle) =>
      selectedEdition === "all" || battle.Edition === parseInt(selectedEdition)
    )
    .filter((battle) => battle.AttackerArmy && battle.DefenderArmy)
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

  // --- NEMESIS LOGIC ---
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
      if (opponentId) counts[opponentId] = (counts[opponentId] || 0) + 1;
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
      if (opponentId) counts[opponentId] = (counts[opponentId] || 0) + 1;
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
  const armyLost = (armyId) => battles.filter(b =>
    (b.AttackerArmy === armyId && b.Victor !== "DRAW" && b.Attacker !== b.Victor) ||
    (b.DefenderArmy === armyId && b.Victor !== "DRAW" && b.Defender !== b.Victor)
  ).length;
  const armyDrawn = (armyId) => battles.filter(b =>
    (b.AttackerArmy === armyId || b.DefenderArmy === armyId) && b.Victor === "DRAW"
  ).length;

  const addArmyPointsFor = (armyId) => {
    let total = 0;
    battles.filter((obj) => obj.AttackerArmy === armyId).forEach((b) => total += b.TotalAttacker);
    battles.filter((obj) => obj.DefenderArmy === armyId).forEach((b) => total += b.TotalDefender);
    return total;
  };

  const addArmyPointsAgainst = (armyId) => {
    let total = 0;
    battles.filter((obj) => obj.AttackerArmy === armyId).forEach((b) => total += b.TotalDefender);
    battles.filter((obj) => obj.DefenderArmy === armyId).forEach((b) => total += b.TotalAttacker);
    return total;
  };

  const armyFirstTurn = (armyId) => battles.filter(
    (obj) =>
      (obj.AttackerArmy === armyId && obj.Attacker === obj.FirstTurn) ||
      (obj.DefenderArmy === armyId && obj.Defender === obj.FirstTurn)
  ).length;

  let activeArmies: iArmySummary[] = [];
  let inactiveArmies: linkListItem[] = [];

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