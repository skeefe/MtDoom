import { selectOption } from "../app/types/select-option";

// Fixed-only secondary missions (available in both Tactical and Fixed pools)
const fixedOnlySecondaries = new Set([
  "A Grievous Blow",
  "Assassination",
  "Bring It Down",
  "Engage on All Fronts",
]);

// 11th edition secondaries — all 18, single source of truth
const secondaryMissions11: selectOption[] = [
  { Label: "A Grievous Blow", Value: "A Grievous Blow", Active: true },
  { Label: "A Tempting Target", Value: "A Tempting Target", Active: true },
  { Label: "Assassination", Value: "Assassination", Active: true },
  { Label: "Beacon", Value: "Beacon", Active: true },
  { Label: "Behind Enemy Lines", Value: "Behind Enemy Lines", Active: true },
  { Label: "Bring It Down", Value: "Bring It Down", Active: true },
  { Label: "Burden of Trust", Value: "Burden of Trust", Active: true },
  { Label: "Centre Ground", Value: "Centre Ground", Active: true },
  { Label: "Cleanse", Value: "Cleanse", Active: true },
  { Label: "Defend Stronghold", Value: "Defend Stronghold", Active: true },
  { Label: "Display of Might", Value: "Display of Might", Active: true },
  { Label: "Engage on All Fronts", Value: "Engage on All Fronts", Active: true },
  { Label: "Forward Position", Value: "Forward Position", Active: true },
  { Label: "No Prisoners", Value: "No Prisoners", Active: true },
  { Label: "Outflank", Value: "Outflank", Active: true },
  { Label: "Overwhelming Force", Value: "Overwhelming Force", Active: true },
  { Label: "Plunder", Value: "Plunder", Active: true },
  { Label: "Secure No Man's Land", Value: "Secure No Man's Land", Active: true },
];

// Tactical pool — all 18
const secondaryMissions11Tactical: selectOption[] = secondaryMissions11;

// Fixed pool — derived from the fixed-only set
const secondaryMissions11Fixed: selectOption[] = secondaryMissions11.filter((s) =>
  fixedOnlySecondaries.has(s.Value)
);

export { secondaryMissions11, secondaryMissions11Tactical, secondaryMissions11Fixed };