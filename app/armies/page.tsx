"use client";

import React from "react";
import ArmiesTable from "../components/armies-table";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import LinkList from "../components/link-list";

import { armySummary } from "../types/army";
import { linkListItem } from "../types/link-list-item";

const Armies = () => {
  // Retrieve army collection data.
  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc");

  const activeArmyCollection = armyCollection.filter((obj) =>
    Object.keys(obj).includes("Played")
  );
  const inactiveArmyCollection = armyCollection.filter(
    (obj) => !Object.keys(obj).includes("Played")
  );

  //Setup array of armies.
  let activeArmies: armySummary[] = new Array();
  activeArmyCollection.map((army) => {
    activeArmies.push({
      Id: army.id,
      Name: army.Name,
      Played: army.Played,
      Won: army.Won,
      Lost: army.Lost,
      AveragePoints:
        Math.round(
          ((army.PrimaryPointsFor + army.SecondaryPointsFor) / army.Played) * 10
        ) / 10,
      TotalPoints: army.PrimaryPointsFor + army.SecondaryPointsFor,
      PointDifference:
        army.PrimaryPointsFor +
        army.SecondaryPointsFor -
        army.PrimaryPointsAgainst -
        army.SecondaryPointsAgainst,
      WinPercentage: Math.round((army.Won / army.Played) * 1000) / 10,
      FirstTurnPercentage:
        Math.round((army.FirstTurn / army.Played) * 1000) / 10,
    });
  });

  let inactiveArmies: linkListItem[] = new Array();
  inactiveArmyCollection.map((army) => {
    inactiveArmies.push({
      Title: army.Name,
      Destination: `/army/${army.id}`,
    });
  });

  return (
    <>
      {/* Active Armies */}
      <ArmiesTable
        title="Active Armies"
        armies={activeArmies}
        showCreateButton={true}
      />

      {/* Inactive Armies */}
      <LinkList title="Inactive Armies" list={inactiveArmies} />
    </>
  );
};

export default Armies;
