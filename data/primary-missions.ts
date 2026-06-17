import { selectOption } from "../app/types/select-option";

// 10th edition missions — kept for historical battle records
const primaryMissions: selectOption[] = [
  { Label: "Priority Targets", Value: "Priority Targets", Active: true },
  { Label: "Vital Ground", Value: "Vital Ground", Active: true },
  { Label: "Scorched Earth", Value: "Scorched Earth", Active: true },
  { Label: "Purge the Foe", Value: "Purge the Foe", Active: true },
  { Label: "Take and Hold", Value: "Take and Hold", Active: true },
  { Label: "Supply Drop", Value: "Supply Drop", Active: true },
  { Label: "The Ritual", Value: "The Ritual", Active: true },
  { Label: "Deploy Servo-Skulls", Value: "Deploy Servo-Skulls", Active: true },
  { Label: "Sites of Power", Value: "Sites of Power", Active: true },
  { Label: "Unexploded Ordnance", Value: "Unexploded Ordnance", Active: true },
  { Label: "Burden of Trust", Value: "Burden of Trust", Active: true },
  { Label: "Terraform", Value: "Terraform", Active: true },
  { Label: "Linchpin", Value: "Linchpin", Active: true },
  { Label: "Hidden Supplies", Value: "Hidden Supplies", Active: true },
];

// 11th edition missions — Armageddon Chapter Approved
const primaryMissions11: selectOption[] = [
  // Take and Hold
  { Label: "Battlefield Dominance", Value: "Battlefield Dominance", Active: true },
  { Label: "Determined Acquisition", Value: "Determined Acquisition", Active: true },
  { Label: "Immovable Object", Value: "Immovable Object", Active: true },
  { Label: "Inescapable Dominion", Value: "Inescapable Dominion", Active: true },
  { Label: "Purge and Secure", Value: "Purge and Secure", Active: true },
  // Purge the Foe
  { Label: "Consecrate", Value: "Consecrate", Active: true },
  { Label: "Destroyer's Wrath", Value: "Destroyer's Wrath", Active: true },
  { Label: "Meatgrinder", Value: "Meatgrinder", Active: true },
  { Label: "Punishment", Value: "Punishment", Active: true },
  { Label: "Unstoppable Force", Value: "Unstoppable Force", Active: true },
  // Reconnaissance
  { Label: "Gather Intel", Value: "Gather Intel", Active: true },
  { Label: "Reconnaissance Sweep", Value: "Reconnaissance Sweep", Active: true },
  { Label: "Search and Scour", Value: "Search and Scour", Active: true },
  { Label: "Surveil the Foe", Value: "Surveil the Foe", Active: true },
  { Label: "Triangulation", Value: "Triangulation", Active: true },
  // Priority Assets
  { Label: "Extract Relic", Value: "Extract Relic", Active: true },
  { Label: "Sabotage", Value: "Sabotage", Active: true },
  { Label: "Secure Asset", Value: "Secure Asset", Active: true },
  { Label: "Vanguard Operation", Value: "Vanguard Operation", Active: true },
  { Label: "Vital Link", Value: "Vital Link", Active: true },
  // Disruption
  { Label: "Death Trap", Value: "Death Trap", Active: true },
  { Label: "Delaying Action", Value: "Delaying Action", Active: true },
  { Label: "Locate and Deny", Value: "Locate and Deny", Active: true },
  { Label: "Outmanoeuvre", Value: "Outmanoeuvre", Active: true },
  { Label: "Smoke and Mirrors", Value: "Smoke and Mirrors", Active: true },
];

export { primaryMissions, primaryMissions11 };