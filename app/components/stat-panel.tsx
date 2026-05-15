"use client";

import React, { useEffect, useState } from "react";
import { iBattle } from "../types/battle";
import { selectOption } from "../types/select-option";
import { iStatPanel } from "../types/stat-panel";
import SelectField from "./select-field";
import { propertyFromID } from "../../utils/property-from-id";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import getDocSnapshot from "../firebase/getDocSnapshot";
import RecentForm from "./recent-form";

const StatPanel = (props: {
  Item: string;
  Type: "Armies" | "Generals";
  Battles: iBattle[];
}) => {
  const [stats, setStats] = useState<iStatPanel>({
    id: "",
    Name: "",
    Played: 0,
    Won: 0,
    Lost: 0,
    Drawn: 0,
    AveragePoints: 0,
    AverageOpponentPoints: 0,
    TotalPoints: 0,
    PointDifference: 0,
    WinPercentage: 0,
    FirstTurnPercentage: 0,
  });

  const armiesCollection = getCollectionSnapshot("Armies", "Name", "asc");
  const generalsCollection = getCollectionSnapshot("Generals", "Alias", "asc");
  const itemData = getDocSnapshot(props.Type, props.Item);

  useEffect(() => {
    unfilteredStats();
  }, [itemData, props.Battles]);

  const getArmiesGenerals = () => {
    const Armies: selectOption[] = [];
    const Generals: selectOption[] = [];

    props.Battles.forEach((battle) => {
      const isAttacker =
        props.Type === "Armies"
          ? battle.AttackerArmy === props.Item
          : battle.Attacker === props.Item;

      Armies.push(
        isAttacker
          ? { Label: propertyFromID(armiesCollection, battle.DefenderArmy, "Name"), Value: `a-${battle.DefenderArmy}`, Active: true }
          : { Label: propertyFromID(armiesCollection, battle.AttackerArmy, "Name"), Value: `a-${battle.AttackerArmy}`, Active: true }
      );

      Generals.push(
        isAttacker
          ? { Label: propertyFromID(generalsCollection, battle.Defender, "Alias"), Value: `g-${battle.Defender}`, Active: true }
          : { Label: propertyFromID(generalsCollection, battle.Attacker, "Alias"), Value: `g-${battle.Attacker}`, Active: true }
      );
    });

    const ArmiesGenerals = [...Armies, ...Generals];
    return ArmiesGenerals.filter(
      (obj, index) => ArmiesGenerals.findIndex((item) => item.Value === obj.Value) === index
    );
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (value === "") return unfilteredStats();

    const type: "Army" | "General" = value.slice(0, 1) === "a" ? "Army" : "General";
    const opponentId = value.slice(2);

    const opponentBattleData: iBattle[] =
      type === "Army"
        ? props.Battles.filter((b) => b.AttackerArmy === opponentId || b.DefenderArmy === opponentId)
        : props.Battles.filter((b) => b.Attacker === opponentId || b.Defender === opponentId);

    let totalPointsFor = 0;
    let totalPointsAgainst = 0;
    let firstTurnTotal = 0;
    let totalWins = 0;
    let totalDraws = 0;

    opponentBattleData.forEach((battle) => {
      const isOpponentAttacker =
        type === "Army"
          ? battle.AttackerArmy === opponentId
          : battle.Attacker === opponentId;

      totalPointsFor += isOpponentAttacker ? battle.TotalDefender : battle.TotalAttacker;
      totalPointsAgainst += isOpponentAttacker ? battle.TotalAttacker : battle.TotalDefender;

      const opponentWentFirst = isOpponentAttacker
        ? battle.Attacker !== battle.FirstTurn
        : battle.Defender !== battle.FirstTurn;
      if (opponentWentFirst) firstTurnTotal++;

      if (battle.Victor === "DRAW") {
        totalDraws++;
      } else {
        const itemWon = isOpponentAttacker
          ? battle.Attacker !== battle.Victor
          : battle.Defender !== battle.Victor;
        if (itemWon) totalWins++;
      }
    });

    const opponentData: iStatPanel = {
      id: value,
      Name: type === "Army"
        ? propertyFromID(armiesCollection, opponentId, "Name")
        : propertyFromID(generalsCollection, opponentId, "Alias"),
      Played: opponentBattleData.length,
      Won: totalWins,
      Drawn: totalDraws,
      Lost: opponentBattleData.length - totalWins - totalDraws,
      AveragePoints: Math.round((totalPointsFor / opponentBattleData.length) * 10) / 10,
      AverageOpponentPoints: Math.round((totalPointsAgainst / opponentBattleData.length) * 10) / 10,
      TotalPoints: totalPointsFor,
      PointDifference: totalPointsFor - totalPointsAgainst,
      WinPercentage: Math.round(((totalWins + (totalDraws * 0.5)) / opponentBattleData.length) * 1000) / 10,
      FirstTurnPercentage: Math.round((firstTurnTotal / opponentBattleData.length) * 1000) / 10,
    };

    setStats((prev) => ({ ...prev, ...opponentData }));
  };

  // --- General Stats ---
  const generalPlayed = (id: string) =>
    props.Battles.filter((b) => b.Attacker === id || b.Defender === id).length;

  const generalWon = (id: string) =>
    props.Battles.filter((b) =>
      (b.Attacker === id && b.Attacker === b.Victor) ||
      (b.Defender === id && b.Defender === b.Victor)
    ).length;

  const generalLost = (id: string) =>
    props.Battles.filter((b) =>
      (b.Attacker === id && b.Attacker !== b.Victor && b.Victor !== "DRAW") ||
      (b.Defender === id && b.Defender !== b.Victor && b.Victor !== "DRAW")
    ).length;

  const generalDrawn = (id: string) =>
    props.Battles.filter((b) =>
      (b.Attacker === id || b.Defender === id) && b.Victor === "DRAW"
    ).length;

  const generalPointsFor = (id: string) => {
    let total = 0;
    props.Battles.filter((b) => b.Attacker === id).forEach((b) => total += b.TotalAttacker);
    props.Battles.filter((b) => b.Defender === id).forEach((b) => total += b.TotalDefender);
    return total;
  };

  const generalPointsAgainst = (id: string) => {
    let total = 0;
    props.Battles.filter((b) => b.Attacker === id).forEach((b) => total += b.TotalDefender);
    props.Battles.filter((b) => b.Defender === id).forEach((b) => total += b.TotalAttacker);
    return total;
  };

  const generalFirstTurn = (id: string) =>
    props.Battles.filter((b) =>
      (b.Attacker === id && b.Attacker === b.FirstTurn) ||
      (b.Defender === id && b.Defender === b.FirstTurn)
    ).length;

  // --- Army Stats ---
  const armyPlayed = (id: string) =>
    props.Battles.filter((b) => b.AttackerArmy === id || b.DefenderArmy === id).length;

  const armyWon = (id: string) =>
    props.Battles.filter((b) =>
      (b.AttackerArmy === id && b.Attacker === b.Victor) ||
      (b.DefenderArmy === id && b.Defender === b.Victor)
    ).length;

  const armyLost = (id: string) =>
    props.Battles.filter((b) =>
      (b.AttackerArmy === id && b.Attacker !== b.Victor && b.Victor !== "DRAW") ||
      (b.DefenderArmy === id && b.Defender !== b.Victor && b.Victor !== "DRAW")
    ).length;

  const armyDrawn = (id: string) =>
    props.Battles.filter((b) =>
      (b.AttackerArmy === id || b.DefenderArmy === id) && b.Victor === "DRAW"
    ).length;

  const armyPointsFor = (id: string) => {
    let total = 0;
    props.Battles.filter((b) => b.AttackerArmy === id).forEach((b) => total += b.TotalAttacker);
    props.Battles.filter((b) => b.DefenderArmy === id).forEach((b) => total += b.TotalDefender);
    return total;
  };

  const armyPointsAgainst = (id: string) => {
    let total = 0;
    props.Battles.filter((b) => b.AttackerArmy === id).forEach((b) => total += b.TotalDefender);
    props.Battles.filter((b) => b.DefenderArmy === id).forEach((b) => total += b.TotalAttacker);
    return total;
  };

  const armyFirstTurn = (id: string) =>
    props.Battles.filter((b) =>
      (b.AttackerArmy === id && b.Attacker === b.FirstTurn) ||
      (b.DefenderArmy === id && b.Defender === b.FirstTurn)
    ).length;

  const unfilteredStats = () => {
    const id = props.Item;
    let statData: iStatPanel;

    if (props.Type === "Generals") {
      const played = generalPlayed(id);
      const won = generalWon(id);
      const drawn = generalDrawn(id);
      const pFor = generalPointsFor(id);
      const pAgainst = generalPointsAgainst(id);

      statData = {
        id: "",
        Name: "",
        Played: played,
        Won: won,
        Lost: generalLost(id),
        Drawn: drawn,
        AveragePoints: Math.round((pFor / played) * 10) / 10,
        AverageOpponentPoints: Math.round((pAgainst / played) * 10) / 10,
        TotalPoints: pFor,
        PointDifference: pFor - pAgainst,
        WinPercentage: Math.round(((won + (drawn * 0.5)) / played) * 1000) / 10,
        FirstTurnPercentage: Math.round((generalFirstTurn(id) / played) * 1000) / 10,
      };
    } else {
      const played = armyPlayed(id);
      const won = armyWon(id);
      const drawn = armyDrawn(id);
      const pFor = armyPointsFor(id);
      const pAgainst = armyPointsAgainst(id);

      statData = {
        id: "",
        Name: "",
        Played: played,
        Won: won,
        Lost: armyLost(id),
        Drawn: drawn,
        AveragePoints: Math.round((pFor / played) * 10) / 10,
        AverageOpponentPoints: Math.round((pAgainst / played) * 10) / 10,
        TotalPoints: pFor,
        PointDifference: pFor - pAgainst,
        WinPercentage: Math.round(((won + (drawn * 0.5)) / played) * 1000) / 10,
        FirstTurnPercentage: Math.round((armyFirstTurn(id) / played) * 1000) / 10,
      };
    }

    setStats((prev) => ({ ...prev, ...statData }));
  };

  return (
    <section className="section">
      <header className="section-header">
        <h2>Key Stats</h2>
        <SelectField
          required={false}
          id="filterStats"
          name="FilterStats"
          changeFunction={handleChange}
          value={stats.id}
          options={getArmiesGenerals()}
          emptyValue="Show All"
        />
      </header>
      <ul className="stat-panel-list">
        <li>
          <span className="stat-label" title="Battles Played">Played</span>
          <span className="stat-value">{stats.Played}</span>
        </li>
        <li>
          <span className="stat-label" title="First Turn Percentage">First&nbsp;Turn&nbsp;%</span>
          <span className="stat-value">{stats.FirstTurnPercentage}%</span>
        </li>
        <li>
          <span className="stat-label" title="Average Points/Battle">Avg.&nbsp;Points</span>
          <span className="stat-value">{stats.AveragePoints}</span>
        </li>
        <li className="hide-sm show-lg-flex">
          <span className="stat-label" title="Average Opponent Points/Battle">Avg.&nbsp;Opp.&nbsp;Points</span>
          <span className="stat-value">{stats.AverageOpponentPoints}</span>
        </li>
        <li>
          <span className="stat-label" title="Total Points">Total&nbsp;Points</span>
          <span className="stat-value">{stats.TotalPoints}</span>
        </li>
        <li>
          <span className="stat-label" title="Points Difference">+/-</span>
          <span className="stat-value">{stats.PointDifference}</span>
        </li>
        <li>
          <span className="stat-label" title="Battles Won">Won</span>
          <span className="stat-value">{stats.Won}</span>
        </li>
        <li>
          <span className="stat-label" title="Battles Drawn">Drawn</span>
          <span className="stat-value">{stats.Drawn}</span>
        </li>
        <li>
          <span className="stat-label" title="Battles Lost">Lost</span>
          <span className="stat-value">{stats.Lost}</span>
        </li>
        <li>
          <span className="stat-label" title="Win Percentage">Win&nbsp;%</span>
          <span className="stat-value">{stats.WinPercentage}%</span>
        </li>
      </ul>

      <RecentForm
        Item={props.Item}
        Type={props.Type}
        Battles={props.Battles}
      />
    </section>
  );
};

export default StatPanel;