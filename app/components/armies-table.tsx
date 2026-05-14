import React, { useState, useMemo } from "react";
import Link from "next/link";
import Spinner from "./spinner";
import ArmyTableRow from "./armies-table-row";
import { iArmySummary } from "../types/army";
import TextField from "./text-field";

const ArmiesTable = (props: {
  title: string;
  armies: iArmySummary[];
  showCreateButton: boolean;
}) => {
  const [sortColumn, setSortColumn] = useState<string>("Name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // 1. Filter Logic
  const filteredArmies = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return props.armies;
    return props.armies.filter((army) =>
      army.Name.toLowerCase().includes(term)
    );
  }, [searchTerm, props.armies]);

  // 2. Sort Logic
  const getSortedArmies = useMemo(() => {
    return [...filteredArmies].sort((a, b) => {
      let aValue = a[sortColumn as keyof iArmySummary];
      let bValue = b[sortColumn as keyof iArmySummary];

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
  }, [filteredArmies, sortColumn, sortDirection]);

  const getArrowIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? "▲" : "▼";
    }
    return "↕";
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return props.armies.length > 0 ? (
    <>
      <section className="section">
        <header className="section-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2>{props.title}</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search Bar using your TextField component */}
            <div className="search-wrapper hide-mobile" style={{ position: 'relative' }}>
              <TextField
                label={null}
                type="text"
                required={false}
                id="army-filter"
                name="army-filter"
                changeFunction={handleSearchChange}
                value={searchTerm}
                emptyValue="Search Armies..."
              />
            </div>

            {props.showCreateButton && (
              <Link href="/army/add" className="button section-header-button" style={{ margin: 0 }}>
                Add<span className="hide show-sm-inline"> Army</span>
              </Link>
            )}
          </div>
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
              <th className="hide show-lg text-center">Prey</th>
              <th className="hide show-lg text-center">Nemesis</th>
            </tr>
          </thead>

          <tbody>
            {getSortedArmies.map((army, index) => (
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