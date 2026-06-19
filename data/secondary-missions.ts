import { selectOption } from "../app/types/select-option";

// 10th edition secondaries — kept for historical battle records
const secondaryMissions: selectOption[] = [
  { Label: "Secure No Man's Land", Value: "Secure No Man's Land", Active: true },
  { Label: "Capture Enemy Outpost", Value: "Capture Enemy Outpost", Active: true },
  { Label: "Extend Battle Lines", Value: "Extend Battle Lines", Active: true },
  { Label: "Defend Stronghold", Value: "Defend Stronghold", Active: true },
  { Label: "Investigate Signals", Value: "Investigate Signals", Active: true },
  { Label: "Overwhelming Force", Value: "Overwhelming Force", Active: true },
  { Label: "No Prisoners", Value: "No Prisoners", Active: true },
  { Label: "A Tempting Target", Value: "A Tempting Target", Active: true },
  { Label: "Area Denial", Value: "Area Denial", Active: true },
  { Label: "Bring It Down", Value: "Bring It Down", Active: true },
  { Label: "Storm Hostile Objective", Value: "Storm Hostile Objective", Active: true },
  { Label: "Engage on All Fronts", Value: "Engage on All Fronts", Active: true },
  { Label: "Behind Enemy Lines", Value: "Behind Enemy Lines", Active: true },
  { Label: "Assassination", Value: "Assassination", Active: true },
  { Label: "Cleanse", Value: "Cleanse", Active: true },
  { Label: "Deploy Teleport Homer", Value: "Deploy Teleport Homer", Active: true },
  { Label: "Cull the Horde", Value: "Cull the Horde", Active: true },
  { Label: "Establish Locus", Value: "Establish Locus", Active: true },
  { Label: "Recover Assets", Value: "Recover Assets", Active: true },
  { Label: "Marked for Death", Value: "Marked for Death", Active: true },
  { Label: "Sabotage", Value: "Sabotage", Active: true },
  { Label: "Containment", Value: "Containment", Active: true },
  { Label: "Display of Might", Value: "Display of Might", Active: true },
];

// 11th edition secondaries — all 18
const secondaryMissions11: selectOption[] = [
  { Label: "A Grievous Blow", Value: "A Grievous Blow", Active: true },       // Fixed only
  { Label: "A Tempting Target", Value: "A Tempting Target", Active: true },
  { Label: "Assassination", Value: "Assassination", Active: true },             // Fixed only
  { Label: "Beacon", Value: "Beacon", Active: true },
  { Label: "Behind Enemy Lines", Value: "Behind Enemy Lines", Active: true },
  { Label: "Bring It Down", Value: "Bring It Down", Active: true },             // Fixed only
  { Label: "Burden of Trust", Value: "Burden of Trust", Active: true },
  { Label: "Centre Ground", Value: "Centre Ground", Active: true },
  { Label: "Cleanse", Value: "Cleanse", Active: true },
  { Label: "Defend Stronghold", Value: "Defend Stronghold", Active: true },
  { Label: "Display of Might", Value: "Display of Might", Active: true },
  { Label: "Engage on All Fronts", Value: "Engage on All Fronts", Active: true }, // Fixed only
  { Label: "Forward Position", Value: "Forward Position", Active: true },
  { Label: "No Prisoners", Value: "No Prisoners", Active: true },
  { Label: "Outflank", Value: "Outflank", Active: true },
  { Label: "Overwhelming Force", Value: "Overwhelming Force", Active: true },
  { Label: "Plunder", Value: "Plunder", Active: true },
  { Label: "Secure No Man's Land", Value: "Secure No Man's Land", Active: true },
];

// Tactical pool — all 18 (can draw any card)
const secondaryMissions11Tactical: selectOption[] = secondaryMissions11;

// Fixed pool — only the 4 Fixed-only cards
const secondaryMissions11Fixed: selectOption[] = secondaryMissions11.filter(s =>
  ["A Grievous Blow", "Assassination", "Bring It Down", "Engage on All Fronts"].includes(s.Value)
);

export { secondaryMissions, secondaryMissions11, secondaryMissions11Tactical, secondaryMissions11Fixed };