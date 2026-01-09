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
      let aValue = a[sortColumn as keyof iBattleSummary];
      let bValue = b[sortColumn as keyof iBattleSummary];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
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
              <th className="hide show-sm" onClick={() => handleSort("Mission")} style={{ cursor: "pointer" }}>
                Mission {sortColumn === "Mission" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("Attacker")} style={{ cursor: "pointer" }}>
                Attacker {sortColumn === "Attacker" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("Defender")} style={{ cursor: "pointer" }}>
                Defender {sortColumn === "Defender" && (sortDirection === "asc" ? "▲" : "▼")}
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
