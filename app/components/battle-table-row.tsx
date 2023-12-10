import React from "react";
import { battleSummary } from "../types/battle";
import { formatDate } from "../../utils/date-format";
import rowClick from "../../utils/row-click";
import { useRouter } from "next/navigation";
import getDocSnapshot from "../firebase/getDocSnapshot";

const BattleTableRow = (props: { battle: battleSummary }) => {
  const router = useRouter();

  const getArmyTitle = (armyId: string) => {
    const armyDoc = getDocSnapshot("Armies", armyId);
    if (armyDoc["Emoji"] !== undefined) {
      return `${armyDoc["Emoji"]} ${armyDoc["Name"]}`;
    } else {
      return armyDoc["Name"];
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

  return (
    <>
      <tr
        onClick={() => rowClick(router, `/battle/${props.battle.Id}`)}
        className="clickable"
      >
        <td>{formatDate(props.battle.Date.seconds)}</td>
        <td>
          <span className="cell-heading">{props.battle.PrimaryMission}</span>
          <span>Mission Rule: {props.battle.MissionRule}</span>
          <span>Deployment: {props.battle.Deployment}</span>
        </td>
        <td>
          <span className="cell-heading">
            {getArmyTitle(props.battle.AttackerArmy)}
            {props.battle.IsAttackerVictor ? " 🎖" : null}
          </span>
          <span>General: {getGeneralNickname(props.battle.Attacker)}</span>
          <span>Total: {props.battle.TotalAttacker}</span>
        </td>
        <td>
          <span className="cell-heading">
            {getArmyTitle(props.battle.DefenderArmy)}
            {props.battle.IsDefenderVictor ? " 🎖" : null}
          </span>
          <span>General: {getGeneralNickname(props.battle.Defender)}</span>
          <span>Total: {props.battle.TotalDefender}</span>
        </td>
      </tr>
    </>
  );
};

export default BattleTableRow;
