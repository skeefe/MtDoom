"use client";

import { use } from 'react';
import getDocSnapshot from "../../firebase/getDocSnapshot";
import ArmyDashboard from "../../components/army-dashboard";
import BattleTable from "../../components/battle-table";
import getCollectionSnapshot from "../../firebase/getCollectionSnapshot";
import Link from "next/link";
import Spinner from "../../components/spinner";
import StatPanel from "../../components/stat-panel";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import firebase_app from "../../firebase/config";
import EmptyState from "../../components/empty-state";
import { useEdition } from "../../context/EditionContext";
import { iBattleSummary } from "../../types/battle";

export default function ArmyDetails({ params }: { params: Promise<{ army: string }> }) {
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const armyId = use(params).army;
  const { selectedEdition } = useEdition();
  const armyDetails = getDocSnapshot("Armies", armyId);

  const filterShow = (battle) => battle.Show !== false;

  const battleCollection = getCollectionSnapshot("Battles").filter(filterShow);
  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc");
  const generalCollection = getCollectionSnapshot("Generals", "Alias", "asc");
  const unitCollection = getCollectionSnapshot(`Armies/${armyId}/Units`, "Name", "asc");

  const armyBattleCollection = battleCollection.filter((battle) =>
    battle.IsCompleted &&
    (battle.AttackerArmy === armyId || battle.DefenderArmy === armyId)
  );

  const filteredBattles = armyBattleCollection.filter((b) =>
    selectedEdition === "all" || b.Edition === parseInt(selectedEdition)
  );

  const mappedBattles: iBattleSummary[] = armyBattleCollection.map((battle) => ({
    id: battle.id,
    Edition: battle.Edition,
    Date: battle.Date,
    PrimaryMission: battle.PrimaryMission,
    MissionRule: battle.MissionRule,
    Deployment: battle.Deployment,
    Size: battle.Size,
    Attacker: battle.Attacker,
    AttackerArmy: battle.AttackerArmy,
    AttackerPrimaryMission: battle.AttackerPrimaryMission,
    AttackerForceDisposition: battle.AttackerForceDisposition,
    TotalAttacker: battle.TotalAttacker,
    Defender: battle.Defender,
    DefenderArmy: battle.DefenderArmy,
    DefenderPrimaryMission: battle.DefenderPrimaryMission,
    DefenderForceDisposition: battle.DefenderForceDisposition,
    Layout: battle.Layout,
    TotalDefender: battle.TotalDefender,
    Victor: battle.Victor,
    IsCompleted: battle.IsCompleted,
    FirstTurn: battle.FirstTurn,
    Show: battle.Show,
  }));

  const handleArmyHide = (e) => {
    e.preventDefault();
    updateDoc(doc(db, "Armies", armyId), { ["Show"]: false })
      .then(() => console.log("Army hidden."))
      .catch((error) => console.log(error));
    router.push("/armies");
  };

  if (!armyDetails["Name"]) {
    return <Spinner />;
  }

  if (armyBattleCollection.length === 0) {
    return (
      <>
        <header className="section-header">
          <h1>
            {armyDetails["Emoji"]} {armyDetails["Name"]}
          </h1>
          <Link href={`/army/${armyId}/edit`} className="button section-header-button">
            Edit
          </Link>
        </header>
        <EmptyState
          name={armyDetails["Name"]}
          type="army"
          title="Mustering Forces"
          subtitle={
            <>
              <strong>{armyDetails["Name"]}</strong> are currently performing rites of battle. No combat records have been logged for this detachment.
            </>
          }
        />
        <div style={{ marginTop: '2rem' }}>
          <a className="a-delete" type="submit" onClick={(e) => handleArmyHide(e)}>
            Delete Army
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="section-header">
        <h1>
          {armyDetails["Emoji"]} {armyDetails["Name"]}
        </h1>
        <Link href={`/army/${armyId}/edit`} className="button section-header-button">
          Edit
        </Link>
      </header>

      {filteredBattles.length > 0 && (
        <>
          <StatPanel
            Item={armyId}
            Type="Armies"
            Battles={filteredBattles}
          />
          <ArmyDashboard
            army={{
              id: armyId,
              Bio: armyDetails["Bio"],
              Colour: armyDetails["Colour"],
              Crest: armyDetails["Crest"],
              Emoji: armyDetails["Emoji"],
              Name: armyDetails["Name"],
            }}
            battles={filteredBattles}
          />
        </>
      )}

      <BattleTable
        title={`${armyDetails["Name"]}'s Battles`}
        battles={mappedBattles}
        showCreateButton={false}
        selectedEdition={selectedEdition}
        armies={armyCollection}
        generals={generalCollection}
        excludeId={armyId}
      />

      <a className="a-delete" type="submit" onClick={(e) => handleArmyHide(e)}>
        Delete Army
      </a>
    </>
  );
}