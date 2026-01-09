import React, { useState } from "react";
import Link from "next/link";
import Spinner from "./spinner";
import ArmyTableRow from "./armies-table-row";
import { iArmySummary } from "../types/army";

const ArmiesTable = (props: {
  title: string;
  armies: iArmySummary[];
  showCreateButton: boolean;
}) => {
  const [sortColumn, setSortColumn] = useState<string>("Name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortedArmies = () => {
    const sorted = [...props.armies].sort((a, b) => {
      let aValue = a[sortColumn as keyof iArmySummary];
      let bValue = b[sortColumn as keyof iArmySummary];

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

  const getArrowIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? "▲" : "▼";
    }
    return "↕";
  };

  const SortableHeader = ({ column, label }: { column: string; label: string }) => (
    <th onClick={() => handleSort(column)}>
      {label} <span className={sortColumn === column ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon(column)}</span>
    </th>
  );

  return props.armies.length > 0 ? (
    <>
      <section className="section">
        <header className="section-header">
          <h2>{props.title}</h2>

          {props.showCreateButton && (
            <Link href="/army/add" className="button section-header-button">
              Add<span className="hide show-sm-inline"> Army</span>
            </Link>
          )}
        </header>

        <table className="primary-table">
          <thead>
            <tr>
              <th className="sort-title" onClick={() => handleSort("Name")}>
                Name <span className={sortColumn === "Name" ? "sort-arrow-active" : "sort-arrow-inactive"}>{getArrowIcon("Name")}</span>
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
            {getSortedArmies().map((army, index) => (
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
