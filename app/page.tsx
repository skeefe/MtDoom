"use client";

import React from "react";

import BattleTable from "./components/battle-table";
import getCollectionSnapshot from "./firebase/getCollectionSnapshot";
import { BattleSummary } from "./types/battle";

const HomePage = () => {
  // Retrieve battle collection data.
  const battleCollection = getCollectionSnapshot("Battles");

  //Setup array of battles.
  let battles: BattleSummary[] = new Array();
  battleCollection.map((battle) => {
    battles.push({
      Id: battle.id,
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
      IsAttackerVictor: battle.Victor === battle.Attacker,
      IsDefenderVictor: battle.Victor === battle.Defender,
      IsCompleted: battle.IsCompleted,
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
