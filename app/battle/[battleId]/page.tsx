import React from "react";
import BattleForm from "../../components/battle-form";

export default function Battle({ params }: { params: { battleId: string } }) {
  const battleId = params.battleId;

  return (
    <>
      <BattleForm battleId={battleId} />
    </>
  );
}
