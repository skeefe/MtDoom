"use client";

import { useState, useEffect } from "react";
import { iUnit, iLoadout, iModelProfile } from "../types/unit";
import { calcCombat, CalcResult, CalcModifiers } from "../../utils/combat-calc";
import { collection, addDoc, doc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import firebase_app from "../firebase/config";
import UnitForm from "./unit-form";
import LoadoutForm from "./loadout-form";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Army { id: string; Name: string; Emoji?: string; }

interface CalcFormProps {
  allUnits: iUnit[];
  armies: Army[];
  // Wizard state — driven by URL from parent
  step: 1 | 2 | 3 | 4;
  attackerUnitId: string;
  attackerLoadoutId: string;
  defenderUnitId: string;
  defenderLoadoutId: string;
  onSetStep: (step: number) => void;
  onSetAttackerUnit: (id: string) => void;
  onSetAttackerLoadout: (id: string) => void;
  onSetDefenderUnit: (id: string) => void;
  onSetDefenderLoadout: (id: string) => void;
  onResetWizard: () => void;
  onUnitAdded: (unit: iUnit) => void;
  onUnitUpdated: (unit: iUnit) => void;
  onUnitDeleted: (unitId: string) => void;
}

type WizardStep = 1 | 2 | 3 | 4;
type Side = "attacker" | "defender";
type SortField = "Name" | "Army";
type SortDir = "asc" | "desc";
type InlineMode =
  | null
  | { type: "addUnit"; side: Side }
  | { type: "editUnit"; unit: iUnit }
  | { type: "manageLoadouts"; unit: iUnit; side: Side }
  | { type: "editLoadout"; unit: iUnit; loadout: iLoadout; side: Side; returnTo: "manageLoadouts" | "editUnit" };

interface AttackModifiers {
  rerollHits: boolean;
  rerollHitsOnes: boolean;
  rerollWounds: boolean;
  rerollWoundsOnes: boolean;
  lethalHits: boolean;
  sustainedHits: boolean;
  devastatingWounds: boolean;
  minusOneToHit: boolean;
  critsOnFives: boolean;
  blast: boolean;
  cleave: boolean;
  plusOneToWound: boolean;
}

interface DefenceModifiers {
  hardToWound: boolean;
  cover: boolean;
}

interface UnitModifiers {
  attack: AttackModifiers;
  defence: DefenceModifiers;
}

const emptyAttackMods = (): AttackModifiers => ({
  rerollHits: false, rerollHitsOnes: false,
  rerollWounds: false, rerollWoundsOnes: false,
  lethalHits: false, sustainedHits: false,
  devastatingWounds: false, minusOneToHit: false,
  critsOnFives: false, blast: false, cleave: false,
  plusOneToWound: false,
});

const emptyDefenceMods = (): DefenceModifiers => ({
  hardToWound: false, cover: false,
});

const emptyUnitMods = (): UnitModifiers => ({
  attack: emptyAttackMods(),
  defence: emptyDefenceMods(),
});

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CalcForm({
  allUnits, armies,
  step, attackerUnitId, attackerLoadoutId, defenderUnitId, defenderLoadoutId,
  onSetStep, onSetAttackerUnit, onSetAttackerLoadout, onSetDefenderUnit, onSetDefenderLoadout, onResetWizard,
  onUnitAdded, onUnitUpdated, onUnitDeleted,
}: CalcFormProps) {
  const db = getFirestore(firebase_app);

  const [inline, setInline] = useState<InlineMode>(null);
  const [attackerCount, setAttackerCount] = useState(5);
  const [attackerMods, setAttackerMods] = useState<UnitModifiers>(emptyUnitMods());
  const [defenderCount, setDefenderCount] = useState(5);
  const [defenderMods, setDefenderMods] = useState<UnitModifiers>(emptyUnitMods());
  const [result, setResult] = useState<CalcResult | null>(null);
  const [returnResult, setReturnResult] = useState<CalcResult | null>(null);
  const [fightOnDeathResult, setFightOnDeathResult] = useState<CalcResult | null>(null);
  const [showReturn, setShowReturn] = useState(false);
  const [showFightOnDeath, setShowFightOnDeath] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const attackerUnit = allUnits.find((u) => u.id === attackerUnitId);
  const defenderUnit = allUnits.find((u) => u.id === defenderUnitId);

  const resolveLoadout = (unit?: iUnit, loadoutId?: string): iLoadout | undefined => {
    if (!unit) return undefined;
    if (unit.Loadouts.length === 1) return unit.Loadouts[0];
    return unit.Loadouts.find((l) => l.id === loadoutId);
  };

  const attackerLoadout = resolveLoadout(attackerUnit, attackerLoadoutId);
  const defenderLoadout = resolveLoadout(defenderUnit, defenderLoadoutId);
  const defaultArmyId = armies[0]?.id ?? "";

  const armyName = (armyId: string) => {
    const a = armies.find((a) => a.id === armyId);
    return a ? `${a.Emoji ?? ""} ${a.Name}`.trim() : "—";
  };

  const selectUnit = (side: Side, unitId: string) => {
    if (side === "attacker") { onSetAttackerUnit(unitId); setResult(null); }
    else { onSetDefenderUnit(unitId); setResult(null); }
  };

  const selectLoadout = (side: Side, loadoutId: string) => {
    if (side === "attacker") onSetAttackerLoadout(loadoutId);
    else onSetDefenderLoadout(loadoutId);
    setResult(null);
  };

  // ─── Unit CRUD ──────────────────────────────────────────────────────────────

  const handleAddUnit = async (unitData: Omit<iUnit, "id">) => {
    const side = (inline as { type: "addUnit"; side: Side }).side;
    const ref = await addDoc(collection(db, `Armies/${unitData.ArmyId}/Units`), unitData);
    const newUnit: iUnit = { ...unitData, id: ref.id };
    onUnitAdded(newUnit);
    if (side === "attacker") onSetAttackerUnit(newUnit.id);
    else onSetDefenderUnit(newUnit.id);
    setInline(null);
  };

  const handleEditUnit = async (unitData: Omit<iUnit, "id">) => {
    const unit = (inline as { type: "editUnit"; unit: iUnit }).unit;
    await updateDoc(doc(db, `Armies/${unit.ArmyId}/Units`, unit.id), { Name: unitData.Name, Models: unitData.Models });
    onUnitUpdated({ ...unit, Name: unitData.Name, Models: unitData.Models });
    setInline(null);
  };

  const handleDeleteUnit = async (unit: iUnit) => {
    await deleteDoc(doc(db, `Armies/${unit.ArmyId}/Units`, unit.id));
    onUnitDeleted(unit.id);
    if (attackerUnitId === unit.id) onSetAttackerUnit("");
    if (defenderUnitId === unit.id) onSetDefenderUnit("");
    setDeleteConfirm(null);
  };

  // ─── Loadout CRUD ───────────────────────────────────────────────────────────

  const handleSaveLoadout = async (loadout: iLoadout) => {
    const { unit, side, returnTo } = inline as { unit: iUnit; side: Side; type: string; returnTo?: string };
    const existing = unit.Loadouts.find((l) => l.id === loadout.id);
    const updatedLoadouts = existing
      ? unit.Loadouts.map((l) => l.id === loadout.id ? loadout : l)
      : [...unit.Loadouts, loadout];
    const updatedUnit = { ...unit, Loadouts: updatedLoadouts };
    await updateDoc(doc(db, `Armies/${unit.ArmyId}/Units`, unit.id), { Loadouts: updatedLoadouts });
    onUnitUpdated(updatedUnit);
    if (returnTo === "editUnit") {
      setInline({ type: "editUnit", unit: updatedUnit });
    } else {
      setInline({ type: "manageLoadouts", unit: updatedUnit, side });
    }
  };

  const handleDeleteLoadout = async (unit: iUnit, loadoutId: string, side: Side, returnTo: "manageLoadouts" | "editUnit" = "manageLoadouts") => {
    const updatedLoadouts = unit.Loadouts.filter((l) => l.id !== loadoutId);
    const updatedUnit = { ...unit, Loadouts: updatedLoadouts };
    await updateDoc(doc(db, `Armies/${unit.ArmyId}/Units`, unit.id), { Loadouts: updatedLoadouts });
    onUnitUpdated(updatedUnit);
    if (attackerLoadoutId === loadoutId) onSetAttackerLoadout("");
    if (defenderLoadoutId === loadoutId) onSetDefenderLoadout("");
    if (returnTo === "editUnit") {
      setInline({ type: "editUnit", unit: updatedUnit });
    } else {
      setInline({ type: "manageLoadouts", unit: updatedUnit, side });
    }
    setDeleteConfirm(null);
  };

  // ─── Calc ───────────────────────────────────────────────────────────────────

  const buildModifiers = (attackMods: AttackModifiers, defenceMods: DefenceModifiers): CalcModifiers => ({
    rerollHits: attackMods.rerollHits,
    rerollHitsOnes: attackMods.rerollHitsOnes,
    rerollWounds: attackMods.rerollWounds,
    rerollWoundsOnes: attackMods.rerollWoundsOnes,
    lethalHits: attackMods.lethalHits,
    sustainedHits: attackMods.sustainedHits ? 1 : 0,
    devastatingWounds: attackMods.devastatingWounds,
    minusOneToHit: attackMods.minusOneToHit,
    critsOnFives: attackMods.critsOnFives,
    blast: attackMods.blast,
    cleave: attackMods.cleave,
    plusOneToWound: attackMods.plusOneToWound,
    hardToWound: defenceMods.hardToWound,
    cover: defenceMods.cover,
  });

  const runCalc = () => {
    if (!attackerLoadout || !defenderUnit?.Models) return;
    const res = calcCombat(
      attackerLoadout.Weapon, attackerCount, defenderUnit.Models, defenderCount,
      buildModifiers(attackerMods.attack, defenderMods.defence)
    );
    setResult(res); setReturnResult(null); setFightOnDeathResult(null); setShowReturn(false); setShowFightOnDeath(false); onSetStep(4);
  };

  const handleReturnStrike = () => {
    if (!result || !defenderLoadout || !attackerUnit?.Models) return;
    const survivors = Math.max(0, Math.ceil(defenderCount - result.avgModelsKilled));
    if (survivors === 0) { setShowReturn(true); setReturnResult(null); return; }
    const res = calcCombat(
      defenderLoadout.Weapon, survivors, attackerUnit.Models, attackerCount,
      buildModifiers(defenderMods.attack, attackerMods.defence)
    );
    setReturnResult(res); setShowReturn(true);
  };

  const handleReCalc = () => {
    if (!attackerLoadout || !defenderUnit?.Models) return;
    const res = calcCombat(
      attackerLoadout.Weapon, attackerCount, defenderUnit.Models, defenderCount,
      buildModifiers(attackerMods.attack, defenderMods.defence)
    );
    setResult(res); setReturnResult(null); setFightOnDeathResult(null); setShowReturn(false); setShowFightOnDeath(false);
  };

  const handleFightOnDeath = () => {
    if (!result || !defenderLoadout || !attackerUnit?.Models) return;
    const deadModels = Math.floor(result.avgModelsKilled);
    if (deadModels === 0) return;
    const res = calcCombat(
      defenderLoadout.Weapon, deadModels, attackerUnit!.Models, attackerCount,
      buildModifiers(defenderMods.attack, attackerMods.defence)
    );
    setFightOnDeathResult(res);
    setShowFightOnDeath(true);
  };

  // Auto-recalc on count change with debounce
  useEffect(() => {
    if (!result || !attackerLoadout || !defenderUnit?.Models) return;
    const timer = setTimeout(() => {
      const res = calcCombat(
        attackerLoadout.Weapon, attackerCount, defenderUnit.Models, defenderCount,
        buildModifiers(attackerMods.attack, defenderMods.defence)
      );
      setResult(res);
      setReturnResult(null);
      setFightOnDeathResult(null);
      setShowReturn(false);
      setShowFightOnDeath(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [attackerCount, defenderCount]);

  const step1Complete = !!attackerLoadout;
  const step2Complete = !!defenderLoadout && !!defenderUnit?.Models;

  // ─── Inline views ───────────────────────────────────────────────────────────

  if (inline?.type === "addUnit") {
    return (
      <InlineWrapper title="Add Unit" onBack={() => setInline(null)}>
        <UnitForm armyId={defaultArmyId} onSave={handleAddUnit} onCancel={() => setInline(null)} />
      </InlineWrapper>
    );
  }

  if (inline?.type === "editUnit") {
    const { unit } = inline;
    return (
      <InlineWrapper title={`Edit — ${unit.Name}`} onBack={() => setInline(null)}>
        <UnitForm armyId={unit.ArmyId} unit={unit} onSave={handleEditUnit} onCancel={() => setInline(null)} />

        {/* Loadouts section */}
        <div style={{ marginTop: "2rem", borderTop: "2px solid var(--color-divider)", paddingTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0 }}>Loadouts</h3>
            <button
              className="button button-secondary"
              onClick={() => setInline({ type: "editLoadout", unit, loadout: { id: crypto.randomUUID(), Name: "", Weapon: { Name: "", Type: "Melee", Attacks: "1", BSWS: "3+", Strength: 4, AP: 0, Damage: "1", Abilities: "" } }, side: "attacker", returnTo: "editUnit" })}
            >
              + Add loadout
            </button>
          </div>
          {unit.Loadouts.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)" }}>No loadouts yet.</p>
          ) : (
            <table className="primary-table">
              <thead>
                <tr>
                  <th>Weapon</th>
                  <th>Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {unit.Loadouts.map((l) => (
                  <tr key={l.id}>
                    <td>{l.Weapon.Name || "Unnamed"}</td>
                    <td>{l.Weapon.Type}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button className="button button-icon" onClick={() => setInline({ type: "editLoadout", unit, loadout: l, side: "attacker", returnTo: "editUnit" })} style={{ marginRight: "0.25rem" }}>✏️</button>
                      {deleteConfirm === l.id ? (
                        <>
                          <button className="button button-icon" onClick={() => handleDeleteLoadout(unit, l.id, "attacker", "editUnit")} style={{ marginRight: "0.25rem" }}>Confirm</button>
                          <button className="button button-icon" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        </>
                      ) : (
                        <button className="button button-icon" onClick={() => setDeleteConfirm(l.id)}>🗑️</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </InlineWrapper>
    );
  }

  if (inline?.type === "manageLoadouts") {
    const { unit, side } = inline;
    return (
      <InlineWrapper title={`${unit.Name} — Loadouts`} onBack={() => setInline(null)}>
        {/* Existing loadouts table */}
        {unit.Loadouts.length > 0 && (
          <table className="primary-table" style={{ marginBottom: "1.5rem" }}>
            <thead>
              <tr>
                <th>Weapon</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {unit.Loadouts.map((l) => (
                <tr key={l.id}>
                  <td>{l.Weapon.Name || "Unnamed"}</td>
                  <td>{l.Weapon.Type}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button
                      className="button button-icon"
                      onClick={() => setInline({ type: "editLoadout", unit, loadout: l, side, returnTo: "manageLoadouts" })}
                      style={{ marginRight: "0.5rem" }}
                    >✏️</button>
                    {deleteConfirm === l.id ? (
                      <>
                        <button className="button button-icon" onClick={() => handleDeleteLoadout(unit, l.id, side, "manageLoadouts")} style={{ marginRight: "0.25rem" }}>Confirm</button>
                        <button className="button button-icon" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                      </>
                    ) : (
                      <button className="button button-icon" onClick={() => setDeleteConfirm(l.id)}>🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <h3 style={{ marginBottom: "1rem" }}>Add Loadout</h3>
        <LoadoutForm
          onSave={handleSaveLoadout}
          onCancel={() => setInline(null)}
        />
      </InlineWrapper>
    );
  }

  if (inline?.type === "editLoadout") {
    const { unit, loadout, side, returnTo } = inline;
    const backTarget = returnTo === "editUnit"
      ? () => setInline({ type: "editUnit", unit })
      : () => setInline({ type: "manageLoadouts", unit, side });
    return (
      <InlineWrapper title={loadout.Weapon.Name ? `Edit — ${loadout.Weapon.Name}` : "Add Weapon"} onBack={backTarget}>
        <LoadoutForm
          loadout={loadout.Weapon.Name ? loadout : undefined}
          onSave={handleSaveLoadout}
          onCancel={backTarget}
        />
      </InlineWrapper>
    );
  }

  // ─── Wizard ─────────────────────────────────────────────────────────────────

  return (
    <div>
      <WizardNav step={step} setStep={onSetStep} step1Complete={step1Complete} step2Complete={step2Complete} hasResult={!!result} />

      {step === 1 && (
        <WizardStep title="Who is attacking?">
          <UnitTable
            side="attacker"
            allUnits={allUnits}
            selectedUnitId={attackerUnitId}
            selectedLoadoutId={attackerLoadoutId}
            armyName={armyName}
            onSelectUnit={(id) => selectUnit("attacker", id)}
            onSelectLoadout={(id) => selectLoadout("attacker", id)}
            onAddUnit={() => setInline({ type: "addUnit", side: "attacker" })}
            onAddLoadout={(unit) => setInline({ type: "manageLoadouts", unit, side: "attacker" })}
            onEditUnit={(unit) => setInline({ type: "editUnit", unit })}
            onDeleteUnit={(unit) => { if (deleteConfirm === unit.id) handleDeleteUnit(unit); else setDeleteConfirm(unit.id); }}
            onEditLoadout={(unit, loadout) => setInline({ type: "editLoadout", unit, loadout, side: "attacker", returnTo: "manageLoadouts" })}
            onDeleteLoadout={(unit, loadoutId) => { if (deleteConfirm === loadoutId) handleDeleteLoadout(unit, loadoutId, "attacker"); else setDeleteConfirm(loadoutId); }}
            deleteConfirm={deleteConfirm}
            onCancelDelete={() => setDeleteConfirm(null)}
          />
          {step1Complete && (
            <button className="button" style={{ marginTop: "1.5rem" }} onClick={() => onSetStep(2)}>Next →</button>
          )}
        </WizardStep>
      )}

      {step === 2 && (
        <WizardStep title="Who is defending?">
          <UnitTable
            side="defender"
            allUnits={allUnits}
            selectedUnitId={defenderUnitId}
            selectedLoadoutId={defenderLoadoutId}
            armyName={armyName}
            onSelectUnit={(id) => selectUnit("defender", id)}
            onSelectLoadout={(id) => selectLoadout("defender", id)}
            onAddUnit={() => setInline({ type: "addUnit", side: "defender" })}
            onAddLoadout={(unit) => setInline({ type: "manageLoadouts", unit, side: "defender" })}
            onEditUnit={(unit) => setInline({ type: "editUnit", unit })}
            onDeleteUnit={(unit) => { if (deleteConfirm === unit.id) handleDeleteUnit(unit); else setDeleteConfirm(unit.id); }}
            onEditLoadout={(unit, loadout) => setInline({ type: "editLoadout", unit, loadout, side: "defender", returnTo: "manageLoadouts" })}
            onDeleteLoadout={(unit, loadoutId) => { if (deleteConfirm === loadoutId) handleDeleteLoadout(unit, loadoutId, "defender"); else setDeleteConfirm(loadoutId); }}
            deleteConfirm={deleteConfirm}
            onCancelDelete={() => setDeleteConfirm(null)}
          />
          {step2Complete && (
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button className="button button-secondary" onClick={() => onSetStep(1)}>← Back</button>
              <button className="button" onClick={() => onSetStep(3)}>Next →</button>
            </div>
          )}
        </WizardStep>
      )}

      {step === 3 && (
        <WizardStep title="Set up the engagement">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>Attacker</div>
              <h3 style={{ marginBottom: "1rem" }}>{armies.find((a) => a.id === attackerUnit?.ArmyId)?.Emoji} {attackerUnit?.Name}</h3>
              <div className="field-container">
                <label>Model count:</label>
                <input type="number" min={1} value={attackerCount} onChange={(e) => setAttackerCount(parseInt(e.target.value) || 1)} onWheel={(e) => e.currentTarget.blur()} />
              </div>
              <AttackModifierPanel
                mods={attackerMods.attack}
                weaponType={attackerLoadout?.Weapon.Type}
                onChange={(attack) => setAttackerMods((prev) => ({ ...prev, attack }))}
              />
              <DefenceModifierPanel
                mods={attackerMods.defence}
                weaponType={attackerLoadout?.Weapon.Type}
                onChange={(defence) => setAttackerMods((prev) => ({ ...prev, defence }))}
                collapsed
              />
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>Defender</div>
              <h3 style={{ marginBottom: "1rem" }}>{armies.find((a) => a.id === defenderUnit?.ArmyId)?.Emoji} {defenderUnit?.Name}</h3>
              <div className="field-container">
                <label>Model count:</label>
                <input type="number" min={1} value={defenderCount} onChange={(e) => setDefenderCount(parseInt(e.target.value) || 1)} onWheel={(e) => e.currentTarget.blur()} />
              </div>
              <DefenceModifierPanel
                mods={defenderMods.defence}
                weaponType={attackerLoadout?.Weapon.Type}
                onChange={(defence) => setDefenderMods((prev) => ({ ...prev, defence }))}
              />
              <AttackModifierPanel
                mods={defenderMods.attack}
                weaponType={defenderLoadout?.Weapon.Type}
                onChange={(attack) => setDefenderMods((prev) => ({ ...prev, attack }))}
                collapsed
              />
            </div>
          </div>
          <button className="button" style={{ marginTop: "1.5rem", width: "100%" }} onClick={runCalc}>Calculate ⚔️</button>
          <button className="button button-secondary" style={{ marginTop: "0.75rem" }} onClick={() => onSetStep(2)}>← Back</button>
        </WizardStep>
      )}

      {step === 4 && result && attackerLoadout && defenderLoadout && (
        <WizardStep title="Results">
          <div style={{ display: "flex", gap: "2rem", alignItems: "center", marginBottom: "1.5rem", background: "var(--color-accent-subtle)", padding: "1rem", borderRadius: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>{armies.find((a) => a.id === attackerUnit?.ArmyId)?.Emoji} {attackerUnit?.Name}</span>
              <input type="number" min={1} value={attackerCount} onChange={(e) => setAttackerCount(parseInt(e.target.value) || 1)} onWheel={(e) => e.currentTarget.blur()} style={{ width: "60px" }} />
            </div>
            <span style={{ color: "var(--color-text-muted)" }}>vs</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>{armies.find((a) => a.id === defenderUnit?.ArmyId)?.Emoji} {defenderUnit?.Name}</span>
              <input type="number" min={1} value={defenderCount} onChange={(e) => setDefenderCount(parseInt(e.target.value) || 1)} onWheel={(e) => e.currentTarget.blur()} style={{ width: "60px" }} />
            </div>
          </div>
          <CalcResults result={result} attackerName={`${attackerUnit?.Name} — ${attackerLoadout.Name}`} defenderName={`${defenderUnit?.Name} — ${defenderLoadout.Name}`} defenderCount={defenderCount} />
          {!showReturn && (
            <button className="button button-secondary" onClick={handleReturnStrike} style={{ marginTop: "1rem", width: "100%" }}>↩ Show Return Strike</button>
          )}
          {attackerLoadout?.Weapon.Type === "Melee" && !showFightOnDeath && (
            <button className="button button-secondary" onClick={handleFightOnDeath} style={{ marginTop: "0.5rem", width: "100%" }}>💀 Show Fight on Death</button>
          )}
          {showReturn && (
            result.avgModelsKilled >= defenderCount ? (
              <div style={{ marginTop: "1.5rem", border: "1px solid var(--color-divider)", borderRadius: "8px", padding: "1.5rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                No survivors — {defenderUnit?.Name} cannot strike back.
              </div>
            ) : returnResult ? (
              <CalcResults result={returnResult} attackerName={`${defenderUnit?.Name} — ${defenderLoadout.Name} (survivors)`} defenderName={`${attackerUnit?.Name} — ${attackerLoadout.Name}`} defenderCount={attackerCount} isReturn />
            ) : null
          )}
          {showFightOnDeath && fightOnDeathResult && defenderLoadout && (
            <CalcResults
              result={fightOnDeathResult}
              attackerName={`${defenderUnit?.Name} — ${defenderLoadout.Name} (fight on death)`}
              defenderName={`${attackerUnit?.Name} — ${attackerLoadout.Name}`}
              defenderCount={attackerCount}
              isReturn
            />
          )}

          <button
            className="button button-secondary"
            onClick={() => { onResetWizard(); setResult(null); setReturnResult(null); setFightOnDeathResult(null); setShowReturn(false); setShowFightOnDeath(false); setAttackerCount(5); setDefenderCount(5); setAttackerMods(emptyUnitMods()); setDefenderMods(emptyUnitMods()); }}
            style={{ marginTop: "2rem" }}
          >
            ← Start Over
          </button>
        </WizardStep>
      )}
    </div>
  );
}

// ─── Inline Wrapper ───────────────────────────────────────────────────────────

function InlineWrapper({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div>
      <button className="button button-secondary" onClick={onBack} style={{ marginBottom: "1.5rem" }}>← Back</button>
      <h2 style={{ marginBottom: "1.5rem" }}>{title}</h2>
      {children}
    </div>
  );
}

// ─── Wizard Nav ───────────────────────────────────────────────────────────────

function WizardNav({ step, setStep, step1Complete, step2Complete, hasResult }: {
  step: number; setStep: (s: number) => void;
  step1Complete: boolean; step2Complete: boolean; hasResult: boolean;
}) {
  const steps = [
    { n: 1, label: "Attacker", canNav: true },
    { n: 2, label: "Defender", canNav: step1Complete },
    { n: 3, label: "Setup", canNav: step1Complete && step2Complete },
    { n: 4, label: "Results", canNav: hasResult },
  ];
  return (
    <div style={{ display: "flex", marginBottom: "2rem", borderBottom: "2px solid var(--color-divider)" }}>
      {steps.map(({ n, label, canNav }) => (
        <button key={n} onClick={() => canNav && setStep(n)} style={{
          background: "none", border: "none",
          borderBottom: step === n ? "2px solid var(--color-primary)" : "2px solid transparent",
          color: step === n ? "var(--color-primary)" : canNav ? "var(--color-text-secondary)" : "var(--color-text-muted)",
          cursor: canNav ? "pointer" : "default", fontFamily: "Aleo, sans-serif",
          marginBottom: "-2px", padding: "0.5rem 1.25rem", opacity: canNav ? 1 : 0.4,
        }}>
          {n}. {label}
        </button>
      ))}
    </div>
  );
}

// ─── Wizard Step ──────────────────────────────────────────────────────────────

function WizardStep({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>{title}</h2>
      {children}
    </div>
  );
}

// ─── Unit Table ───────────────────────────────────────────────────────────────

function UnitTable({ side, allUnits, selectedUnitId, selectedLoadoutId, armyName, onSelectUnit, onSelectLoadout, onAddUnit, onAddLoadout, onEditUnit, onDeleteUnit, onEditLoadout, onDeleteLoadout, deleteConfirm, onCancelDelete }: {
  side: Side; allUnits: iUnit[]; selectedUnitId: string; selectedLoadoutId: string;
  armyName: (id: string) => string;
  onSelectUnit: (id: string) => void; onSelectLoadout: (id: string) => void;
  onAddUnit: () => void; onAddLoadout: (unit: iUnit) => void;
  onEditUnit: (unit: iUnit) => void; onDeleteUnit: (unit: iUnit) => void;
  onEditLoadout: (unit: iUnit, loadout: iLoadout) => void;
  onDeleteLoadout: (unit: iUnit, loadoutId: string) => void;
  deleteConfirm: string | null; onCancelDelete: () => void;
}) {
  const [sortField, setSortField] = useState<SortField>("Name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const selectedUnit = allUnits.find((u) => u.id === selectedUnitId);
  const activeLoadout = selectedUnit?.Loadouts.length === 1
    ? selectedUnit.Loadouts[0]
    : selectedUnit?.Loadouts.find((l) => l.id === selectedLoadoutId);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const sorted = [...allUnits].sort((a, b) => {
    const aVal = sortField === "Name" ? a.Name : armyName(a.ArmyId);
    const bVal = sortField === "Name" ? b.Name : armyName(b.ArmyId);
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  // How many data cols before the action col (for colspan on sub-rows)
  const dataCols = side === "defender" ? 6 : 2;

  const SortTh = ({ field, label }: { field: SortField; label: string }) => (
    <th onClick={() => handleSort(field)} className="sort-title" style={{ userSelect: "none" }}>
      {label}{" "}
      <span className={sortField === field ? "sort-arrow-active" : "sort-arrow-inactive"}>
        {sortField === field ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </th>
  );

  return (
    <div>
      <table className="primary-table" style={{ marginBottom: "1rem" }}>
        <thead>
          <tr>
            <SortTh field="Name" label="Unit" />
            <SortTh field="Army" label="Army" />
            {side === "defender" && <><th>T</th><th>W</th><th>Sv</th><th>Invuln</th></>}
            <th style={{ textAlign: "right" }}></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((unit) => {
            const isSelected = unit.id === selectedUnitId;
            const models = unit.Models;
            return (
              <>
                {/* Unit row */}
                <tr key={unit.id} onClick={() => onSelectUnit(unit.id)} className="clickable"
                  style={{ outline: isSelected ? `2px solid var(--color-secondary)` : undefined }}>
                  <td style={{ color: isSelected ? "var(--color-secondary)" : undefined }}>{unit.Name}</td>
                  <td>{armyName(unit.ArmyId)}</td>
                  {side === "defender" && models && <>
                    <td>{models.Toughness}</td>
                    <td>{models.Wounds}</td>
                    <td>{models.Save}+</td>
                    <td>{models.InvulSave > 0 ? `${models.InvulSave}++` : "—"}</td>
                  </>}
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }} onClick={(e) => e.stopPropagation()}>
                    <button className="button button-icon" onClick={() => onEditUnit(unit)} style={{ marginRight: "0.25rem" }}>✏️</button>
                    {deleteConfirm === unit.id ? (
                      <>
                        <button className="button button-icon" onClick={() => onDeleteUnit(unit)} style={{ marginRight: "0.25rem" }}>Confirm</button>
                        <button className="button button-icon" onClick={onCancelDelete}>Cancel</button>
                      </>
                    ) : (
                      <button className="button button-icon" onClick={() => onDeleteUnit(unit)}>🗑️</button>
                    )}
                  </td>
                </tr>

                {/* Loadout sub-rows — only when unit is selected */}
                {isSelected && (
                  <>
                    {unit.Loadouts.map((l) => {
                      const isLoadoutSelected = selectedLoadoutId === l.id || (unit.Loadouts.length === 1);
                      return (
                        <tr key={`loadout-${l.id}`} onClick={() => onSelectLoadout(l.id)} className="clickable"
                          style={{ background: "var(--color-bg-darker)" }}>
                          <td colSpan={dataCols} style={{ paddingLeft: "2rem", color: isLoadoutSelected ? "var(--color-secondary)" : "var(--color-text-muted)", fontSize: "0.9rem" }}>
                            {l.Weapon.Name || "Unnamed"} <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>({l.Weapon.Type})</span>
                          </td>
                          <td style={{ textAlign: "right", whiteSpace: "nowrap", background: "var(--color-bg-darker)" }} onClick={(e) => e.stopPropagation()}>
                            <button className="button button-icon" onClick={() => onEditLoadout(unit, l)} style={{ marginRight: "0.25rem" }}>✏️</button>
                            {deleteConfirm === l.id ? (
                              <>
                                <button className="button button-icon" onClick={() => onDeleteLoadout(unit, l.id)} style={{ marginRight: "0.25rem" }}>Confirm</button>
                                <button className="button button-icon" onClick={onCancelDelete}>Cancel</button>
                              </>
                            ) : (
                              <button className="button button-icon" onClick={() => onDeleteLoadout(unit, l.id)}>🗑️</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Add loadout sub-row */}
                    <tr key="add-loadout" style={{ background: "var(--color-bg-darker)" }}>
                      <td colSpan={dataCols + 1} style={{ paddingLeft: "2rem" }}>
                        <a onClick={() => onAddLoadout(unit)} style={{ color: "var(--color-text-muted)", textDecoration: "underline", cursor: "pointer", fontSize: "0.85rem" }}>
                          + Add loadout
                        </a>
                      </td>
                    </tr>
                  </>
                )}
              </>
            );
          })}
        </tbody>
      </table>

      <button type="button" onClick={onAddUnit} className="button button-secondary">+ Add unit</button>

      {activeLoadout && selectedUnit && (
        <div style={{ marginTop: "1rem" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>{selectedUnit.Name}</h3>
          {side === "attacker" && <WeaponSummary loadout={activeLoadout} />}
          {side === "defender" && selectedUnit.Models && <ModelSummary models={selectedUnit.Models} />}
        </div>
      )}
    </div>
  );
}

// ─── Attack Modifier Panel ────────────────────────────────────────────────────

function AttackModifierPanel({ mods, weaponType, onChange, collapsed = false }: {
  mods: AttackModifiers;
  weaponType?: "Ranged" | "Melee";
  onChange: (m: AttackModifiers) => void;
  collapsed?: boolean;
}) {
  const [open, setOpen] = useState(!collapsed);
  const toggle = (key: keyof AttackModifiers) => onChange({ ...mods, [key]: !mods[key] });

  const Toggle = ({ modKey, label }: { modKey: keyof AttackModifiers; label: string }) => (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginBottom: "0.4rem" }}>
      <input type="checkbox" checked={!!mods[modKey]} onChange={() => toggle(modKey)} />
      {label}
    </label>
  );

  return (
    <div style={{ marginTop: "1rem" }}>
      <button type="button" onClick={() => setOpen((o) => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--color-text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.35rem" }}>
        {open ? "▾" : "▸"} Attack Modifiers
      </button>
      {open && (
        <div style={{ marginTop: "0.5rem" }}>
          <Toggle modKey="rerollHits" label="Reroll hits" />
          <Toggle modKey="rerollHitsOnes" label="Reroll hit 1s" />
          <Toggle modKey="critsOnFives" label="Crits on 5+" />
          <Toggle modKey="minusOneToHit" label="-1 to Hit" />
          <Toggle modKey="rerollWounds" label="Reroll wounds" />
          <Toggle modKey="rerollWoundsOnes" label="Reroll wound 1s" />
          <Toggle modKey="plusOneToWound" label="+1 to Wound" />
          <Toggle modKey="lethalHits" label="Lethal Hits" />
          <Toggle modKey="sustainedHits" label="Sustained Hits 1" />
          <Toggle modKey="devastatingWounds" label="Devastating Wounds" />
          {weaponType === "Ranged" && <Toggle modKey="blast" label="Blast" />}
          {weaponType === "Melee" && <Toggle modKey="cleave" label="Cleave" />}
        </div>
      )}
    </div>
  );
}

// ─── Defence Modifier Panel ───────────────────────────────────────────────────

function DefenceModifierPanel({ mods, weaponType, onChange, collapsed = false }: {
  mods: DefenceModifiers;
  weaponType?: "Ranged" | "Melee";
  onChange: (m: DefenceModifiers) => void;
  collapsed?: boolean;
}) {
  const [open, setOpen] = useState(!collapsed);
  const toggle = (key: keyof DefenceModifiers) => onChange({ ...mods, [key]: !mods[key] });

  const Toggle = ({ modKey, label, disabled = false }: { modKey: keyof DefenceModifiers; label: string; disabled?: boolean }) => (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: disabled ? "default" : "pointer", marginBottom: "0.4rem", opacity: disabled ? 0.4 : 1 }}>
      <input type="checkbox" checked={!!mods[modKey]} onChange={() => !disabled && toggle(modKey)} disabled={disabled} />
      {label}
    </label>
  );

  return (
    <div style={{ marginTop: "1rem" }}>
      <button type="button" onClick={() => setOpen((o) => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--color-text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.35rem" }}>
        {open ? "▾" : "▸"} Defensive Modifiers
      </button>
      {open && (
        <div style={{ marginTop: "0.5rem" }}>
          <Toggle modKey="hardToWound" label="Hard to Wound" />
          <Toggle modKey="cover" label="Cover (-1 to Hit)" disabled={weaponType === "Ranged"} />
        </div>
      )}
    </div>
  );
}

// ─── Summaries ────────────────────────────────────────────────────────────────

function WeaponSummary({ loadout }: { loadout: iLoadout }) {
  const w = loadout.Weapon;
  return (
    <div style={{ color: "var(--color-text-secondary)", background: "var(--color-accent-subtle)", borderRadius: "6px", padding: "0.75rem", marginBottom: "0.5rem" }}>
      <strong style={{ color: "var(--color-text-primary)" }}>{w.Name}</strong> <span style={{ color: "var(--color-text-muted)" }}>({w.Type})</span><br />
      A{w.Attacks} · {w.BSWS} · S{w.Strength} · AP-{w.AP} · D{w.Damage}
      {w.Abilities && <><br /><em style={{ color: "var(--color-text-muted)" }}>{w.Abilities}</em></>}
    </div>
  );
}

function ModelSummary({ models }: { models: iModelProfile }) {
  return (
    <div style={{ color: "var(--color-text-secondary)", background: "var(--color-accent-subtle)", borderRadius: "6px", padding: "0.75rem" }}>
      T{models.Toughness} · {models.Wounds}W · {models.Save}+ Sv
      {models.InvulSave > 0 && ` · ${models.InvulSave}++ Invuln`}
      {models.FeelNoPain > 0 && ` · ${models.FeelNoPain}+ FNP`}
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────

// Intensity scale: 0-25% blue, 25-50% green, 50-75% yellow, 75-90% orange, 90-100% red
function intensityColour(pct: number): string {
  if (pct >= 90) return "#dc2626"; // deep red
  if (pct >= 75) return "#ef4444"; // red
  if (pct >= 60) return "#f97316"; // orange
  if (pct >= 45) return "#f59e0b"; // amber
  if (pct >= 30) return "#eab308"; // yellow
  if (pct >= 15) return "#22c55e"; // green
  if (pct >= 5)  return "#14b8a6"; // teal
  return "#3b82f6";                // blue
}

function CalcResults({ result, attackerName, defenderName, defenderCount, isReturn = false }: {
  result: CalcResult; attackerName: string; defenderName: string; defenderCount: number; isReturn?: boolean;
}) {
  const killPct = Math.min(100, Math.round((result.avgModelsKilled / defenderCount) * 100));
  return (
    <div style={{ marginTop: "1.5rem", border: `1px solid ${isReturn ? "#f59e0b" : "var(--color-divider)"}`, borderRadius: "8px", padding: "1.5rem" }}>
      {isReturn && <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#f59e0b", marginBottom: "0.5rem" }}>↩ Return Strike</div>}
      <h3 style={{ marginBottom: "0.25rem" }}>{attackerName}</h3>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>~{result.avgModelsKilled} {defenderName.split(" — ")[0]} models killed</span>
          <span style={{ color: "var(--color-text-muted)" }}>{killPct}% of unit</span>
        </div>
        <div style={{ background: "var(--color-accent-subtle)", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
          <div style={{ background: intensityColour(killPct), width: `${killPct}%`, height: "100%", borderRadius: "4px", transition: "width 0.4s ease, background 0.4s ease" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <StatBox label="Attacks" value={result.totalAttacks} sub={`${result.hitProb}% hit`} />
        <StatBox label="Hits" value={result.avgHits} sub={`${result.woundProb}% wound`} />
        <StatBox label="Wounds" value={result.avgWounds} sub={`${result.saveFailProb}% fail sv`} />
        <StatBox label="Damage" value={result.avgDamage} sub={`${result.avgFailedSaves} get through`} />
      </div>
      <KillDistribution distribution={result.distribution} defenderCount={defenderCount} />
    </div>
  );
}

function KillDistribution({ distribution, defenderCount }: { distribution: number[]; defenderCount: number }) {
  const cumulative: { kills: number; prob: number }[] = [];
  for (let t = 1; t < distribution.length; t++) {
    const prob = distribution.slice(t).reduce((a, b) => a + b, 0);
    if (prob >= 0.005) cumulative.push({ kills: t, prob }); // don't cap here
  }
  if (cumulative.length === 0) return null;
  const maxProb = Math.max(...cumulative.map((d) => d.prob));
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Chance of killing X or more</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "100px" }}>
        {cumulative.map(({ kills, prob }) => {
          const heightPx = Math.max(3, Math.round((prob / maxProb) * 80));
          const pct = Math.min(99, Math.round(prob * 100));
          const colour = intensityColour(pct);
          return (
            <div key={kills} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
              <div style={{ fontSize: "0.65rem", color: colour, marginBottom: "2px", fontWeight: 600 }}>{pct}%</div>
              <div style={{ width: "100%", height: `${heightPx}px`, background: colour, borderRadius: "2px 2px 0 0", opacity: 0.85, flexShrink: 0 }} />
              <div style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "3px" }}>{kills}+</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>Models killed</div>
    </div>
  );
}

function StatBox({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div style={{ textAlign: "center", background: "var(--color-accent-subtle)", borderRadius: "6px", padding: "0.75rem" }}>
      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.25rem 0", color: "var(--color-text-primary)" }}>{value}</div>
      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{sub}</div>
    </div>
  );
}