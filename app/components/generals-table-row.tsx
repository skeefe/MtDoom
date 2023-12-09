import React from "react";
import rowClick from "../../utils/row-click";
import { useRouter } from "next/navigation";
import { generalSummary } from "../types/general";

const GeneralsTableRow = (props: { general: generalSummary }) => {
  const router = useRouter();

  return (
    <>
      <tr
        onClick={() => rowClick(router, `/general/${props.general.Id}`)}
        className="clickable"
      >
        <td>
          {props.general.Emoji} {props.general.Alias}
        </td>
        <td>{props.general.Played}</td>
        <td>{props.general.Won}</td>
        <td>{props.general.Lost}</td>
        <td>{props.general.AveragePoints}</td>
        <td>{props.general.TotalPoints}</td>
        <td>{props.general.PointDifference}</td>
        <td>{props.general.WinPercentage}%</td>
        <td>{props.general.FirstTurnPercentage}%</td>
      </tr>
    </>
  );
};

export default GeneralsTableRow;
