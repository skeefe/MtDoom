import React, { useState } from "react";
import Link from "next/link";
import Spinner from "./spinner";
import GeneralsTableRow from "./generals-table-row";
import { iGeneralSummary } from "../types/general";

const GeneralsTable = (props: {
  title: string;
  generals: iGeneralSummary[];
  showCreateButton: boolean;
}) => {
  const [sortColumn, setSortColumn] = useState<string>("Alias");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortedGenerals = () => {
    const sorted = [...props.generals].sort((a, b) => {
      let aValue = a[sortColumn as keyof iGeneralSummary];
      let bValue = b[sortColumn as keyof iGeneralSummary];

      // Handle undefined/null values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Convert to string for comparison if needed
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

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
              <th className="sort-title" onClick={() => handleSort("Alias")}>
                Name {sortColumn === "Alias" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="text-center sort-title" onClick={() => handleSort("Played")}>
                Played {sortColumn === "Played" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="hide show-lg text-center sort-title" onClick={() => handleSort("FirstTurnPercentage")}>
                First Turn&nbsp;% {sortColumn === "FirstTurnPercentage" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="hide show-sm text-center sort-title" onClick={() => handleSort("Won")}>
                Won {sortColumn === "Won" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="hide show-sm text-center sort-title" onClick={() => handleSort("Lost")}>
                Lost {sortColumn === "Lost" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="hide show-md text-center sort-title" onClick={() => handleSort("AveragePoints")}>
                Avg. Points {sortColumn === "AveragePoints" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="hide show-lg text-center sort-title" onClick={() => handleSort("TotalPoints")}>
                Total Points {sortColumn === "TotalPoints" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="text-center sort-title" title="Points +/-" onClick={() => handleSort("PointDifference")}>
                <span className="hide show-md-inline">Points&nbsp;</span>+/- {sortColumn === "PointDifference" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="text-center sort-title" onClick={() => handleSort("WinPercentage")}>
                Win&nbsp;% {sortColumn === "WinPercentage" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>

          <tbody>
            {getSortedGenerals().map((general, index) => (
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
