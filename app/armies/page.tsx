"use client";

import React from "react";
import ArmiesTable from "../components/armies-table";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import LinkList from "../components/link-list";

import { iArmySummary } from "../types/army";
import { linkListItem } from "../types/link-list-item";

const Armies = () => {
  // Retrieve army collection data.
  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc");

  const activeArmyCollection = armyCollection.filter(
    (obj) => Object.keys(obj).includes("Played") && obj["Played"] > 0
  );
  const inactiveArmyCollection = armyCollection.filter(
    (obj) => !Object.keys(obj).includes("Played") || obj["Played"] === 0
  );

  //Setup array of armies.
  let activeArmies: iArmySummary[] = new Array();
  activeArmyCollection.map((army) => {
    activeArmies.push({
      id: army.id,
      Name: army.Name,
      Emoji: army.Emoji,
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
    const title: string =
      army.Emoji !== undefined ? `${army.Emoji} ${army.Name}` : army.Name;

    inactiveArmies.push({
      Title: title, //`${army.Emoji !== undefined && army.Emoji} ${army.Name}`,
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
