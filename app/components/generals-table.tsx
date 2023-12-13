import React from "react";
import Link from "next/link";
import Spinner from "./spinner";
import GeneralsTableRow from "./generals-table-row";
import { iGeneralSummary } from "../types/general";

const GeneralsTable = (props: {
  title: string;
  generals: iGeneralSummary[];
  showCreateButton: boolean;
}) => {
  return props.generals.length > 0 ? (
    <>
      <section className="section">
        <header className="section-header">
          <h2>{props.title}</h2>

          {props.showCreateButton ? (
            <Link href="/army/add" className="button section-header-button">
              Add<span className="hide show-sm-inline"> General</span>
            </Link>
          ) : null}
        </header>

        <table className="primary-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="text-center">Played</th>
              <th className="hide show-lg text-center">First Turn&nbsp;%</th>
              <th className="hide show-sm text-center">Won</th>
              <th className="hide show-sm text-center">Lost</th>
              <th className="hide show-md text-center">Avg. Points</th>
              <th className="hide show-lg text-center">Total Points</th>
              <th className="text-center" title="Points +/-">
                <span className="hide show-md-inline">Points&nbsp;</span>+/-
              </th>
              <th className="text-center">Win&nbsp;%</th>
            </tr>
          </thead>

          <tbody>
            {props.generals.map((general, index) => (
              <GeneralsTableRow general={general} key={index} />
            ))}
          </tbody>
        </table>
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default GeneralsTable;
