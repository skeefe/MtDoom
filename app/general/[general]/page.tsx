"use client";

import React from "react";
import getDocSnapshot from "../../firebase/getDocSnapshot";
import GeneralDashboard from "../../components/general-dashboard";
import BattleTable from "../../components/battle-table";
import getCollectionSnapshot from "../../firebase/getCollectionSnapshot";
import Link from "next/link";
import Spinner from "../../components/spinner";

export default function GeneralDetails({
  params,
}: {
  params: { general: string };
}) {
  const generalId = params.general;
  const generalDetails = getDocSnapshot("Generals", generalId);

  const battleCollection = getCollectionSnapshot("Battles");
  let generalBattleCollection = battleCollection.filter(function (battle) {
    return (
      battle.isCompleted &&
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
          FirstTurn: generalDetails["FirstTurn"],
          Lost: generalDetails["Lost"],
          Name: generalDetails["Name"],
          Played: generalDetails["Played"],
          PrimaryPointsAgainst: generalDetails["PrimaryPointsAgainst"],
          PrimaryPointsFor: generalDetails["PrimaryPointsFor"],
          SecondaryPointsAgainst: generalDetails["SecondaryPointsAgainst"],
          SecondaryPointsFor: generalDetails["SecondaryPointsFor"],
          Won: generalDetails["Won"],
          Nicknames: generalDetails["Nicknames"],
        }}
        battles={generalBattleCollection}
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
