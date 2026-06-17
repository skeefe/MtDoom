"use client";

import { useState } from "react";
import { iLoadout, iWeapon } from "../types/unit";
import TextField from "./text-field";
import SelectField from "./select-field";

const emptyWeapon = (): iWeapon => ({
  Name: "", Type: "Ranged", Attacks: "1", BSWS: "3+",
  Strength: 4, AP: 0, Damage: "1", Abilities: [], Notes: "",
});

const weaponTypeOptions = [
  { Value: "Ranged", Label: "Ranged", Active: true },
  { Value: "Melee", Label: "Melee", Active: true },
];

const bswsOptions = [
  { Value: "2+", Label: "2+", Active: true },
  { Value: "3+", Label: "3+", Active: true },
  { Value: "4+", Label: "4+", Active: true },
  { Value: "5+", Label: "5+", Active: true },
  { Value: "6+", Label: "6+", Active: true },
];

const apOptions = [
  { Value: "0", Label: "0", Active: true },
  { Value: "1", Label: "-1", Active: true },
  { Value: "2", Label: "-2", Active: true },
  { Value: "3", Label: "-3", Active: true },
  { Value: "4", Label: "-4", Active: true },
  { Value: "5", Label: "-5", Active: true },
  { Value: "6", Label: "-6", Active: true },
];

const RANGED_ABILITIES = [
  "Assault", "Heavy", "Pistol", "Rapid Fire", "Torrent", "Indirect Fire",
  "Blast", "Lethal Hits", "Sustained Hits", "Devastating Wounds", "Twin-linked",
  "Anti-Infantry", "Anti-Monster", "Anti-Vehicle", "Anti-Fly",
  "Precision",
];

const MELEE_ABILITIES = [
  "Lance", "Cleave", "Fights First",
  "Lethal Hits", "Sustained Hits", "Devastating Wounds",
  "Precision",
  "Anti-Infantry", "Anti-Monster", "Anti-Vehicle",
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

  const toggleAbility = (ability: string) => {
    const current = weapon.Abilities ?? [];
    const updated = current.includes(ability)
      ? current.filter((a) => a !== ability)
      : [...current, ability];
    updateWeapon("Abilities", updated);
  };

  const abilities = weapon.Type === "Ranged" ? RANGED_ABILITIES : MELEE_ABILITIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: loadout?.id ?? crypto.randomUUID(), Name: weapon.Name, Weapon: weapon });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <TextField
            label="Weapon Name" type="text" id="weapon-name" name="weapon-name"
            value={weapon.Name} emptyValue="e.g. Guardian Spear" required
            changeFunction={(e) => updateWeapon("Name", e.target.value)}
          />
        </div>
        <SelectField label="Type" id="weapon-type" name="weapon-type"
          value={weapon.Type} emptyValue="Select type"
          options={weaponTypeOptions} hideEmpty
          changeFunction={(e) => updateWeapon("Type", e.target.value)} />
        <TextField label="Attacks" type="text" id="weapon-attacks" name="weapon-attacks"
          value={weapon.Attacks} emptyValue="e.g. 3, D6, 2D3"
          changeFunction={(e) => updateWeapon("Attacks", e.target.value)} />
        <SelectField label="BS / WS" id="weapon-bsws" name="weapon-bsws"
          value={weapon.BSWS} emptyValue="Select"
          options={bswsOptions} hideEmpty
          changeFunction={(e) => updateWeapon("BSWS", e.target.value)} />
        <TextField label="Strength" type="number" id="weapon-strength" name="weapon-strength"
          value={weapon.Strength} emptyValue="4"
          changeFunction={(e) => updateWeapon("Strength", parseInt(e.target.value))} />
        <SelectField label="AP" id="weapon-ap" name="weapon-ap"
          value={String(weapon.AP)} emptyValue="Select"
          options={apOptions} hideEmpty
          changeFunction={(e) => updateWeapon("AP", parseInt(e.target.value))} />
        <TextField label="Damage" type="text" id="weapon-damage" name="weapon-damage"
          value={weapon.Damage} emptyValue="e.g. 1, D3, D6"
          changeFunction={(e) => updateWeapon("Damage", e.target.value)} />
      </div>

      {/* Abilities */}
      <div style={{ marginTop: "1.5rem" }}>
        <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>Abilities</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
          {abilities.map((ability) => (
            <label key={ability} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={(weapon.Abilities ?? []).includes(ability)}
                onChange={() => toggleAbility(ability)}
              />
              {ability}
            </label>
          ))}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <TextField
            label="Other notes (optional)" type="text" id="weapon-notes" name="weapon-notes"
            value={weapon.Notes ?? ""} emptyValue="e.g. Supercharge"
            changeFunction={(e) => updateWeapon("Notes", e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button type="submit" className="button">Save</button>
        <button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}