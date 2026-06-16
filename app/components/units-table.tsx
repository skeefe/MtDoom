"use client";

import { iUnit } from "../types/unit";
import UnitsTableRow from "./units-table-row";
import Link from "next/link";

interface UnitsTableProps {
  units: iUnit[];
  armyId: string;
  armyName: string;
}

export default function UnitsTable({ units, armyId, armyName }: UnitsTableProps) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <header className="section-header">
        <h2>Units</h2>
        <Link href={`/army/${armyId}/units/add`} className="button section-header-button">
          Add Unit
        </Link>
      </header>

      {units.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          No units saved yet. Add a unit to start building your library.
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Loadouts</th>
              <th>Variants</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <UnitsTableRow key={unit.id} unit={unit} armyId={armyId} />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
