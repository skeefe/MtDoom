"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import firebase_app from "../../../firebase/config";
import getDocSnapshot from "../../../firebase/getDocSnapshot";
import getCollectionSnapshot from "../../../firebase/getCollectionSnapshot";
import UnitForm from "../../../components/unit-form";
import UnitsTable from "../../../components/units-table";
import Spinner from "../../../components/spinner";
import Link from "next/link";

export default function ArmyUnitsPage({ params }: { params: Promise<{ army: string }> }) {
  const armyId = use(params).army;
  const router = useRouter();
  const db = getFirestore(firebase_app);

  const armyDetails = getDocSnapshot("Armies", armyId);
  const units = getCollectionSnapshot(`Armies/${armyId}/Units`, "Name", "asc");

  if (!armyDetails["Name"]) return <Spinner />;

  return (
    <>
      <header className="section-header">
        <h1>
          <Link href={`/army/${armyId}`} style={{ textDecoration: "none" }}>
            {armyDetails["Emoji"]} {armyDetails["Name"]}
          </Link>
          {" › Units"}
        </h1>
        <Link href={`/army/${armyId}/units/add`} className="button section-header-button">
          Add Unit
        </Link>
      </header>

      <UnitsTable units={units} armyId={armyId} armyName={armyDetails["Name"]} />
    </>
  );
}
