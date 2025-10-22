import { use } from 'react';
import BattleForm from "../../components/battle-form";

export default function Battle({ params }: { params: Promise<{ battleId: string }> }) {
  const battleId = use(params).battleId;

  return (
    <>
      <BattleForm battleId={battleId} />
    </>
  );
}
