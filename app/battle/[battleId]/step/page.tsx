import React from "react";
import StepBattle from "../../../components/step-battle";

export default function Steps({ params }: { params: { battleId: string } }) {
  const battleId = params.battleId;

  return (
    <>
      <StepBattle battleId={battleId} />
    </>
  );
}
