"use client";

import { useState } from "react";
import { iLoadout, iWeapon } from "../types/unit";
import TextField from "./text-field";
import SelectField from "./select-field";

const emptyWeapon = (): iWeapon => ({
  Name: "", Type: "Ranged", Attacks: "1", BSWS: "3+",
  Strength: 4, AP: 0, Damage: "1", Abilities: "",
});

const weaponTypeOptions = [
  { Value: "Ranged", Label: "Ranged", Active: true },
  { Value: "Melee", Label: "Melee", Active: true },
];

interface LoadoutFormProps {
  loadout?: iLoadout;
  onSave: (loadout: iLoadout) => void;
  onCancel: () => void;
}

export default function LoadoutForm({ loadout, onSave, onCancel }: LoadoutFormProps) {
  const [weapon, setWeapon] = useState<iWeapon>(loadout?.Weapon ?? emptyWeapon());

  const updateWeapon = (field: keyof iWeapon, value: any) =>
    setWeapon((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Loadout name = weapon name
    onSave({
      id: loadout?.id ?? crypto.randomUUID(),
      Name: weapon.Name,
      Weapon: weapon,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Weapon Name" type="text" id="weapon-name" name="weapon-name"
        value={weapon.Name} emptyValue="e.g. Guardian Spear" required
        changeFunction={(e) => updateWeapon("Name", e.target.value)}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "0.75rem" }}>
        <SelectField label="Type" id="weapon-type" name="weapon-type"
          value={weapon.Type} emptyValue="Select type"
          options={weaponTypeOptions} hideEmpty
          changeFunction={(e) => updateWeapon("Type", e.target.value)} />
        <TextField label="Attacks" type="text" id="weapon-attacks" name="weapon-attacks"
          value={weapon.Attacks} emptyValue="e.g. 3, D6, 2D3"
          changeFunction={(e) => updateWeapon("Attacks", e.target.value)} />
        <TextField label="BS / WS" type="text" id="weapon-bsws" name="weapon-bsws"
          value={weapon.BSWS} emptyValue="e.g. 3+"
          changeFunction={(e) => updateWeapon("BSWS", e.target.value)} />
        <TextField label="Strength" type="number" id="weapon-strength" name="weapon-strength"
          value={weapon.Strength} emptyValue="4"
          changeFunction={(e) => updateWeapon("Strength", parseInt(e.target.value))} />
        <TextField label="AP (e.g. 1 for -1)" type="number" id="weapon-ap" name="weapon-ap"
          value={weapon.AP} emptyValue="0"
          changeFunction={(e) => updateWeapon("AP", parseInt(e.target.value))} />
        <TextField label="Damage" type="text" id="weapon-damage" name="weapon-damage"
          value={weapon.Damage} emptyValue="e.g. 2, D3, D6"
          changeFunction={(e) => updateWeapon("Damage", e.target.value)} />
      </div>
      <div style={{ marginTop: "0.75rem" }}>
        <TextField label="Abilities (optional)" type="text" id="weapon-abilities" name="weapon-abilities"
          value={weapon.Abilities} emptyValue="e.g. LETHAL HITS, SUSTAINED HITS 1"
          changeFunction={(e) => updateWeapon("Abilities", e.target.value)} />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button type="submit" className="button">Save</button>
        <button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}