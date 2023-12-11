import React from "react";
import { iArmySummary } from "../types/army";
import rowClick from "../../utils/row-click";
import { useRouter } from "next/navigation";

const ArmiesTableRow = (props: { army: iArmySummary }) => {
  const router = useRouter();

  return (
    <>
      <tr
        onClick={() => rowClick(router, `/army/${props.army.id}`)}
        className="clickable"
      >
        <td>
          {props.army.Emoji} {props.army.Name}
        </td>
        <td>{props.army.Played}</td>
        <td>{props.army.Won}</td>
        <td>{props.army.Lost}</td>
        <td>{props.army.AveragePoints}</td>
        <td>{props.army.TotalPoints}</td>
        <td>{props.army.PointDifference}</td>
        <td>{props.army.WinPercentage}%</td>
        <td>{props.army.FirstTurnPercentage}%</td>
      </tr>
    </>
  );
};

export default ArmiesTableRow;
