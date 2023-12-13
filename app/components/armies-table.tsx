import React from "react";
import Link from "next/link";
import Spinner from "./spinner";
import ArmyTableRow from "./armies-table-row";
import { iArmySummary } from "../types/army";

const ArmiesTable = (props: {
  title: string;
  armies: iArmySummary[];
  showCreateButton: boolean;
}) => {
  return props.armies.length > 0 ? (
    <>
      <section className="section">
        <header className="section-header">
          <h2>{props.title}</h2>

          {props.showCreateButton && (
            <Link href="/army/add" className="button section-header-button">
              Add Army
            </Link>
          )}
        </header>

        <table className="primary-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Played</th>
              <th className="hide show-lg">First Turn&nbsp;%</th>
              <th className="hide show-sm">Won</th>
              <th className="hide show-sm">Lost</th>
              <th className="hide show-md">Avg. Points</th>
              <th className="hide show-lg">Total Points</th>
              <th title="Points +/-">
                <span className="hide show-md-inline">Points&nbsp;</span>+/-
              </th>
              <th>Win&nbsp;%</th>
            </tr>
          </thead>

          <tbody>
            {props.armies.map((army, index) => (
              <ArmyTableRow army={army} key={index} />
            ))}
          </tbody>
        </table>
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default ArmiesTable;
