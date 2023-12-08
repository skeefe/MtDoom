import React from "react";
import TextField from "./textField";

const BattleFormEnd = (props: {
  IsCompleted: boolean;
  AttackerMissionBonus: number;
  DefenderMissionBonus: number;
  changeFunctionText: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <fieldset disabled={props.IsCompleted}>
      <legend>End of Game</legend>

      <div className="opponent-layout">
        <div className="opponent">
          <legend>Attacker</legend>
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
          <legend>Defender</legend>
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
