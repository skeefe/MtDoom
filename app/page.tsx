"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BattleTable from "./components/battle-table";
import getCollectionSnapshot from "./firebase/getCollectionSnapshot";
import { iBattleSummary } from "./types/battle";
import { createNewBattle } from "../utils/create-battle"; // Adjust path if needed
import Spinner from "./components/spinner";

const HomePage = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  // 1. Filter logic
  const filterShow = (battle: any) => battle.Show !== false;

  // 2. Data Retrieval
  const battleCollection = getCollectionSnapshot("Battles").filter(filterShow);

  // 3. Map with legacy fallback
  const battles: iBattleSummary[] = battleCollection.map((battle) => ({
    id: battle.id,
    Edition: battle.Edition || 10,
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

  // 4. Creation Handler with Spinner Control
  const handleCreateBattle = async () => {
    setIsCreating(true);
    try {
      await createNewBattle(router);
      // We don't set isCreating(false) here because we're navigating away
    } catch (error) {
      console.error("Creation failed:", error);
      setIsCreating(false);
      alert("Failed to create battle. Check console for logs.");
    }
  };

  // If we are mid-creation, show the spinner
  if (isCreating) return <Spinner />;

  return (
    <>
      <BattleTable
        title="Battle List"
        battles={battles}
        showCreateButton={true}
        onCreateClick={handleCreateBattle} // Pass the handler down
      />
    </>
  );
};

export default HomePage;