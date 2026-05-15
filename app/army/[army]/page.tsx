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

export default function ArmyDetails({ params }: { params: Promise<{ army: string }> }) {
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const armyId = use(params).army;
  const { selectedEdition } = useEdition();
  const armyDetails = getDocSnapshot("Armies", armyId);

  const filterShow = (battle) => battle.Show !== false;

  const battleCollection = getCollectionSnapshot("Battles").filter(filterShow);

  const armyBattleCollection = battleCollection.filter((battle) =>
    battle.IsCompleted &&
    (battle.AttackerArmy === armyId || battle.DefenderArmy === armyId)
  );

  const filteredBattles = armyBattleCollection.filter((b) =>
    selectedEdition === "all" || b.Edition === parseInt(selectedEdition)
  );

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
        battles={armyBattleCollection}
        showCreateButton={false}
        selectedEdition={selectedEdition}
      />

      <a className="a-delete" type="submit" onClick={(e) => handleArmyHide(e)}>
        Delete Army
      </a>
    </>
  );
}