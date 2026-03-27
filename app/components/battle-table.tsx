import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  getFirestore,
  updateDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import BattleTableRow from "./battle-table-row";
import { iBattleSummary } from "../types/battle";
import firebase_app from "../firebase/config";
import { useRouter } from "next/navigation";
import Spinner from "./spinner";
import TextField from "./textField";
import { createNewBattle } from "../../utils/create-battle";


const BattleTable = (props: {
  title: string;
  battles: iBattleSummary[];
  showCreateButton: boolean;
  onCreateClick?: () => void;
}) => {
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<string>("Date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Search States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Debounce Logic: Updates debouncedSearchTerm 300ms after typing stops
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAddBattle = () => {
  if (props.onCreateClick) {
    props.onCreateClick(); 
  } else {
    // Safety fallback
    createNewBattle(router); 
  }
};

  // 2. Extract unique values for autocomplete
  const autocompleteOptions = useMemo(() => {
    const options = new Set<string>();
    props.battles.forEach((battle) => {
      if (battle.Attacker) options.add(battle.Attacker);
      if (battle.Defender) options.add(battle.Defender);
      if (battle.AttackerArmy) options.add(battle.AttackerArmy);
      if (battle.DefenderArmy) options.add(battle.DefenderArmy);
      if (battle.Deployment) options.add(battle.Deployment);
      if (battle.PrimaryMission) options.add(battle.PrimaryMission);
      if (battle.MissionRule) options.add(battle.MissionRule);
    });
    return Array.from(options).sort();
  }, [props.battles]);

  // 3. Filter autocomplete (instant feedback)
  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return autocompleteOptions
      .filter((option) => option.toLowerCase().includes(term))
      .slice(0, 10);
  }, [searchTerm, autocompleteOptions]);

  // 4. Filter battles (uses debounced term for performance)
  const filteredBattles = useMemo(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (!term) return props.battles;

    return props.battles.filter((battle) => {
      return (
        battle.Attacker?.toLowerCase().includes(term) ||
        battle.Defender?.toLowerCase().includes(term) ||
        battle.AttackerArmy?.toLowerCase().includes(term) ||
        battle.DefenderArmy?.toLowerCase().includes(term) ||
        battle.Deployment?.toLowerCase().includes(term) ||
        battle.PrimaryMission?.toLowerCase().includes(term) ||
        battle.MissionRule?.toLowerCase().includes(term)
      );
    });
  }, [debouncedSearchTerm, props.battles]);

  // 5. Sort the filtered battles
  const getFilteredAndSortedBattles = useMemo(() => {
    return [...filteredBattles].sort((a, b) => {
      let aValue: any = a[sortColumn as keyof iBattleSummary];
      let bValue: any = b[sortColumn as keyof iBattleSummary];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue instanceof Timestamp) aValue = aValue.toMillis();
      if (bValue instanceof Timestamp) bValue = bValue.toMillis();

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredBattles, sortColumn, sortDirection]);

  const getArrowIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? "▲" : "▼";
    }
    return "↕";
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowAutocomplete(true);
    setSelectedIndex(-1);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setShowAutocomplete(false);
    inputRef.current?.focus();
  };

  const handleAutocompleteSelect = (option: string) => {
    setSearchTerm(option);
    setDebouncedSearchTerm(option); // Update instantly on selection
    setShowAutocomplete(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showAutocomplete || filteredOptions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleAutocompleteSelect(filteredOptions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowAutocomplete(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return props.battles.length > 0 ? (
    <>
      <section className="section">


        <header className="section-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap', // Allows wrapping if the title is long
          gap: '1rem'
        }}>
          <h2>{props.title}</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search Bar - Hidden on mobile via the 'hide-mobile' class */}
            <div className="search-wrapper hide-mobile" ref={searchRef} style={{ position: 'relative' }}>

              <TextField
                label={null}
                type="text"
                required={false}
                id="battle-filter"
                name="battle-filter"
                changeFunction={handleSearchChange}
                value={searchTerm}
                emptyValue="Search Battles..."
              />

            </div>

            {props.showCreateButton && (
              <button
                className="button section-header-button"
                onClick={handleAddBattle}
                style={{ margin: 0 }} // Remove default margins to align perfectly
              >
                CREATE BATTLE
              </button>
            )}
          </div>
        </header>

        <table className="primary-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("Date")} className="sort-title" style={{ cursor: "pointer" }}>
                Date{" "}
                <span className={sortColumn === "Date" ? "sort-arrow-active" : "sort-arrow-inactive"}>
                  {getArrowIcon("Date")}
                </span>
              </th>
              <th
                className="hide show-sm sort-title"
                onClick={() => handleSort("PrimaryMission")}
                style={{ cursor: "pointer" }}
              >
                Mission{" "}
                <span className={sortColumn === "PrimaryMission" ? "sort-arrow-active" : "sort-arrow-inactive"}>
                  {getArrowIcon("PrimaryMission")}
                </span>
              </th>
              <th>Attacker</th>
              <th>Defender</th>
            </tr>
          </thead>

          <tbody>
            {getFilteredAndSortedBattles.map((battle, index) => (
              <BattleTableRow battle={battle} key={battle.id || index} />
            ))}
          </tbody>
        </table>

        {getFilteredAndSortedBattles.length === 0 && debouncedSearchTerm && (
          <p style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
            No battles match your search criteria
          </p>
        )}
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default BattleTable;