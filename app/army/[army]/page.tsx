"use client";

import React from "react";
import getDocSnapshot from "../../firebase/getDocSnapshot";
import ArmyDashboard from "../../components/army-dashboard";
import BattleTable from "../../components/battle-table";
import getCollectionSnapshot from "../../firebase/getCollectionSnapshot";
import Link from "next/link";
import Spinner from "../../components/spinner";
import StatPanel from "../../components/stat-panel";

export default function ArmyDetails({ params }: { params: { army: string } }) {
  const armyId = params.army;
  const armyDetails = getDocSnapshot("Armies", armyId);

  const battleCollection = getCollectionSnapshot("Battles");
  let armyBattleCollection = battleCollection.filter(function (battle) {
    return (
      battle.isCompleted &&
      (battle.AttackerArmy === armyId || battle.DefenderArmy === armyId)
    );
  });

  return armyDetails["Name"] ? (
    <>
      <header className="section-header">
        <h1>
          {armyDetails["Emoji"]} {armyDetails["Name"]}
        </h1>

        <Link
          href={`/army/${armyId}/edit`}
          className="button section-header-button"
        >
          Edit
        </Link>
      </header>

      <ArmyDashboard
        army={{
          id: armyId,
          Bio: armyDetails["Bio"],
          Colour: armyDetails["Colour"],
          Crest: armyDetails["Crest"],
          Emoji: armyDetails["Emoji"],
          FirstTurn: armyDetails["FirstTurn"],
          Lost: armyDetails["Lost"],
          Name: armyDetails["Name"],
          Played: armyDetails["Played"],
          PrimaryPointsAgainst: armyDetails["PrimaryPointsAgainst"],
          PrimaryPointsFor: armyDetails["PrimaryPointsFor"],
          SecondaryPointsAgainst: armyDetails["SecondaryPointsAgainst"],
          SecondaryPointsFor: armyDetails["SecondaryPointsFor"],
          Won: armyDetails["Won"],
        }}
        battles={armyBattleCollection}
      />

      <StatPanel Item={armyId} Type="Armies" Battles={armyBattleCollection} />

      <BattleTable
        title={`${armyDetails["Name"]}'s Battles`}
        battles={armyBattleCollection}
        showCreateButton={false}
      />
    </>
  ) : (
    <Spinner />
  );
}
