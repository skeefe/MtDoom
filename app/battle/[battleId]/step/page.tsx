import { use } from 'react';
import StepBattle from "../../../components/step-battle";

export default function Steps({ params }: { params: Promise<{ battleId: string }> }) {
  const battleId = use(params).battleId;

  return (
    <>
      <StepBattle battleId={battleId} />
    </>
  );
}
