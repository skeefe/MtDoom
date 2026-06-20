// 11th Edition — Force Disposition Matrix & Derived Data
// Armageddon Chapter Approved
// Single source of truth for all 11th edition primary mission data

import { selectOption } from "../app/types/select-option";

export type ForceDisposition =
  | "Take and Hold"
  | "Purge the Foe"
  | "Disruption"
  | "Reconnaissance"
  | "Priority Assets";

export const dispositions: ForceDisposition[] = [
  "Take and Hold",
  "Purge the Foe",
  "Disruption",
  "Reconnaissance",
  "Priority Assets",
];

export const dispositionMatrix: Record<ForceDisposition, Record<ForceDisposition, string>> = {
  "Take and Hold": {
    "Take and Hold": "Battlefield Dominance",
    "Purge the Foe": "Immovable Object",
    "Disruption": "Determined Acquisition",
    "Reconnaissance": "Purge and Secure",
    "Priority Assets": "Inescapable Dominion",
  },
  "Purge the Foe": {
    "Take and Hold": "Unstoppable Force",
    "Purge the Foe": "Meatgrinder",
    "Disruption": "Punishment",
    "Reconnaissance": "Consecrate",
    "Priority Assets": "Destroyer's Wrath",
  },
  "Disruption": {
    "Take and Hold": "Death Trap",
    "Purge the Foe": "Delaying Action",
    "Disruption": "Outmanoeuvre",
    "Reconnaissance": "Smoke and Mirrors",
    "Priority Assets": "Locate and Deny",
  },
  "Reconnaissance": {
    "Take and Hold": "Reconnaissance Sweep",
    "Purge the Foe": "Triangulation",
    "Disruption": "Surveil the Foe",
    "Reconnaissance": "Gather Intel",
    "Priority Assets": "Search and Scour",
  },
  "Priority Assets": {
    "Take and Hold": "Secure Asset",
    "Purge the Foe": "Vital Link",
    "Disruption": "Extract Relic",
    "Reconnaissance": "Vanguard Operation",
    "Priority Assets": "Sabotage",
  },
};

// Disposition name → image folder slug
export const dispositionToDeck: Record<ForceDisposition, string> = {
  "Take and Hold": "take-and-hold",
  "Purge the Foe": "purge-the-foe",
  "Disruption": "disruption",
  "Reconnaissance": "reconnaissance",
  "Priority Assets": "priority-assets",
};

// Double-sided missions (have a -back.png Objective Action side)
export const doubleSidedMissions: Set<string> = new Set([
  "Death Trap",
  "Smoke and Mirrors",
  "Locate and Deny",
  "Triangulation",
  "Surveil the Foe",
  "Gather Intel",
  "Secure Asset",
  "Vital Link",
  "Extract Relic",
  "Vanguard Operation",
  "Sabotage",
]);

// Convert mission name to image filename slug
// e.g. "Battlefield Dominance" → "battlefield-dominance"
export const missionNameToSlug = (name: string): string =>
  name.toLowerCase().replace(/'/g, "").replace(/\s+/g, "-");

// Get image path(s) for a mission given the player's disposition
export const getMissionImages = (
  missionName: string,
  yourDisposition: ForceDisposition
): { front: string; back?: string } => {
  const deck = dispositionToDeck[yourDisposition];
  const slug = missionNameToSlug(missionName);
  const front = `/11th/primary-missions/${deck}/${slug}.png`;
  const back = doubleSidedMissions.has(missionName)
    ? `/11th/primary-missions/${deck}/${slug}-back.png`
    : undefined;
  return { front, back };
};

// Derived select options
export const primaryMissions11: selectOption[] = Object.values(dispositionMatrix)
  .flatMap((row) => Object.values(row))
  .filter((v, i, a) => a.indexOf(v) === i)
  .map((name) => ({ Label: name, Value: name, Active: true }));