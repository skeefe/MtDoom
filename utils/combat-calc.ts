import { iWeapon, iModelProfile } from "../app/types/unit";

const ITERATIONS = 10000;

export function parseDiceAverage(value: string): number {
  if (!value) return 0;
  const str = value.toString().trim().toUpperCase();
  const match = str.match(/^(\d*)D(\d+)([+-]\d+)?$/);
  if (match) {
    const multiplier = match[1] ? parseInt(match[1]) : 1;
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    return multiplier * ((sides + 1) / 2) + modifier;
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function rollDice(value: string): number {
  if (!value) return 0;
  const str = value.toString().trim().toUpperCase();
  const match = str.match(/^(\d*)D(\d+)([+-]\d+)?$/);
  if (match) {
    const multiplier = match[1] ? parseInt(match[1]) : 1;
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    let total = modifier;
    for (let i = 0; i < multiplier; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    return Math.max(0, total);
  }
  return Math.max(0, parseInt(str) || 0);
}

function d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function parseBSWS(value: string): number {
  if (!value) return 7;
  const match = value.toString().match(/(\d+)/);
  return match ? parseInt(match[1]) : 7;
}

export function woundThreshold(strength: number, toughness: number): number {
  if (strength >= toughness * 2) return 2;
  if (strength > toughness) return 3;
  if (strength === toughness) return 4;
  if (strength * 2 <= toughness) return 6;
  return 5;
}

export function saveThreshold(save: number, invuln: number, ap: number): number {
  const armourSave = save + ap;
  const effectiveArmour = armourSave > 6 ? 7 : armourSave;
  const effectiveInvuln = invuln === 0 ? 7 : invuln;
  return Math.min(effectiveArmour, effectiveInvuln);
}

export function prob(threshold: number): number {
  if (threshold <= 1) return 1;
  if (threshold > 6) return 0;
  return (7 - threshold) / 6;
}

export interface CalcModifiers {
  // Attacker modifiers
  rerollHits?: boolean;
  rerollHitsOnes?: boolean;
  rerollWounds?: boolean;
  rerollWoundsOnes?: boolean;
  lethalHits?: boolean;
  sustainedHits?: number;       // number of extra hits on crit (usually 1)
  devastatingWounds?: boolean;
  minusOneToHit?: boolean;      // attacker suffers -1 to hit
  critsOnFives?: boolean;       // crits trigger on 5+ instead of 6+
  blast?: boolean;              // ranged: +1 attack per 5 defender models
  cleave?: boolean;             // melee: same as blast

  // Defender modifiers
  hardToWound?: boolean;        // +1 to wound roll threshold
  cover?: boolean;              // -1 to hit (melee only, 11th ed)
  plusOneToWound?: boolean;     // attacker: -1 to wound threshold (easier to wound)
}

export interface CalcResult {
  avgHits: number;
  avgWounds: number;
  avgFailedSaves: number;
  avgDamage: number;
  avgModelsKilled: number;
  distribution: number[];
  hitProb: number;
  woundProb: number;
  saveFailProb: number;
  avgDamagePerHit: number;
  totalAttacks: number;
  effectiveSave: number;
}

function runIteration(
  attacker: iWeapon,
  attackerCount: number,
  defender: iModelProfile,
  defenderCount: number,
  modifiers: CalcModifiers
): { hits: number; wounds: number; failedSaves: number; damage: number; modelsKilled: number } {
  const {
    rerollHits = false,
    rerollHitsOnes = false,
    rerollWounds = false,
    rerollWoundsOnes = false,
    lethalHits = false,
    sustainedHits = 0,
    devastatingWounds = false,
    minusOneToHit = false,
    critsOnFives = false,
    blast = false,
    cleave = false,
    hardToWound = false,
    cover = false,
    plusOneToWound = false,
  } = modifiers;

  const bsws = parseBSWS(attacker.BSWS);
  const effectiveBSWS = minusOneToHit || cover ? bsws + 1 : bsws;
  const critThreshold = critsOnFives ? 5 : 6;

  // Wound threshold — hard to wound +1 (harder), plusOneToWound -1 (easier)
  const baseWoundThresh = woundThreshold(attacker.Strength, defender.Toughness);
  const woundThresh = hardToWound
    ? Math.min(baseWoundThresh + 1, 6)
    : plusOneToWound
    ? Math.max(baseWoundThresh - 1, 2)
    : baseWoundThresh;

  const effectiveSave = saveThreshold(defender.Save, defender.InvulSave, attacker.AP);

  // Blast / Cleave bonus attacks
  const isRanged = attacker.Type === "Ranged";
  const isMelee = attacker.Type === "Melee";
  const blastBonus = (blast && isRanged) || (cleave && isMelee)
    ? Math.floor(defenderCount / 5)
    : 0;

  const totalAttacks = (rollDice(attacker.Attacks) + blastBonus) * attackerCount;

  let hits = 0;
  let autoWounds = 0;

  for (let i = 0; i < totalAttacks; i++) {
    const roll = d6();
    const isCrit = roll >= critThreshold;
    let hit = roll >= effectiveBSWS;

    if (!hit && rerollHits) {
      const reroll = d6();
      hit = reroll >= effectiveBSWS;
      if (hit && reroll >= critThreshold) {
        // Rerolled into a crit
        if (lethalHits) { autoWounds++; hits += sustainedHits; continue; }
        hits += 1 + sustainedHits;
        continue;
      }
    } else if (!hit && rerollHitsOnes && roll === 1) {
      const reroll = d6();
      hit = reroll >= effectiveBSWS;
      if (hit && reroll >= critThreshold) {
        if (lethalHits) { autoWounds++; hits += sustainedHits; continue; }
        hits += 1 + sustainedHits;
        continue;
      }
    }

    if (hit) {
      if (isCrit) {
        if (lethalHits) {
          autoWounds++;
          hits += sustainedHits;
        } else {
          hits += 1 + sustainedHits;
        }
      } else {
        hits++;
      }
    }
  }

  // Wound rolls
  let wounds = autoWounds;
  for (let i = 0; i < hits; i++) {
    const roll = d6();
    let wound = roll >= woundThresh;

    if (!wound && rerollWounds) {
      wound = d6() >= woundThresh;
    } else if (!wound && rerollWoundsOnes && roll === 1) {
      wound = d6() >= woundThresh;
    }

    if (wound) wounds++;
  }

  // Saves & damage allocation
  let failedSaves = 0;
  let totalDamage = 0;
  let modelsKilled = 0;
  let remainingWounds = defender.Wounds;
  let modelsLeft = defenderCount;

  for (let i = 0; i < wounds; i++) {
    if (modelsLeft === 0) break;

    const roll = d6();
    const isCritWound = devastatingWounds && roll === 6;
    const saved = !isCritWound && effectiveSave <= 6 && roll >= effectiveSave;

    if (saved) continue;

    failedSaves++;
    const dmg = rollDice(attacker.Damage);

    let dmgRemaining = dmg;
    while (dmgRemaining > 0 && modelsLeft > 0) {
      let actualDmg = 0;
      for (let d = 0; d < dmgRemaining; d++) {
        if (defender.FeelNoPain > 0 && d6() >= defender.FeelNoPain) {
          // saved by FNP
        } else {
          actualDmg++;
        }
      }

      totalDamage += actualDmg;

      if (actualDmg >= remainingWounds) {
        modelsKilled++;
        modelsLeft--;
        dmgRemaining = 0;
        remainingWounds = defender.Wounds;
      } else {
        remainingWounds -= actualDmg;
        dmgRemaining = 0;
      }
    }
  }

  return { hits: hits + autoWounds, wounds, failedSaves, damage: totalDamage, modelsKilled };
}

export function calcCombat(
  attacker: iWeapon,
  attackerCount: number,
  defender: iModelProfile,
  defenderCount: number,
  modifiers: CalcModifiers = {}
): CalcResult {
  const {
    rerollHits = false, rerollHitsOnes = false,
    rerollWounds = false, rerollWoundsOnes = false,
    lethalHits = false, sustainedHits = 0, devastatingWounds = false,
    minusOneToHit = false, critsOnFives = false,
    blast = false, cleave = false,
    hardToWound = false, cover = false, plusOneToWound = false,
  } = modifiers;

  const isRanged = attacker.Type === "Ranged";
  const isMelee = attacker.Type === "Melee";
  const blastBonus = (blast && isRanged) || (cleave && isMelee) ? Math.floor(defenderCount / 5) : 0;
  const totalAttacks = (parseDiceAverage(attacker.Attacks) + blastBonus) * attackerCount;

  const bsws = parseBSWS(attacker.BSWS);
  const effectiveBSWS = minusOneToHit || cover ? bsws + 1 : bsws;
  const critThreshold = critsOnFives ? 5 : 6;

  // ── Exact hit probability ──────────────────────────────────────────────────
  const pHitBase = prob(effectiveBSWS);
  const pCrit = prob(critThreshold);
  const pNonCritHit = pHitBase - pCrit; // hit but not crit

  let pHit = pHitBase;
  if (rerollHits) pHit = pHitBase + (1 - pHitBase) * pHitBase;
  else if (rerollHitsOnes) pHit = pHitBase + (1/6) * pHitBase;

  // Effective hits per attack including sustained hits and lethal hits
  const pCritFinal = rerollHits
    ? pCrit + (1 - pHitBase) * pCrit
    : rerollHitsOnes
    ? pCrit + (1/6) * pCrit
    : pCrit;

  const hitsPerAttack = pHit + (sustainedHits > 0 ? pCritFinal * sustainedHits : 0);
  const autoWoundsPerAttack = lethalHits ? pCritFinal : 0;
  const normalHitsPerAttack = hitsPerAttack - autoWoundsPerAttack;

  const exactHits = totalAttacks * hitsPerAttack;

  // ── Exact wound probability ────────────────────────────────────────────────
  const baseWoundThresh = woundThreshold(attacker.Strength, defender.Toughness);
  const woundThresh = hardToWound
    ? Math.min(baseWoundThresh + 1, 6)
    : plusOneToWound
    ? Math.max(baseWoundThresh - 1, 2)
    : baseWoundThresh;

  let pWound = prob(woundThresh);
  if (rerollWounds) pWound = pWound + (1 - pWound) * pWound;
  else if (rerollWoundsOnes) pWound = pWound + (1/6) * pWound;

  const woundsFromNormalHits = totalAttacks * normalHitsPerAttack * pWound;
  const woundsFromLethal = totalAttacks * autoWoundsPerAttack;
  const exactWounds = woundsFromNormalHits + woundsFromLethal;

  // ── Exact failed saves ─────────────────────────────────────────────────────
  const effectiveSave = saveThreshold(defender.Save, defender.InvulSave, attacker.AP);
  const pSaveFail = 1 - prob(effectiveSave);

  const pCritWound = devastatingWounds ? (1/6) : 0;
  const woundsDevastating = exactWounds * pCritWound;
  const woundsNormal = exactWounds - woundsDevastating;
  const exactFailedSaves = woundsNormal * pSaveFail + woundsDevastating;

  // ── Exact damage ──────────────────────────────────────────────────────────
  const avgDmgPerHit = parseDiceAverage(attacker.Damage);
  const exactDamage = exactFailedSaves * avgDmgPerHit;

  // ── Monte Carlo for kills and distribution only ───────────────────────────
  let totalModelsKilled = 0;
  const killCounts: number[] = new Array(defenderCount + 2).fill(0);

  for (let i = 0; i < ITERATIONS; i++) {
    const r = runIteration(attacker, attackerCount, defender, defenderCount, modifiers);
    totalModelsKilled += r.modelsKilled;
    killCounts[Math.min(r.modelsKilled, defenderCount)]++;
  }

  const avgModelsKilled = totalModelsKilled / ITERATIONS;
  const distribution = killCounts.map((c) => round(c / ITERATIONS));

  return {
    avgHits: round(exactHits),
    avgWounds: round(exactWounds),
    avgFailedSaves: round(exactFailedSaves),
    avgDamage: round(exactDamage),
    avgModelsKilled: round(avgModelsKilled),
    distribution,
    hitProb: round(pHit * 100),
    woundProb: round(pWound * 100),
    saveFailProb: round(pSaveFail * 100),
    avgDamagePerHit: round(exactFailedSaves > 0 ? exactDamage / exactFailedSaves : avgDmgPerHit),
    totalAttacks: round(totalAttacks),
    effectiveSave,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}