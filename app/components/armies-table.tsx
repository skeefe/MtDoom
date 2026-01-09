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

  const SortableHeader = ({ column, label }: { column: string; label: string }) => (
    <th onClick={() => handleSort(column)} style={{ cursor: "pointer" }}>
      {label} {sortColumn === column && (sortDirection === "asc" ? "▲" : "▼")}
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
              <SortableHeader column="Name" label="Name" />
              <th className="text-center" onClick={() => handleSort("Played")} style={{ cursor: "pointer" }}>
                Played {sortColumn === "Played" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="hide show-lg text-center" onClick={() => handleSort("FirstTurnPercentage")} style={{ cursor: "pointer" }}>
                First Turn&nbsp;% {sortColumn === "FirstTurnPercentage" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="hide show-sm text-center" onClick={() => handleSort("Won")} style={{ cursor: "pointer" }}>
                Won {sortColumn === "Won" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="hide show-sm text-center" onClick={() => handleSort("Lost")} style={{ cursor: "pointer" }}>
                Lost {sortColumn === "Lost" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="hide show-md text-center" onClick={() => handleSort("AveragePoints")} style={{ cursor: "pointer" }}>
                Avg. Points {sortColumn === "AveragePoints" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="hide show-lg text-center" onClick={() => handleSort("TotalPoints")} style={{ cursor: "pointer" }}>
                Total Points {sortColumn === "TotalPoints" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="text-center" title="Points +/-" onClick={() => handleSort("PointDifference")} style={{ cursor: "pointer" }}>
                <span className="hide show-md-inline">Points&nbsp;</span>+/- {sortColumn === "PointDifference" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="text-center" onClick={() => handleSort("WinPercentage")} style={{ cursor: "pointer" }}>
                Win&nbsp;% {sortColumn === "WinPercentage" && (sortDirection === "asc" ? "▲" : "▼")}
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
