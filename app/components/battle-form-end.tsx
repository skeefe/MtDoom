import React from "react";
import TextField from "./text-field";

const BattleFormEnd = (props: {
  IsCompleted: boolean;
  IsAttackerFirst: boolean;
  AttackerMissionBonus: number;
  DefenderMissionBonus: number;
  changeFunctionText: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <fieldset disabled={props.IsCompleted}>
      <legend>End of Game</legend>

      <div
        className={`opponent-layout ${!props.IsAttackerFirst ? "reverse" : ""}`}
      >
        <div className="opponent">
          <legend className="attacker">Attacker</legend>
          <TextField
            label="Mission Bonus"
            type="number"
            required={false}
            id="attackerMissionBonus"
            name="AttackerMissionBonus"
            changeFunction={props.changeFunctionText}
            value={props.AttackerMissionBonus.toString()}
            emptyValue="Mission Bonus"
          />
        </div>

        <div className="opponent">
          <legend className="defender">Defender</legend>
          <TextField
            label="Mission Bonus"
            type="number"
            required={false}
            id="defenderMissionBonus"
            name="DefenderMissionBonus"
            changeFunction={props.changeFunctionText}
            value={props.DefenderMissionBonus.toString()}
            emptyValue="Mission Bonus"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default BattleFormEnd;
