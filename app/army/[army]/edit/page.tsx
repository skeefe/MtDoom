import React from "react";
import ArmyForm from "../../../components/army-form";

export default function ArmyEdit({ params }: { params: { army: string } }) {
  const armyId = params.army;

  return (
    <>
      <ArmyForm armyId={armyId} />
    </>
  );
}
