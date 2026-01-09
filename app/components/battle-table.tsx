import React, { useState } from "react";
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

const BattleTable = (props: {
  title: string;
  battles: iBattleSummary[];
  showCreateButton: boolean;
}) => {
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<string>("Date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAddBattle = async () => {
    const db = getFirestore(firebase_app);
    const docRef = await addDoc(collection(db, "Battles"), {});

    //Add date.
    updateDoc(docRef, { Date: Timestamp.now() })
      .then((docRef) => {})
      .catch((error) => {
        console.log(error);
      });

    router.push(`/battle/${docRef.id}`);
  };

  const getSortedBattles = () => {
    const sorted = [...props.battles].sort((a, b) => {
      let aValue: any = a[sortColumn as keyof iBattleSummary];
      let bValue: any = b[sortColumn as keyof iBattleSummary];

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

  return props.battles.length > 0 ? (
    <>
      <section className="section">
        <header className="section-header">
          <h2>{props.title}</h2>

          {props.showCreateButton ? (
            <button
              className="button section-header-button"
              type="submit"
              onClick={(event) => handleAddBattle()}
            >
              Create Battle
            </button>
          ) : null}
        </header>

        <table className="primary-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("Date")} style={{ cursor: "pointer" }}>
                Date {sortColumn === "Date" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="hide show-sm" onClick={() => handleSort("PrimaryMission")} style={{ cursor: "pointer" }}>
                Mission {sortColumn === "PrimaryMission" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th>Attacker
              </th>
             <th>
                Defender
              </th>
            </tr>
          </thead>

          <tbody>
            {getSortedBattles().map((battle, index) => (
              <BattleTableRow battle={battle} key={index} />
            ))}
          </tbody>
        </table>
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default BattleTable;
