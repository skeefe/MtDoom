import React from "react";
import { selectOption } from "../types/select-option";
import SelectField from "./select-field";
import TextField from "./textField";
import TextAreaField from "./textAreaField";
import { victoryTypes } from "../../data/victory-types";

const BattleFormPost = (props: {
  IsCompleted: boolean;
  Opponents: selectOption[];
  AttackerScore: number;
  DefenderScore: number;
  Victor: string;
  VictoryType: string;
  TurnEnded: number;
  AttackerMVP: string;
  DefenderMVP: string;
  AttackerLVP: string;
  DefenderLVP: string;
  BattleNotes: string;
  changeFunctionSelect: React.ChangeEventHandler<HTMLSelectElement>;
  changeFunctionText: React.ChangeEventHandler<HTMLInputElement>;
  changeFunctionTextArea: React.ChangeEventHandler<HTMLTextAreaElement>;
}) => {
  let roundOptions: selectOption[] = [];
  for (let i = 1; i <= 5; i++) {
    roundOptions.push({
      Label: i.toString(),
      Value: i.toString(),
      Active: true,
    });
  }

  return (
    <fieldset disabled={props.IsCompleted}>
      <legend>Post-Battle</legend>

      <div className="opponent-layout">
        <div className="opponent">
          <legend>Attacker</legend>
          <span className="score-highlight">{props.AttackerScore}</span>
        </div>
        <div className="opponent">
          <legend>Defender</legend>
          <span className="score-highlight">{props.DefenderScore}</span>
        </div>
      </div>

      <SelectField
        label="Victor"
        required={true}
        id="victor"
        name="Victor"
        changeFunction={props.changeFunctionSelect}
        value={props.Victor}
        options={props.Opponents}
        emptyValue="Select the Victor"
        noOptionsMessage="Please select an Attacker and Defender."
      />
      <SelectField
        label="Victory Type"
        required={true}
        id="victoryType"
        name="VictoryType"
        changeFunction={props.changeFunctionSelect}
        value={props.VictoryType}
        options={victoryTypes}
        emptyValue="Select the Victory Type"
      />
      <SelectField
        label="Turn Ended"
        required={true}
        id="turnEnded"
        name="TurnEnded"
        changeFunction={props.changeFunctionSelect}
        value={props.TurnEnded.toString()}
        options={roundOptions}
        emptyValue="Select the Turn"
      />
      <TextField
        label="Attacker MVP"
        type="text"
        id="attackerMVP"
        name="AttackerMVP"
        value={props.AttackerMVP}
        emptyValue="Attacker MVP"
        required={false}
        changeFunction={props.changeFunctionText}
      />
      <TextField
        label="Defender MVP"
        type="text"
        id="defenderMVP"
        name="DefenderMVP"
        value={props.DefenderMVP}
        emptyValue="Defender MVP"
        required={false}
        changeFunction={props.changeFunctionText}
      />
      <TextField
        label="Attacker LVP"
        type="text"
        id="attackerLVP"
        name="AttackerLVP"
        value={props.AttackerLVP}
        emptyValue="Attacker LVP"
        required={false}
        changeFunction={props.changeFunctionText}
      />
      <TextField
        label="Defender LVP"
        type="text"
        id="defenderLVP"
        name="DefenderLVP"
        value={props.DefenderLVP}
        emptyValue="Defender LVP"
        required={false}
        changeFunction={props.changeFunctionText}
      />
      <TextAreaField
        label="Battle Notes"
        id="battleNotes"
        name="BattleNotes"
        value={props.BattleNotes}
        emptyValue="Battle notes..."
        required={false}
        changeFunction={props.changeFunctionTextArea}
      />
    </fieldset>
  );
};

export default BattleFormPost;
