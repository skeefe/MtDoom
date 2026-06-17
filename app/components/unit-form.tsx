"use client";

import { useState } from "react";
import { iUnit, iModelProfile, UnitType } from "../types/unit";
import TextField from "./text-field";
import SelectField from "./select-field";

const emptyModels = (): iModelProfile => ({
  Toughness: 4, Wounds: 1, Save: 3, InvulSave: 0, FeelNoPain: 0,
});

const saveOptions = [
  { Value: "2", Label: "2+", Active: true },
  { Value: "3", Label: "3+", Active: true },
  { Value: "4", Label: "4+", Active: true },
  { Value: "5", Label: "5+", Active: true },
  { Value: "6", Label: "6+", Active: true },
];

const invulnOptions = [
  { Value: "0", Label: "N/A", Active: true },
  { Value: "2", Label: "2++", Active: true },
  { Value: "3", Label: "3++", Active: true },
  { Value: "4", Label: "4++", Active: true },
  { Value: "5", Label: "5++", Active: true },
  { Value: "6", Label: "6++", Active: true },
];

const fnpOptions = [
  { Value: "0", Label: "N/A", Active: true },
  { Value: "4", Label: "4+", Active: true },
  { Value: "5", Label: "5+", Active: true },
  { Value: "6", Label: "6+", Active: true },
];

const unitTypeOptions = [
  { Value: "Infantry", Label: "Infantry", Active: true },
  { Value: "Beast", Label: "Beast", Active: true },
  { Value: "Swarm", Label: "Swarm", Active: true },
  { Value: "Vehicle", Label: "Vehicle", Active: true },
  { Value: "Monster", Label: "Monster", Active: true },
  { Value: "Titanic", Label: "Titanic", Active: true },
];

interface Army { id: string; Name: string; Emoji?: string; }

interface UnitFormProps {
  armyId: string;
  armies: Army[];
  unit?: iUnit;
  onSave: (unit: Omit<iUnit, "id">) => void;
  onCancel: () => void;
}

export default function UnitForm({ armyId, armies, unit, onSave, onCancel }: UnitFormProps) {
  const [selectedArmyId, setSelectedArmyId] = useState(armyId);
  const [name, setName] = useState(unit?.Name ?? "");
  const [type, setType] = useState<UnitType | "">(unit?.Type ?? "");
  const [models, setModels] = useState<iModelProfile>(unit?.Models ?? emptyModels());

  const updateModels = (field: keyof iModelProfile, value: any) =>
    setModels((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ArmyId: selectedArmyId, Name: name, Type: type as UnitType, Models: models, Loadouts: unit?.Loadouts ?? [] });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <TextField
          label="Unit Name" type="text" id="unit-name" name="unit-name"
          value={name} emptyValue="e.g. Custodian Wardens" required
          changeFunction={(e) => setName(e.target.value)}
        />
        <SelectField
          label="Army" id="unit-army" name="unit-army"
          value={selectedArmyId} emptyValue="Select army"
          options={armies.map((a) => ({ Value: a.id, Label: `${a.Emoji ?? ""} ${a.Name}`.trim(), Active: true }))}
          hideEmpty
          changeFunction={(e) => setSelectedArmyId(e.target.value)}
        />
        <SelectField
          label="Type" id="unit-type" name="unit-type"
          value={type} emptyValue="Select type"
          options={unitTypeOptions}
          changeFunction={(e) => setType(e.target.value as UnitType)}
        />
        <TextField label="Toughness" type="number" id="model-toughness" name="model-toughness"
          value={models.Toughness} emptyValue="4"
          changeFunction={(e) => updateModels("Toughness", parseInt(e.target.value))} />
        <TextField label="Wounds" type="number" id="model-wounds" name="model-wounds"
          value={models.Wounds} emptyValue="1"
          changeFunction={(e) => updateModels("Wounds", parseInt(e.target.value))} />
        <SelectField label="Save" id="model-save" name="model-save"
          value={String(models.Save)} emptyValue="Select save"
          options={saveOptions} hideEmpty
          changeFunction={(e) => updateModels("Save", parseInt(e.target.value) || 0)} />
        <SelectField label="Invuln" id="model-invuln" name="model-invuln"
          value={String(models.InvulSave)} emptyValue="Select invuln"
          options={invulnOptions} hideEmpty
          changeFunction={(e) => updateModels("InvulSave", parseInt(e.target.value) || 0)} />
        <SelectField label="Feel No Pain" id="model-fnp" name="model-fnp"
          value={String(models.FeelNoPain)} emptyValue="Select FNP"
          options={fnpOptions} hideEmpty
          changeFunction={(e) => updateModels("FeelNoPain", parseInt(e.target.value) || 0)} />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button type="submit" className="button">Save Unit</button>
        <button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}