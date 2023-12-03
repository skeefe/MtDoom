import React from "react";
import { ArmySummary } from "../types/army";
import rowClick from "../../utils/row-click";
import { useRouter } from "next/navigation";

const ArmyTableRow = (props: { army: ArmySummary }) => {
  const router = useRouter();

  return (
    <>
      <tr
        onClick={() => rowClick(router, `/army/${props.army.Id}`)}
        className="clickable"
      >
        <td>{props.army.Name}</td>
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

export default ArmyTableRow;
