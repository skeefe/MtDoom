import React from "react";
import TextField from "./text-field";
import SelectField from "./select-field";
import { secondaryMissions, secondaryMissions11, secondaryMissions11Tactical, secondaryMissions11Fixed } from "../../data/secondary-missions";
import { challengerCards } from "../../data/challenger-cards-10";

export interface iSecondaryEntry {
  title: string;
  points: number;
}

const BattleFormRound = (props: {
  ChapterApprovedVersion: string;
  IsCompleted: boolean;
  IsAttackerFirst: boolean;
  RoundNumber: number;
  isArmageddon: boolean;
  showChallenger: boolean;
  AttackerSecondaryType?: string;
  DefenderSecondaryType?: string;

  // 10th edition props
  AttackerPrimary?: number;
  AttackerSecondary1Title: string;
  AttackerSecondary1: number;
  AttackerSecondary2Title: string;
  AttackerSecondary2: number;
  AttackerChallengerTitle: string;
  AttackerChallenger: number;
  DefenderPrimary?: number;
  DefenderSecondary1Title: string;
  DefenderSecondary1: number;
  DefenderSecondary2Title: string;
  DefenderSecondary2: number;
  DefenderChallengerTitle: string;
  DefenderChallenger: number;
  changeFunction: React.ChangeEventHandler<HTMLInputElement>;
  changeFunctionSelect: React.ChangeEventHandler<HTMLSelectElement>;

  // 11th edition props
  AttackerSecondaries?: iSecondaryEntry[];
  DefenderSecondaries?: iSecondaryEntry[];
  onAttackerSecondaryChange?: (index: number, field: "title" | "points", value: string | number) => void;
  onDefenderSecondaryChange?: (index: number, field: "title" | "points", value: string | number) => void;
  onAttackerAddSecondary?: () => void;
  onDefenderAddSecondary?: () => void;
}) => {
  const showChallengerCards =
    props.showChallenger &&
    props.ChapterApprovedVersion === "2025-26 Mission Deck" &&
    props.RoundNumber > 1;

  // Tactical = all 18, Fixed = only the 4 fixed cards, unset = all 18
  const attackerSecondaryOptions = props.isArmageddon
    ? props.AttackerSecondaryType === "Fixed" ? secondaryMissions11Fixed : secondaryMissions11Tactical
    : secondaryMissions;

  const defenderSecondaryOptions = props.isArmageddon
    ? props.DefenderSecondaryType === "Fixed" ? secondaryMissions11Fixed : secondaryMissions11Tactical
    : secondaryMissions;

  const attackerSecondaryTotal = (props.AttackerSecondaries ?? []).reduce((sum, s) => sum + (s.points || 0), 0);
  const defenderSecondaryTotal = (props.DefenderSecondaries ?? []).reduce((sum, s) => sum + (s.points || 0), 0);

  const renderArmageddonSide = (
    side: "attacker" | "defender",
    secondaries: iSecondaryEntry[],
    total: number,
    onSecondaryChange: (index: number, field: "title" | "points", value: string | number) => void,
    onAddSecondary: () => void,
    primaryName: string,
    primaryValue: number | undefined,
    secondaryOptions: typeof secondaryMissions11,
  ) => (
    <div className="opponent">
      <legend className={side}>{side === "attacker" ? "Attacker" : "Defender"}</legend>

      <TextField
        label="Primary Points"
        type="number"
        required={false}
        id={`${primaryName}`}
        name={`${primaryName}`}
        changeFunction={props.changeFunction}
        value={`${primaryValue ?? 0}`}
        emptyValue="--"
        max={15}
      />

      <div style={{ marginTop: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Secondaries <span style={{ color: total >= 15 ? "var(--color-primary)" : "var(--color-text-muted)" }}>({total}/15)</span>
          </label>
        </div>

        {secondaries.map((s, i) => (
          <div key={i} style={{ marginBottom: "0.75rem", paddingLeft: "0.5rem", borderLeft: "2px solid var(--color-divider)" }}>
            <SelectField
              label={`Secondary ${i + 1} Title`}
              required={false}
              id={`${side}-secondary-${i}-title-r${props.RoundNumber}`}
              name={`${side}-secondary-${i}-title-r${props.RoundNumber}`}
              value={s.title}
              options={secondaryOptions}
              emptyValue="Select a Secondary Mission"
              randomise={false}
              changeFunction={(e) => onSecondaryChange(i, "title", e.target.value)}
            />
            <TextField
              label={`Secondary ${i + 1} Points`}
              type="number"
              required={false}
              id={`${side}-secondary-${i}-points-r${props.RoundNumber}`}
              name={`${side}-secondary-${i}-points-r${props.RoundNumber}`}
              value={`${s.points}`}
              emptyValue="--"
              max={Math.min(15, 15 - total + s.points)}
              changeFunction={(e) => onSecondaryChange(i, "points", Math.min(Number(e.target.value), Math.min(15, 15 - total + s.points)))}
            />
          </div>
        ))}

        {!props.IsCompleted && total < 15 && (
          <button
            type="button"
            className="button button-secondary"
            onClick={onAddSecondary}
            style={{ marginTop: "0.25rem", fontSize: "0.85rem" }}
          >
            + Add Secondary
          </button>
        )}
      </div>
    </div>
  );

  return (
    <fieldset disabled={props.IsCompleted}>
      <legend>Battle Round {props.RoundNumber.toString()}</legend>

      <div className={`opponent-layout ${!props.IsAttackerFirst ? "reverse" : ""}`}>

        {props.isArmageddon ? (
          <>
            {renderArmageddonSide(
              "attacker",
              props.AttackerSecondaries ?? [],
              attackerSecondaryTotal,
              props.onAttackerSecondaryChange!,
              props.onAttackerAddSecondary!,
              `T${props.RoundNumber}AttackerPrimary`,
              props.AttackerPrimary,
              attackerSecondaryOptions,
            )}
            {renderArmageddonSide(
              "defender",
              props.DefenderSecondaries ?? [],
              defenderSecondaryTotal,
              props.onDefenderSecondaryChange!,
              props.onDefenderAddSecondary!,
              `T${props.RoundNumber}DefenderPrimary`,
              props.DefenderPrimary,
              defenderSecondaryOptions,
            )}
          </>
        ) : (
          <>
            {/* 10th edition attacker */}
            <div className="opponent">
              <legend className="attacker">Attacker</legend>
              <TextField
                label="Primary Points"
                type="number"
                required={false}
                id={`t${props.RoundNumber}AttackerPrimary`}
                name={`T${props.RoundNumber}AttackerPrimary`}
                changeFunction={props.changeFunction}
                value={`${props.AttackerPrimary}`}
                emptyValue="--"
              />
              <SelectField
                label="Secondary 1 Title"
                required={false}
                id={`t${props.RoundNumber}AttackerSecondary1Title`}
                name={`T${props.RoundNumber}AttackerSecondary1Title`}
                changeFunction={props.changeFunctionSelect}
                value={props.AttackerSecondary1Title}
                options={secondaryMissions}
                emptyValue="Select a Secondary Mission"
                randomise={false}
              />
              <TextField
                label="Secondary 1 Points"
                type="number"
                required={false}
                id={`t${props.RoundNumber}AttackerSecondary1`}
                name={`T${props.RoundNumber}AttackerSecondary1`}
                changeFunction={props.changeFunction}
                value={`${props.AttackerSecondary1}`}
                emptyValue="--"
              />
              <SelectField
                label="Secondary 2 Title"
                required={false}
                id={`t${props.RoundNumber}AttackerSecondary2Title`}
                name={`T${props.RoundNumber}AttackerSecondary2Title`}
                changeFunction={props.changeFunctionSelect}
                value={props.AttackerSecondary2Title}
                options={secondaryMissions}
                emptyValue="Select a Secondary Mission"
                randomise={false}
              />
              <TextField
                label="Secondary 2 Points"
                type="number"
                required={false}
                id={`t${props.RoundNumber}AttackerSecondary2`}
                name={`T${props.RoundNumber}AttackerSecondary2`}
                changeFunction={props.changeFunction}
                value={`${props.AttackerSecondary2}`}
                emptyValue="--"
              />
              {showChallengerCards && (
                <>
                  <SelectField
                    label="Challenger Card Title"
                    required={false}
                    id={`t${props.RoundNumber}AttackerChallengerTitle`}
                    name={`T${props.RoundNumber}AttackerChallengerTitle`}
                    changeFunction={props.changeFunctionSelect}
                    value={props.AttackerChallengerTitle}
                    options={challengerCards}
                    emptyValue="Select a Challenger Card"
                    randomise={false}
                  />
                  <TextField
                    label="Challenger Card Points"
                    type="number"
                    required={false}
                    id={`t${props.RoundNumber}AttackerChallenger`}
                    name={`T${props.RoundNumber}AttackerChallenger`}
                    changeFunction={props.changeFunction}
                    value={`${props.AttackerChallenger}`}
                    emptyValue="--"
                  />
                </>
              )}
            </div>

            {/* 10th edition defender */}
            <div className="opponent">
              <legend className="defender">Defender</legend>
              <TextField
                label="Primary Points"
                type="number"
                required={false}
                id={`t${props.RoundNumber}DefenderPrimary`}
                name={`T${props.RoundNumber}DefenderPrimary`}
                changeFunction={props.changeFunction}
                value={`${props.DefenderPrimary}`}
                emptyValue="--"
              />
              <SelectField
                label="Secondary 1 Title"
                required={false}
                id={`t${props.RoundNumber}DefenderSecondary1Title`}
                name={`T${props.RoundNumber}DefenderSecondary1Title`}
                changeFunction={props.changeFunctionSelect}
                value={props.DefenderSecondary1Title}
                options={secondaryMissions}
                emptyValue="Select a Secondary Mission"
                randomise={false}
              />
              <TextField
                label="Secondary 1 Points"
                type="number"
                required={false}
                id={`t${props.RoundNumber}DefenderSecondary1`}
                name={`T${props.RoundNumber}DefenderSecondary1`}
                changeFunction={props.changeFunction}
                value={`${props.DefenderSecondary1}`}
                emptyValue="--"
              />
              <SelectField
                label="Secondary 2 Title"
                required={false}
                id={`t${props.RoundNumber}DefenderSecondary2Title`}
                name={`T${props.RoundNumber}DefenderSecondary2Title`}
                changeFunction={props.changeFunctionSelect}
                value={props.DefenderSecondary2Title}
                options={secondaryMissions}
                emptyValue="Select a Secondary Mission"
                randomise={false}
              />
              <TextField
                label="Secondary 2 Points"
                type="number"
                required={false}
                id={`t${props.RoundNumber}DefenderSecondary2`}
                name={`T${props.RoundNumber}DefenderSecondary2`}
                changeFunction={props.changeFunction}
                value={`${props.DefenderSecondary2}`}
                emptyValue="--"
              />
              {showChallengerCards && (
                <>
                  <SelectField
                    label="Challenger Card Title"
                    required={false}
                    id={`t${props.RoundNumber}DefenderChallengerTitle`}
                    name={`T${props.RoundNumber}DefenderChallengerTitle`}
                    changeFunction={props.changeFunctionSelect}
                    value={props.DefenderChallengerTitle}
                    options={challengerCards}
                    emptyValue="Select a Challenger Card"
                    randomise={false}
                  />
                  <TextField
                    label="Challenger Card Points"
                    type="number"
                    required={false}
                    id={`t${props.RoundNumber}DefenderChallenger`}
                    name={`T${props.RoundNumber}DefenderChallenger`}
                    changeFunction={props.changeFunction}
                    value={`${props.DefenderChallenger}`}
                    emptyValue="--"
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </fieldset>
  );
};

export default BattleFormRound;