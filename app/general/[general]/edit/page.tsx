import React from "react";
import GeneralForm from "../../../components/general-form";

export default function ArmyEdit({ params }: { params: { general: string } }) {
  const generalId = params.general;

  return (
    <>
      <GeneralForm generalId={generalId} />
    </>
  );
}
