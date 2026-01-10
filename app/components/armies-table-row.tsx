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
          {props.army.Emoji && `${props.army.Emoji} `}
          {props.army.Name}
        </td>
        <td className="text-center">{props.army.Played}</td>
        <td className="hide show-lg text-center">
          {props.army.FirstTurnPercentage}%
        </td>
        <td className="hide show-sm text-center">{props.army.Won}</td>
        <td className="hide show-sm text-center">{props.army.Lost}</td>
        <td className="hide show-md text-center">{props.army.AveragePoints}</td>
        <td className="hide show-lg text-center">{props.army.TotalPoints}</td>
        <td className="text-center text-center">
          {props.army.PointDifference}
        </td>
        <td className="text-center">{props.army.WinPercentage}%</td>
        <td className="hide show-lg text-center">
          {props.army.PreyName ? (
              <span title={props.army.PreyName} className="emoji">
                {props.army.PreyEmoji}
              </span>
          ) : ""}
        </td>
        <td className="hide show-lg text-center">
          {props.army.NemesisName ? (
              <span title={props.army.NemesisName} className="emoji">
                {props.army.NemesisEmoji}
              </span>
          ) : ""}
        </td>
      </tr>
    </>
  );
};

export default ArmiesTableRow;
