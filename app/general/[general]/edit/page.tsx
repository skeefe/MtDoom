import { use } from 'react';
import GeneralForm from "../../../components/general-form";

export default function ArmyEdit({ params }: { params: Promise<{ general: string }> }) {
  const generalId = use(params).general;

  return (
    <>
      <GeneralForm generalId={generalId} />
    </>
  );
}
