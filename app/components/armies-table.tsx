import React from "react";
import Link from "next/link";
import Spinner from "./spinner";
import ArmyTableRow from "./armies-table-row";
import { ArmySummary } from "../types/army";

const ArmiesTable = (props: {
  title: string;
  armies: ArmySummary[];
  showCreateButton: boolean;
}) => {
  return props.armies.length > 0 ? (
    <>
      <section className="section">
        <header className="section-header">
          <h2>{props.title}</h2>

          {props.showCreateButton ? (
            <Link href="/army/add" className="button section-header-button">
              Add Army
            </Link>
          ) : null}
        </header>

        <table className="primary-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Played</th>
              <th>Won</th>
              <th>Lost</th>
              <th>Avg. Points</th>
              <th>Total Points</th>
              <th>Points +/-</th>
              <th>Win %</th>
              <th>First Turn %</th>
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
