import React, { useEffect, useRef } from "react";
import { selectOption } from "../types/select-option";
import SelectField from "./select-field";
import TextField from "./textField";
import TextAreaField from "./textAreaField";
import { victoryTypes } from "../../data/victory-types";
import confetti from 'canvas-confetti';

const BattleFormPost = (props: {
  AttackerArmyColour: string; // Restored the 'u'
  DefenderArmyColour: string; // Restored the 'u'
  IsCompleted: boolean;
  IsAttackerFirst: boolean;
  Opponents: selectOption[];
  AttackerScore: number;
  DefenderScore: number;
  Victor: string;
  Attacker: string;
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
  const prevVictor = useRef(props.Victor);

  useEffect(() => {
    if (props.Victor && props.Victor !== prevVictor.current) {

      const winningOpponent = props.Opponents.find(o => o.Value === props.Victor);
      const winnerName = winningOpponent ? winningOpponent.Label : "The Victor";

      // Using the 'u' props here too
      const winningColor = props.Victor === props.Attacker
        ? props.AttackerArmyColour
        : props.DefenderArmyColour;

      const originalTitle = document.title;
      document.title = `🏆 ${winnerName} Wins! 🏆`;
      setTimeout(() => { document.title = originalTitle; }, 6000);

      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 40 * (timeLeft / duration);

        // I've moved the types into the call to satisfy the 'Options' error
        const defaults = {
          startVelocity: 45,    // Increased: Shoots them higher up the screen
          spread: 90,           // Wider: Fills the screen more
          ticks: 200,           // Increased: Particles stay on screen longer before vanishing
          gravity: 0.8,         // Decreased: Makes them float down slower (default is 1)
          scalar: 1.2,          // Slightly larger particles: easier to see the army colour
          zIndex: 1000,
          colors: [winningColor, winningColor, '#C0C0C0']
        };

        // Left Cannon
        confetti({
          ...defaults,
          particleCount,
          origin: { x: 0, y: 0.9 }, // Moved closer to the actual edge of the screen
          angle: 60
        });

        // Right Cannon
        confetti({
          ...defaults,
          particleCount,
          origin: { x: 1, y: 0.9 }, // Moved closer to the actual edge of the screen
          angle: 120
        });

      }, 250);
    }

    prevVictor.current = props.Victor;
  }, [props.Victor, props.Attacker, props.AttackerArmyColour, props.DefenderArmyColour, props.Opponents]);

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

      <div className={`opponent-layout ${!props.IsAttackerFirst ? "reverse" : ""}`}>
        <div className="opponent">
          <legend className="attacker">Attacker</legend>
          <span className="score-highlight">{props.AttackerScore}</span>
        </div>
        <div className="opponent">
          <legend className="defender">Defender</legend>
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
        noOptionsMessage="Select the Attacker or Defender."
      />

      {/* Rest of your fields remain the same */}
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