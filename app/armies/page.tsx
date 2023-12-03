"use client";

import React from "react";
import ArmiesTable from "../components/armies-table";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import { ArmySummary } from "../types/army";

const Armies = () => {
  // Retrieve army collection data.
  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc");
  const activeArmyCollection = armyCollection.filter((obj) =>
    Object.keys(obj).includes("Played")
  );

  //Setup array of armies.
  let armies: ArmySummary[] = new Array();
  activeArmyCollection.map((army) => {
    armies.push({
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

  return (
    <>
      <ArmiesTable title="Armies" armies={armies} showCreateButton={true} />
    </>
  );
};

export default Armies;
