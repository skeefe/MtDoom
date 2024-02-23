import React, { useState } from "react";
import { selectOption } from "../types/select-option";
import SelectField from "./select-field";
import TextField from "./textField";
import { battleSizes } from "../../data/battle-sizes";
import { deploymentZones } from "../../data/deployment-zones";
import { missionRules } from "../../data/mission-rules";
import { primaryMissions } from "../../data/primary-missions";
import TextAreaField from "./textAreaField";
import Modal from "./modal";
import { titleCase } from "../../utils/title-case";

const BattleFormPre = (props: {
  IsCompleted: boolean;
  Generals: selectOption[];
  Armies: selectOption[];
  Opponents: selectOption[];
  Size: string;
  PrimaryMission: string;
  MissionRule: string;
  Deployment: string;
  Attacker: string;
  Defender: string;
  AttackerArmy: string;
  DefenderArmy: string;
  AttackerDetachment: string;
  DefenderDetachment: string;
  AttackerList: string;
  DefenderList: string;
  FirstTurn: string;
  changeFunctionSelect: React.ChangeEventHandler<HTMLSelectElement>;
  changeFunctionText: React.ChangeEventHandler<HTMLInputElement>;
  changeFunctionTextArea: React.ChangeEventHandler<HTMLTextAreaElement>;
}) => {
  const [showAttackerList, setShowAttackerList] = useState(false);
  const [showDefenderList, setShowDefenderList] = useState(false);

  return (
    <fieldset disabled={props.IsCompleted}>
      <legend>Pre-Battle Setup</legend>
      <SelectField
        label="Battle Size"
        required={true}
        id="battleSize"
        name="Size"
        changeFunction={props.changeFunctionSelect}
        value={props.Size}
        options={battleSizes}
        emptyValue="Select the Battle Size"
      />
      <SelectField
        label="Primary Mission"
        required={true}
        id="primaryMission"
        name="PrimaryMission"
        changeFunction={props.changeFunctionSelect}
        value={props.PrimaryMission}
        options={primaryMissions}
        emptyValue="Select the Primary Mission"
        randomise={true}
      />
      <SelectField
        label="Mission Rule"
        required={true}
        id="missionRule"
        name="MissionRule"
        changeFunction={props.changeFunctionSelect}
        value={props.MissionRule}
        options={missionRules}
        emptyValue="Select the Mission Rule"
        randomise={true}
      />
      <SelectField
        label="Deployment"
        required={true}
        id="deployment"
        name="Deployment"
        changeFunction={props.changeFunctionSelect}
        value={props.Deployment}
        options={deploymentZones}
        emptyValue="Select the Deployment Zone"
        randomise={true}
      />

      <div className="opponent-layout">
        <div className="opponent">
          <legend>Attacker</legend>
          <SelectField
            label="General"
            required={true}
            id="attacker"
            name="Attacker"
            changeFunction={props.changeFunctionSelect}
            value={props.Attacker}
            //options={props.Generals}
            options={props.Generals.filter(function (item) {
              return item.Value != props.Defender;
            })}
            emptyValue="Select the Attacker"
          />
          <SelectField
            label="Army"
            required={true}
            id="attackerArmy"
            name="AttackerArmy"
            changeFunction={props.changeFunctionSelect}
            value={props.AttackerArmy}
            options={props.Armies}
            emptyValue="Select the Attacker Army"
          />
          <TextField
            label="Detachment"
            type="text"
            required={true}
            id="attackerDetachment"
            name="AttackerDetachment"
            changeFunction={props.changeFunctionText}
            value={props.AttackerDetachment}
            emptyValue="Enter Detachment"
          />

          {props.AttackerList ? (
            <>
              <button
                className="button"
                type="button"
                onClick={() => setShowAttackerList(true)}
              >
                View List
              </button>

              {showAttackerList && (
                <Modal
                  onClose={() => setShowAttackerList(false)}
                  title={
                    titleCase(props.Attacker) +
                    "'s " +
                    titleCase(props.AttackerArmy) +
                    " List"
                  }
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: props.AttackerList.replace(
                        /(\r\n|\r|\n)/g,
                        "<br>"
                      ).replace(/• /g, ""),
                    }}
                  />
                </Modal>
              )}
            </>
          ) : (
            <TextAreaField
              label="Attacker Army List"
              id="attackerList"
              name="AttackerList"
              changeFunction={props.changeFunctionTextArea}
              value={props.AttackerList}
              emptyValue="Enter the Attacker's List"
              required={false}
            />
          )}
        </div>

        <div className="opponent">
          <legend>Defender</legend>
          <SelectField
            label="General"
            required={true}
            id="defender"
            name="Defender"
            changeFunction={props.changeFunctionSelect}
            value={props.Defender}
            //options={props.Generals}
            options={props.Generals.filter(function (item) {
              return item.Value != props.Attacker;
            })}
            emptyValue="Select the Defender"
          />
          <SelectField
            label="Army"
            required={true}
            id="defenderArmy"
            name="DefenderArmy"
            changeFunction={props.changeFunctionSelect}
            value={props.DefenderArmy}
            options={props.Armies}
            emptyValue="Select the Defender Army"
          />
          <TextField
            label="Detachment"
            type="text"
            required={true}
            id="defenderDetachment"
            name="DefenderDetachment"
            changeFunction={props.changeFunctionText}
            value={props.DefenderDetachment}
            emptyValue="Enter Detachment"
          />
          {props.DefenderList ? (
            <>
              <button
                className="button"
                type="button"
                onClick={() => setShowDefenderList(true)}
              >
                View List
              </button>

              {showDefenderList && (
                <Modal
                  onClose={() => setShowDefenderList(false)}
                  title={
                    titleCase(props.Defender) +
                    "'s " +
                    titleCase(props.DefenderArmy) +
                    " List"
                  }
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: props.DefenderList.replace(
                        /(\r\n|\r|\n)/g,
                        "<br>"
                      ).replace(/• /g, ""),
                    }}
                  />
                </Modal>
              )}
            </>
          ) : (
            <TextAreaField
              label="Defender Army List"
              id="defenderList"
              name="DefenderList"
              changeFunction={props.changeFunctionTextArea}
              value={props.DefenderList}
              emptyValue="Enter the Defender's List"
              required={false}
            />
          )}
        </div>
      </div>
      <SelectField
        label="First Turn"
        required={true}
        id="firstTurn"
        name="FirstTurn"
        changeFunction={props.changeFunctionSelect}
        value={props.FirstTurn}
        options={props.Opponents}
        emptyValue="Select the Player"
        noOptionsMessage="Please select an Attacker and Defender."
      />
    </fieldset>
  );
};

export default BattleFormPre;
