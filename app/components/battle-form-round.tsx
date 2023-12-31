import React from "react";
import TextField from "./textField";

const BattleFormRound = (props: {
  IsCompleted: boolean;
  RoundNumber: number;
  AttackerPrimary?: number;
  AttackerSecondary1Title: string;
  AttackerSecondary1: number;
  AttackerSecondary2Title: string;
  AttackerSecondary2: number;
  DefenderPrimary?: number;
  DefenderSecondary1Title: string;
  DefenderSecondary1: number;
  DefenderSecondary2Title: string;
  DefenderSecondary2: number;
  changeFunction: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <fieldset disabled={props.IsCompleted}>
      <legend>Battle Round {props.RoundNumber.toString()}</legend>

      <div className="opponent-layout">
        <div className="opponent">
          <legend>Attacker</legend>
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
          <TextField
            label="Secondary 1 Title"
            type="text"
            required={false}
            id={`t${props.RoundNumber}AttackerSecondary1Title`}
            name={`T${props.RoundNumber}AttackerSecondary1Title`}
            changeFunction={props.changeFunction}
            value={props.AttackerSecondary1Title}
            emptyValue="Enter Title"
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
          <TextField
            label="Secondary 2 Title"
            type="text"
            required={false}
            id={`t${props.RoundNumber}AttackerSecondary2Title`}
            name={`T${props.RoundNumber}AttackerSecondary2Title`}
            changeFunction={props.changeFunction}
            value={props.AttackerSecondary2Title}
            emptyValue="Enter Title"
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
        </div>

        <div className="opponent">
          <legend>Defender</legend>
          {props.RoundNumber > 1 && (
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
          )}
          <TextField
            label="Secondary 1 Title"
            type="text"
            required={false}
            id={`t${props.RoundNumber}DefenderSecondary1Title`}
            name={`T${props.RoundNumber}DefenderSecondary1Title`}
            changeFunction={props.changeFunction}
            value={props.DefenderSecondary1Title}
            emptyValue="Enter Title"
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
          <TextField
            label="Secondary 2 Title"
            type="text"
            required={false}
            id={`t${props.RoundNumber}DefenderSecondary2Title`}
            name={`T${props.RoundNumber}DefenderSecondary2Title`}
            changeFunction={props.changeFunction}
            value={props.DefenderSecondary2Title}
            emptyValue="Enter Title"
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
        </div>
      </div>
    </fieldset>
  );
};

export default BattleFormRound;
