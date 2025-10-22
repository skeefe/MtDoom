import { use } from 'react';
import ArmyForm from "../../../components/army-form";

export default function ArmyEdit({ params }: { params: Promise<{ army: string }> }) {
  const armyId = use(params).army;

  return (
    <>
      <ArmyForm armyId={armyId} />
    </>
  );
}
