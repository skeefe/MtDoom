import React, { useState } from "react";
import Link from "next/link";
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
    return [...props.generals].sort((a, b) => {
      let aValue = a[sortColumn as keyof iGeneralSummary];
      let bValue = b[sortColumn as keyof iGeneralSummary];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const getArrowIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? "▲" : "▼";
    }
    return "↕";
  };

  // Empty state
  if (props.generals.length === 0) {
    return (
      <section className="section">
        <header className="section-header">
          <h2>{props.title}</h2>
          {props.showCreateButton && (
            <Link href="/army/add" className="button section-header-button">
              Add<span className="hide show-sm-inline"> General</span>
            </Link>
          )}
        </header>
        <p className="error">No active Generals for this edition yet.</p>
      </section>
    );
  }

  return (
    <>
      <section className="section">
        <header className="section-header">
          <h2>{props.title}</h2>
          {props.showCreateButton && (
            <Link href="/army/add" className="button section-header-button">
              Add<span className="hide show-sm-inline"> General</span>
            </Link>
          )}
        </header>

        <table className="primary-table">
          <thead>
            <tr>
              <th className="sort-title" onClick={() => handleSort("Alias")}>
                Name <span className={sortColumn === "Alias" ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon("Alias")}</span>
              </th>
              <th className="text-center sort-title" onClick={() => handleSort("Played")}>
                Played <span className={sortColumn === "Played" ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon("Played")}</span>
              </th>
              <th className="hide show-lg text-center sort-title" onClick={() => handleSort("FirstTurnPercentage")}>
                First Turn&nbsp;% <span className={sortColumn === "FirstTurnPercentage" ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon("FirstTurnPercentage")}</span>
              </th>
              <th className="hide show-sm text-center sort-title" onClick={() => handleSort("Won")}>
                Won <span className={sortColumn === "Won" ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon("Won")}</span>
              </th>
              <th className="hide show-sm text-center sort-title" onClick={() => handleSort("Lost")}>
                Lost <span className={sortColumn === "Lost" ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon("Lost")}</span>
              </th>
              <th className="hide show-sm text-center sort-title" onClick={() => handleSort("Drawn")}>
                Drawn <span className={sortColumn === "Drawn" ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon("Drawn")}</span>
              </th>
              <th className="hide show-md text-center sort-title" onClick={() => handleSort("AveragePoints")}>
                Avg. Points <span className={sortColumn === "AveragePoints" ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon("AveragePoints")}</span>
              </th>
              <th className="hide show-lg text-center sort-title" onClick={() => handleSort("TotalPoints")}>
                Total Points <span className={sortColumn === "TotalPoints" ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon("TotalPoints")}</span>
              </th>
              <th className="text-center sort-title" title="Points +/-" onClick={() => handleSort("PointDifference")}>
                <span className="hide show-md-inline">Points&nbsp;</span>+/- <span className={sortColumn === "PointDifference" ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon("PointDifference")}</span>
              </th>
              <th className="text-center sort-title" onClick={() => handleSort("WinPercentage")}>
                Win&nbsp;% <span className={sortColumn === "WinPercentage" ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon("WinPercentage")}</span>
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
  );
};

export default GeneralsTable;