"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import firebase_app from "../../../../firebase/config";
import getDocSnapshot from "../../../../firebase/getDocSnapshot";
import UnitForm from "../../../../components/unit-form";
import Spinner from "../../../../components/spinner";
import Link from "next/link";

export default function AddUnitPage({ params }: { params: Promise<{ army: string }> }) {
  const armyId = use(params).army;
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const armyDetails = getDocSnapshot("Armies", armyId);

  const handleSave = async (unit) => {
    await addDoc(collection(db, `Armies/${armyId}/Units`), unit);
    router.push(`/army/${armyId}/units`);
  };

  if (!armyDetails["Name"]) return <Spinner />;

  return (
    <>
      <header className="section-header">
        <h1>
          <Link href={`/army/${armyId}/units`} style={{ textDecoration: "none" }}>
            {armyDetails["Emoji"]} {armyDetails["Name"]} › Units
          </Link>
          {" › Add Unit"}
        </h1>
      </header>

      <UnitForm
        armyId={armyId}
        onSave={handleSave}
        onCancel={() => router.push(`/army/${armyId}/units`)}
      />
    </>
  );
}
