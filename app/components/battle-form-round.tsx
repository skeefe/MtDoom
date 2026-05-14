import React from "react";
import TextField from "./text-field";
import SelectField from "./select-field";
import { secondaryMissions } from "../../data/secondary-missions";
import { challengerCards } from "../../data/challenger-cards";

const BattleFormRound = (props: {
  ChapterApprovedVersion: string;
  IsCompleted: boolean;
  IsAttackerFirst: boolean;
  RoundNumber: number;
  showChallenger: boolean; // New Prop from Step 3
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
}) => {
  // Updated logic: Must be active deck, post-round 1, AND meet the date cutoff
  const showChallengerCards =
    props.showChallenger &&
    props.ChapterApprovedVersion === "2025-26 Mission Deck" &&
    props.RoundNumber > 1;

  return (
    <fieldset disabled={props.IsCompleted}>
      <legend>Battle Round {props.RoundNumber.toString()}</legend>

      <div
        className={`opponent-layout ${!props.IsAttackerFirst ? "reverse" : ""}`}
      >
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
      </div>
    </fieldset>
  );
};

export default BattleFormRound;