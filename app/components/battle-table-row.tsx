"use client";

import React from "react";
import { iBattleSummary } from "../types/battle";
import { formatDate } from "../../utils/date-format";
import rowClick from "../../utils/row-click";
import { useRouter } from "next/navigation";
import getDocSnapshot from "../firebase/getDocSnapshot";

const BattleTableRow = (props: { battle: iBattleSummary }) => {
  const router = useRouter();

  const seconds = props.battle.Date?.seconds;
  const getDate = seconds ? formatDate(seconds) : { short: "New", full: "Pending sync..." };

  const getArmyTitle = (armyId?: string) => {
    if (armyId) {
      const armyDoc = getDocSnapshot("Armies", armyId);
      return { Name: armyDoc["Name"], Emoji: armyDoc["Emoji"] };
    } else {
      return null;
    }
  };

  const getGeneralNickname = (generalId: string) => {
    const armyDoc = getDocSnapshot("Generals", generalId);
    if (armyDoc["Nicknames"] !== undefined && armyDoc["Nicknames"].length > 0) {
      const randomNickname =
        armyDoc["Nicknames"][Math.floor(Math.random() * armyDoc["Nicknames"].length)];
      return randomNickname;
    } else {
      return armyDoc["Alias"];
    }
  };

  const attackerArmy = getArmyTitle(props.battle.AttackerArmy);
  const defenderArmy = getArmyTitle(props.battle.DefenderArmy);

  const IsAttackerVictor: boolean =
    props.battle.Victor && props.battle.Victor === props.battle.Attacker ? true : false;
  const IsDefenderVictor: boolean =
    props.battle.Victor && props.battle.Victor === props.battle.Defender ? true : false;
  const IsDraw: boolean = props.battle.Victor === "DRAW";

  const isArmageddon = props.battle.Edition === 11;

  return (
    <>
      <tr
        onClick={() => rowClick(router, `/battle/${props.battle.id}`)}
        className="clickable"
      >
        {/* Date column */}
        <td>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span className="hide-md" title={getDate.full}>{getDate.short}</span>
            <span className="hide show-md">{getDate.full}</span>
            <small style={{
              fontSize: "0.7rem",
              fontWeight: "bold",
              color: props.battle.Edition === 11 ? "#00ffcc" : "#ff006e",
            }}>
              {props.battle.Edition}TH ED
            </small>
          </div>
        </td>

        {/* Setup column */}
        <td className="hide show-sm">
          {isArmageddon ? (
            <>
              <span className="cell-heading">{props.battle.Deployment}</span>
              {props.battle.Layout && <span className="hide show-sm">{props.battle.Layout}</span>}
              {props.battle.Size && <span className="hide show-sm">Size: {props.battle.Size}</span>}
            </>
          ) : (
            <>
              <span className="cell-heading">{props.battle.PrimaryMission}</span>
              {props.battle.MissionRule && <span className="hide show-sm">Mission Rule: {props.battle.MissionRule}</span>}
              <span className="hide show-sm">Deployment: {props.battle.Deployment}</span>
              {props.battle.Size && <span className="hide show-sm">Size: {props.battle.Size}</span>}
            </>
          )}
        </td>

        {/* Attacker */}
        <td>
          <span className="cell-heading hide-md">
            {attackerArmy?.Name ?? null}
            {IsAttackerVictor ? " 🎖" : IsDraw ? " 🤝" : null}
          </span>
          <span className="cell-heading hide show-md">
            {attackerArmy?.Emoji && `${attackerArmy.Emoji} `}
            {attackerArmy?.Name}
            {IsAttackerVictor ? " 🎖" : IsDraw ? " 🤝" : null}
          </span>
          <span className="hide show-sm">
            General: {props.battle.Attacker ? getGeneralNickname(props.battle.Attacker) : null}
          </span>
          {isArmageddon && props.battle.AttackerForceDisposition && (
            <span className="hide show-sm">Disposition: {props.battle.AttackerForceDisposition}</span>
          )}
          <span className="hide show-sm"><strong>Total:</strong> {props.battle.TotalAttacker}</span>
        </td>

        {/* Defender */}
        <td>
          <span className="cell-heading hide-md">
            {defenderArmy?.Name ?? null}
            {IsDefenderVictor ? " 🎖" : IsDraw ? " 🤝" : null}
          </span>
          <span className="cell-heading hide show-md">
            {defenderArmy?.Emoji && `${defenderArmy.Emoji} `}
            {defenderArmy?.Name}
            {IsDefenderVictor ? " 🎖" : IsDraw ? " 🤝" : null}
          </span>
          <span className="hide show-sm">
            General: {props.battle.Defender ? getGeneralNickname(props.battle.Defender) : null}
          </span>
          {isArmageddon && props.battle.DefenderForceDisposition && (
            <span className="hide show-sm">Disposition: {props.battle.DefenderForceDisposition}</span>
          )}
          <span className="hide show-sm"><strong>Total:</strong> {props.battle.TotalDefender}</span>
        </td>
      </tr>
    </>
  );
};

export default BattleTableRow;