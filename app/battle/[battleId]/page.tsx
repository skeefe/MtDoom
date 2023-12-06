import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import firebase_app from "../../firebase/config";
import BattleForm from "../../components/battle-form";

export default function Battle({ params }: { params: { battleId: string } }) {
  const battleId = params.battleId;

  return (
    <>
      <BattleForm battleId={battleId} />
    </>
  );
}
