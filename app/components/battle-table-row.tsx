import React from "react";
import { BattleSummary } from "../types/battle";
import { formatDate } from "../../utils/date-format";
import getArmyName from "../firebase/getArmyName";
import rowClick from "../../utils/row-click";
import { useRouter } from "next/navigation";

const BattleTableRow = (props: { battle: BattleSummary }) => {
  const router = useRouter();

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
            {getArmyName(props.battle.AttackerArmy)}
            {props.battle.IsAttackerVictor ? " 🎖" : null}
          </span>
          <span>General: {props.battle.Attacker}</span>
          <span>Total: {props.battle.TotalAttacker}</span>
        </td>
        <td>
          <span className="cell-heading">
            {getArmyName(props.battle.DefenderArmy)}
            {props.battle.IsDefenderVictor ? " 🎖" : null}
          </span>
          <span>General: {props.battle.Defender}</span>
          <span>Total: {props.battle.TotalDefender}</span>
        </td>
      </tr>
    </>
  );
};

export default BattleTableRow;
