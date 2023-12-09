import Link from "next/link";
import React from "react";

export default function GeneralDashboard({
  params,
}: {
  params: { general: string };
}) {
  const generalID = params.general;

  return (
    <>
      <div>General: {generalID}</div>

      <Link href={`/general/${generalID}/edit`}>Edit General</Link>
    </>
  );
}
