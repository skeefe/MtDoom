"use client";

import React from "react";
import { iBattleSummary } from "../types/battle";
import { formatDate } from "../../utils/date-format";
import rowClick from "../../utils/row-click";
import { useRouter } from "next/navigation";
import getDocSnapshot from "../firebase/getDocSnapshot";

const BattleTableRow = (props: { battle: iBattleSummary }) => {
  const router = useRouter();

  // FIX: Handle null/pending dates during Firestore serverTimestamp sync
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
        armyDoc["Nicknames"][
          Math.floor(Math.random() * armyDoc["Nicknames"].length)
        ];
      return randomNickname;
    } else {
      return armyDoc["Alias"];
    }
  };

  const attackerArmy = getArmyTitle(props.battle.AttackerArmy);
  const defenderArmy = getArmyTitle(props.battle.DefenderArmy);

  const IsAttackerVictor: boolean =
    props.battle.Victor && props.battle.Victor === props.battle.Attacker
      ? true
      : false;

  const IsDefenderVictor: boolean =
    props.battle.Victor && props.battle.Victor === props.battle.Defender
      ? true
      : false;

  const IsDraw: boolean = props.battle.Victor === "DRAW";

  return (
    <>
      <tr
        onClick={() => rowClick(router, `/battle/${props.battle.id}`)}
        className="clickable"
      >
        <td>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Date Display */}
            <span className="hide-md" title={getDate.full}>
              {getDate.short}
            </span>
            <span className="hide show-md">{getDate.full}</span>
            
            {/* Edition Badge - Helpful for UAT and list scanning */}
            <small style={{ 
              fontSize: '0.7rem', 
              opacity: 0.7, 
              fontWeight: 'bold',
              color: props.battle.Edition === 11 ? '#00ffcc' : '#ff006e' 
            }}>
              {props.battle.Edition}TH ED
            </small>
          </div>
        </td>
        <td className="hide show-sm">
          <span className="cell-heading">{props.battle.PrimaryMission}</span>
          <span className="hide show-sm">
            Mission Rule: {props.battle.MissionRule}
          </span>
          <span className="hide show-sm">
            Deployment: {props.battle.Deployment}
          </span>
        </td>

        <td>
          <span className="cell-heading hide-md">
            {attackerArmy?.Name ? attackerArmy.Name : null}
            {IsAttackerVictor ? " 🎖" : IsDraw ? " 🤝" : null}
          </span>

          <span className="cell-heading hide show-md">
            {attackerArmy?.Emoji && `${attackerArmy.Emoji} `}
            {attackerArmy?.Name}
            {IsAttackerVictor ? " 🎖" : IsDraw ? " 🤝" : null}
          </span>
          <span className="hide show-sm">
            General:{" "}
            {props.battle.Attacker
              ? getGeneralNickname(props.battle.Attacker)
              : null}
          </span>
          <span className="hide show-sm">
            Total: {props.battle.TotalAttacker}
          </span>
        </td>
        <td>
          <span className="cell-heading hide-md">
            {defenderArmy?.Name ? defenderArmy.Name : null}
            {IsDefenderVictor ? " 🎖" : IsDraw ? " 🤝" : null}
          </span>
          <span className="cell-heading hide show-md">
            {defenderArmy?.Emoji && `${defenderArmy.Emoji} `}
            {defenderArmy?.Name}
            {IsDefenderVictor ? " 🎖" : IsDraw ? " 🤝" : null}
          </span>
          <span className="hide show-sm">
            General:{" "}
            {props.battle.Defender
              ? getGeneralNickname(props.battle.Defender)
              : null}
          </span>
          <span className="hide show-sm">
            Total: {props.battle.TotalDefender}
          </span>
        </td>
      </tr>
    </>
  );
};

export default BattleTableRow;