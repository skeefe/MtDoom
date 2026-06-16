"use client";

import { iUnit } from "../types/unit";
import { useRouter } from "next/navigation";

interface UnitsTableRowProps {
  unit: iUnit;
  armyId: string;
}

export default function UnitsTableRow({ unit, armyId }: UnitsTableRowProps) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/army/${armyId}/units/${unit.id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{unit.Name}</td>
      <td>{unit.Loadouts.length}</td>
      <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
        {unit.Loadouts.map((l) => l.Name || "Unnamed").join(", ")}
      </td>
    </tr>
  );
}
