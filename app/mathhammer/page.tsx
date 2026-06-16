"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import firebase_app from "../firebase/config";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import CalcForm from "../components/calc-form";
import Spinner from "../components/spinner";
import { iUnit } from "../types/unit";

export default function MathHammerPage() {
  const db = getFirestore(firebase_app);
  const router = useRouter();
  const searchParams = useSearchParams();

  const armies = getCollectionSnapshot("Armies", "Name", "asc");
  const [allUnits, setAllUnits] = useState<iUnit[]>([]);
  const [loading, setLoading] = useState(true);

  // Wizard state — driven by URL params
  const step = parseInt(searchParams.get("step") ?? "1") as 1 | 2 | 3 | 4;
  const attackerUnitId = searchParams.get("au") ?? "";
  const attackerLoadoutId = searchParams.get("al") ?? "";
  const defenderUnitId = searchParams.get("du") ?? "";
  const defenderLoadoutId = searchParams.get("dl") ?? "";

  const pushParams = useCallback((params: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v) current.set(k, v);
      else current.delete(k);
    });
    router.push(`/mathhammer?${current.toString()}`);
  }, [searchParams, router]);

  const setStep = (s: number) => pushParams({ step: String(s) });

  const setAttackerUnit = (id: string) => pushParams({ au: id, al: "", step: "1" });
  const setAttackerLoadout = (id: string) => pushParams({ al: id });
  const setDefenderUnit = (id: string) => pushParams({ du: id, dl: "", step: "2" });
  const setDefenderLoadout = (id: string) => pushParams({ dl: id });

  const resetWizard = () => router.push("/mathhammer");

  useEffect(() => {
    if (armies.length === 0) return;
    const fetchAllUnits = async () => {
      const unitPromises = armies.map(async (army) => {
        const snapshot = await getDocs(collection(db, `Armies/${army.id}/Units`));
        return snapshot.docs.map((doc) => ({
          ...doc.data(), id: doc.id, ArmyId: army.id,
        })) as iUnit[];
      });
      const results = await Promise.all(unitPromises);
      setAllUnits(results.flat());
      setLoading(false);
    };
    fetchAllUnits();
  }, [armies.length]);

  const handleUnitAdded = (newUnit: iUnit) =>
    setAllUnits((prev) => [...prev, newUnit]);

  const handleUnitUpdated = (updated: iUnit) =>
    setAllUnits((prev) => prev.map((u) => u.id === updated.id ? updated : u));

  const handleUnitDeleted = (unitId: string) =>
    setAllUnits((prev) => prev.filter((u) => u.id !== unitId));

  if (loading && armies.length > 0) return <Spinner />;

  return (
    <>
      <header className="section-header">
        <h1>🧮 MathHammer</h1>
      </header>
      {armies.length === 0 ? (
        <div style={{ padding: "2rem 0", color: "var(--color-text-muted)" }}>
          <p>You need at least one army before you can use MathHammer.</p>
          <p style={{ marginTop: "0.5rem" }}><a href="/armies">Add an army</a> to get started.</p>
        </div>
      ) : (
        <CalcForm
          allUnits={allUnits}
          armies={armies}
          step={step}
          attackerUnitId={attackerUnitId}
          attackerLoadoutId={attackerLoadoutId}
          defenderUnitId={defenderUnitId}
          defenderLoadoutId={defenderLoadoutId}
          onSetStep={setStep}
          onSetAttackerUnit={setAttackerUnit}
          onSetAttackerLoadout={setAttackerLoadout}
          onSetDefenderUnit={setDefenderUnit}
          onSetDefenderLoadout={setDefenderLoadout}
          onResetWizard={resetWizard}
          onUnitAdded={handleUnitAdded}
          onUnitUpdated={handleUnitUpdated}
          onUnitDeleted={handleUnitDeleted}
        />
      )}
    </>
  );
}