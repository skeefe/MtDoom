"use client";

import { use } from 'react';
import getDocSnapshot from "../../firebase/getDocSnapshot";
import GeneralDashboard from "../../components/general-dashboard";
import BattleTable from "../../components/battle-table";
import getCollectionSnapshot from "../../firebase/getCollectionSnapshot";
import Link from "next/link";
import Spinner from "../../components/spinner";
import StatPanel from "../../components/stat-panel";

export default function GeneralDetails({
  params,
}: {
  params: Promise<{ general: string }>;
}) {
  const generalId = use(params).general;
  const generalDetails = getDocSnapshot("Generals", generalId);

  //Required to remove any "Show=FALSE" battles.
  const filterShow = (battle) => {
    return battle.Show !== false;
  };

  const battleCollection = getCollectionSnapshot(
    "Battles",
    "Date",
    "asc"
  ).filter(filterShow);
  let generalBattleCollection = battleCollection.filter(function (battle) {
    return (
      battle.IsCompleted &&
      (battle.Attacker === generalId || battle.Defender === generalId)
    );
  });

  return generalDetails["Alias"] ? (
    <>
      <header className="section-header">
        <h1>
          {generalDetails["Emoji"]} {generalDetails["Alias"]}
        </h1>

        <Link
          href={`/general/${generalId}/edit`}
          className="button section-header-button"
        >
          Edit
        </Link>
      </header>

      <GeneralDashboard
        general={{
          id: generalId,
          Alias: generalDetails["Alias"],
          Bio: generalDetails["Bio"],
          Emoji: generalDetails["Emoji"],
          Name: generalDetails["Name"],
          Nicknames: generalDetails["Nicknames"],
        }}
        battles={generalBattleCollection}
      />

      <StatPanel
        Item={generalId}
        Type="Generals"
        Battles={generalBattleCollection}
      />

      <BattleTable
        title={`${generalDetails["Alias"]}'s Battles`}
        battles={generalBattleCollection}
        showCreateButton={false}
      />
    </>
  ) : (
    <Spinner />
  );
}
