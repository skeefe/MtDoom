import React from "react";

const ChartTooltipPoints = (props: {
  Date: string;
  Army: string;
  ArmyScore: number;
  OpponentArmy: string;
  OpponentArmyScore: number;
}) => {
  return (
    <>
      <table className="chart-tooltip">
        <tr>
          <td colSpan={2}>
            <strong>{props.Date}</strong>
          </td>
        </tr>
        <tr className="highlight">
          <td>
            <strong>{props.Army}:</strong>
          </td>
          <td>{props.ArmyScore}</td>
        </tr>
        <tr>
          <td>
            <strong>{props.OpponentArmy}:</strong>
          </td>
          <td>{props.OpponentArmyScore}</td>
        </tr>
      </table>
    </>
  );
};

export default ChartTooltipPoints;
