"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BattleTable from "./components/battle-table";
import getCollectionSnapshot from "./firebase/getCollectionSnapshot";
import { iBattleSummary } from "./types/battle";
import { createNewBattle } from "../utils/create-battle";
import Spinner from "./components/spinner";
import { useEdition } from "./context/EditionContext";

const HomePage = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { selectedEdition } = useEdition();

  const filterShow = (battle: any) => battle.Show !== false;
  const battleCollection = getCollectionSnapshot("Battles").filter(filterShow);
  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc");
  const generalCollection = getCollectionSnapshot("Generals", "Alias", "asc");

  const battles: iBattleSummary[] = battleCollection.map((battle) => ({
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
    FirstTurn: battle.FirstTurn,
    Show: battle.Show,
  }));

  const handleCreateBattle = async () => {
    setIsCreating(true);
    try {
      await createNewBattle(router);
    } catch (error) {
      console.error("Creation failed:", error);
      setIsCreating(false);
      alert("Failed to create battle. Check console for logs.");
    }
  };

  if (isCreating) return <Spinner />;

  return (
    <>
      <BattleTable
        title="Battle List"
        battles={battles}
        showCreateButton={true}
        onCreateClick={handleCreateBattle}
        selectedEdition={selectedEdition}
        showFilter={true}
        showSearch={true}
        armies={armyCollection}
        generals={generalCollection}
      />
    </>
  );
};

export default HomePage;