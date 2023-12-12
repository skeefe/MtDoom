"use client";

import React from "react";
import GeneralsTable from "../components/generals-table";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";

import { iGeneralSummary } from "../types/general";

const Armies = () => {
  // Retrieve army collection data.
  const generalCollection = getCollectionSnapshot("Generals", "Alias", "asc");

  const activeGeneralCollection = generalCollection.filter(
    (obj) => Object.keys(obj).includes("Played") && obj["Played"] > 0
  );

  //Setup array of armies.
  let activeGenerals: iGeneralSummary[] = new Array();
  activeGeneralCollection.map((general) => {
    activeGenerals.push({
      id: general.id,
      //Name: general.Name,
      Alias: general.Alias,
      Emoji: general.Emoji,
      Played: general.Played,
      Won: general.Won,
      Lost: general.Lost,
      AveragePoints:
        Math.round(
          ((general.PrimaryPointsFor + general.SecondaryPointsFor) /
            general.Played) *
            10
        ) / 10,
      TotalPoints: general.PrimaryPointsFor + general.SecondaryPointsFor,
      PointDifference:
        general.PrimaryPointsFor +
        general.SecondaryPointsFor -
        general.PrimaryPointsAgainst -
        general.SecondaryPointsAgainst,
      WinPercentage: Math.round((general.Won / general.Played) * 1000) / 10,
      FirstTurnPercentage:
        Math.round((general.FirstTurn / general.Played) * 1000) / 10,
    });
  });

  return (
    <>
      {/* Active Generals */}
      <GeneralsTable
        title="Generals"
        generals={activeGenerals}
        showCreateButton={false}
      />
    </>
  );
};

export default Armies;
