import Link from "next/link";
import React from "react";

export default function ArmyDashboard({
  params,
}: {
  params: { army: string };
}) {
  const armyId = params.army;

  return (
    <>
      <div>Army: {armyId}</div>

      <Link href={`/army/${armyId}/edit`}>Edit Army</Link>
    </>
  );
}
