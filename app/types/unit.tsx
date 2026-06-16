export interface iWeapon {
  Name: string;
  Type: "Ranged" | "Melee";
  Attacks: string;
  BSWS: string;
  Strength: number;
  AP: number;
  Damage: string;
  Abilities: string;
}

export interface iModelProfile {
  Toughness: number;
  Wounds: number;
  Save: number;
  InvulSave: number;
  FeelNoPain: number;
}

export interface iLoadout {
  id: string;
  Name: string;
  Weapon: iWeapon;
}

export interface iUnit {
  id: string;
  ArmyId: string;
  Name: string;
  Models: iModelProfile;
  Loadouts: iLoadout[];
}