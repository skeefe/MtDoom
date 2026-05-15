"use client";

import { use } from 'react';
import getDocSnapshot from "../../firebase/getDocSnapshot";
import GeneralDashboard from "../../components/general-dashboard";
import BattleTable from "../../components/battle-table";
import getCollectionSnapshot from "../../firebase/getCollectionSnapshot";
import Link from "next/link";
import Spinner from "../../components/spinner";
import StatPanel from "../../components/stat-panel";
import EmptyState from "../../components/empty-state";
import { useEdition } from "../../context/EditionContext";

export default function GeneralDetails({
  params,
}: {
  params: Promise<{ general: string }>;
}) {
  const generalId = use(params).general;
  const { selectedEdition } = useEdition();
  const generalDetails = getDocSnapshot("Generals", generalId);

  const filterShow = (battle) => battle.Show !== false;

  const battleCollection = getCollectionSnapshot("Battles", "Date", "asc").filter(filterShow);

  const generalBattleCollection = battleCollection.filter((battle) =>
    battle.IsCompleted &&
    (battle.Attacker === generalId || battle.Defender === generalId)
  );

  const filteredBattles = generalBattleCollection.filter((b) =>
    selectedEdition === "all" || b.Edition === parseInt(selectedEdition)
  );

  if (!generalDetails["Alias"]) {
    return <Spinner />;
  }

  if (generalBattleCollection.length === 0) {
    return (
      <>
        <header className="section-header">
          <h1>
            {generalDetails["Emoji"]} {generalDetails["Alias"]}
          </h1>
          <Link href={`/general/${generalId}/edit`} className="button section-header-button">
            Edit
          </Link>
        </header>
        <EmptyState
          name={generalDetails["Alias"]}
          type="general"
          title="Deployment Pending"
          subtitle={
            <>
              <strong>{generalDetails["Alias"]}</strong> is currently overseeing logistics in the Segmentum Solar. No combat records found in the Administratum archives.
            </>
          }
        />
      </>
    );
  }

  return (
    <>
      <header className="section-header">
        <h1>
          {generalDetails["Emoji"]} {generalDetails["Alias"]}
        </h1>
        <Link href={`/general/${generalId}/edit`} className="button section-header-button">
          Edit
        </Link>
      </header>

      {filteredBattles.length > 0 && (
        <>
          <StatPanel
            Item={generalId}
            Type="Generals"
            Battles={filteredBattles}
          />

          <GeneralDashboard
            general={{
              id: generalId,
              Alias: generalDetails["Alias"],
              Bio: generalDetails["Bio"],
              Emoji: generalDetails["Emoji"],
              Name: generalDetails["Name"],
              Nicknames: generalDetails["Nicknames"],
            }}
            battles={filteredBattles}
          />
        </>
      )}

      <BattleTable
        title={`${generalDetails["Alias"]}'s Battles`}
        battles={generalBattleCollection}
        showCreateButton={false}
        selectedEdition={selectedEdition}
      />
    </>
  );
}