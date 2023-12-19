import React from "react";

const ChartTooltipRecord = (props: {
  OpponentArmy: string;
  Won: number;
  Lost: number;
}) => {
  return (
    <>
      <table className="chart-tooltip">
        <tbody>
          <tr>
            <td colSpan={2}>
              <strong>{props.OpponentArmy}</strong>
            </td>
          </tr>
          <tr className="highlight">
            <td>
              <strong>Won:</strong>
            </td>
            <td>{props.Won}</td>
          </tr>
          <tr>
            <td>
              <strong>Lost:</strong>
            </td>
            <td>{props.Lost}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default ChartTooltipRecord;
