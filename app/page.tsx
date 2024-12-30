"use client";

import React from "react";

import BattleTable from "./components/battle-table";
import getCollectionSnapshot from "./firebase/getCollectionSnapshot";
import { iBattleSummary } from "./types/battle";

const HomePage = () => {
  //Required to remove any "Show=FALSE" battles.
  const filterShow = (battle) => {
    return battle.Show !== false;
  };

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
      FirstTurn: battle.FirstTurn,
      Show: battle.Show,
    });
  });

  return (
    <>
      <BattleTable
        title="Battle List"
        battles={battles}
        showCreateButton={true}
      />
    </>
  );
};

export default HomePage;
