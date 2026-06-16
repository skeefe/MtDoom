"use client";

import { useState } from "react";
import { iUnit, iModelProfile } from "../types/unit";
import TextField from "./text-field";

const emptyModels = (): iModelProfile => ({
  Toughness: 4, Wounds: 1, Save: 3, InvulSave: 0, FeelNoPain: 0,
});

interface UnitFormProps {
  armyId: string;
  unit?: iUnit;
  onSave: (unit: Omit<iUnit, "id">) => void;
  onCancel: () => void;
}

export default function UnitForm({ armyId, unit, onSave, onCancel }: UnitFormProps) {
  const [name, setName] = useState(unit?.Name ?? "");
  const [models, setModels] = useState<iModelProfile>(unit?.Models ?? emptyModels());

  const updateModels = (field: keyof iModelProfile, value: any) =>
    setModels((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ArmyId: armyId, Name: name, Models: models, Loadouts: unit?.Loadouts ?? [] });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Unit Name" type="text" id="unit-name" name="unit-name"
        value={name} emptyValue="e.g. Custodian Wardens" required
        changeFunction={(e) => setName(e.target.value)}
      />

      <fieldset style={{ marginTop: "1.5rem" }}>
        <legend>🛡️ Model Profile</legend>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <TextField label="Toughness" type="number" id="model-toughness" name="model-toughness"
            value={models.Toughness} emptyValue="4"
            changeFunction={(e) => updateModels("Toughness", parseInt(e.target.value))} />
          <TextField label="Wounds" type="number" id="model-wounds" name="model-wounds"
            value={models.Wounds} emptyValue="1"
            changeFunction={(e) => updateModels("Wounds", parseInt(e.target.value))} />
          <TextField label="Save (e.g. 3 for 3+)" type="number" id="model-save" name="model-save"
            value={models.Save} emptyValue="3"
            changeFunction={(e) => updateModels("Save", parseInt(e.target.value))} />
          <TextField label="Invuln (0 = none)" type="number" id="model-invuln" name="model-invuln"
            value={models.InvulSave} emptyValue="0"
            changeFunction={(e) => updateModels("InvulSave", parseInt(e.target.value))} />
          <TextField label="Feel No Pain (0 = none)" type="number" id="model-fnp" name="model-fnp"
            value={models.FeelNoPain} emptyValue="0"
            changeFunction={(e) => updateModels("FeelNoPain", parseInt(e.target.value))} />
        </div>
      </fieldset>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button type="submit" className="button">Save Unit</button>
        <button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}