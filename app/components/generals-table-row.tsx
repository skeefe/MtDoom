import React from "react";
import rowClick from "../../utils/row-click";
import { useRouter } from "next/navigation";
import { iGeneralSummary } from "../types/general";

const GeneralsTableRow = (props: { general: iGeneralSummary }) => {
  const router = useRouter();

  return (
    <>
      <tr
        onClick={() => rowClick(router, `/general/${props.general.id}`)}
        className="clickable"
      >
        <td>
          {props.general.Emoji} {props.general.Alias}
        </td>
        <td className="text-center">{props.general.Played}</td>
        <td className="hide show-lg text-center">
          {props.general.FirstTurnPercentage}%
        </td>
        <td className="hide show-sm text-center">{props.general.Won}</td>
        <td className="hide show-sm text-center">{props.general.Lost}</td>
        <td className="hide show-md text-center">
          {props.general.AveragePoints}
        </td>
        <td className="hide show-lg text-center">
          {props.general.TotalPoints}
        </td>
        <td className="text-center text-center">
          {props.general.PointDifference}
        </td>
        <td className="text-center">{props.general.WinPercentage}%</td>
      </tr>
    </>
  );
};

export default GeneralsTableRow;
