import React, { useState } from "react";
import { selectOption } from "../types/select-option";
import SelectField from "./select-field";
import TextField from "./text-field";
import { chapterApprovedVersions } from "../../data/chapter-approved-versions";
import { battleSizes } from "../../data/battle-sizes";
import { deploymentZones } from "../../data/deployment-zones";
import { missionRules } from "../../data/mission-rules";
import { primaryMissions, primaryMissions11 } from "../../data/primary-missions";
import { forceDispositions } from "../../data/force-dispositions";
import TextAreaField from "./textarea-field";
import Modal from "./modal";
import { titleCase } from "../../utils/title-case";

const secondaryTypeOptions: selectOption[] = [
  { Label: "Tactical", Value: "Tactical", Active: true },
  { Label: "Fixed", Value: "Fixed", Active: true },
];

const isArmageddon = (version: string) => version === "Armageddon - Chapter Approved";

const BattleFormPre = (props: {
  IsCompleted: boolean;
  IsAttackerFirst: boolean;
  Generals: selectOption[];
  Armies: selectOption[];
  Opponents: selectOption[];
  ChapterApprovedVersion: string;
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
  AttackerForceDisposition?: string;
  DefenderForceDisposition?: string;
  AttackerSecondaryType?: string;
  DefenderSecondaryType?: string;
  AttackerDetachments?: string[];
  DefenderDetachments?: string[];
  onAttackerDetachmentChange?: (index: number, value: string) => void;
  onDefenderDetachmentChange?: (index: number, value: string) => void;
  onAttackerAddDetachment?: () => void;
  onDefenderAddDetachment?: () => void;
  changeFunctionSelect: React.ChangeEventHandler<HTMLSelectElement>;
  changeFunctionText: React.ChangeEventHandler<HTMLInputElement>;
  changeFunctionTextArea: React.ChangeEventHandler<HTMLTextAreaElement>;
}) => {
  const [showAttackerList, setShowAttackerList] = useState(false);
  const [showDefenderList, setShowDefenderList] = useState(false);

  const showMissionRule = !isArmageddon(props.ChapterApprovedVersion) && props.ChapterApprovedVersion !== "2025-26 Mission Deck";
  const showArmageddon = isArmageddon(props.ChapterApprovedVersion);
  const missionOptions = showArmageddon ? primaryMissions11 : primaryMissions;

  return (
    <>
      <fieldset disabled={props.IsCompleted}>
        <legend>Pre-Battle Setup</legend>
        <SelectField
          label="Chapter Approved Version"
          required={true}
          id="chapterApproved"
          name="ChapterApprovedVersion"
          changeFunction={props.changeFunctionSelect}
          value={props.ChapterApprovedVersion}
          options={chapterApprovedVersions}
          emptyValue="Select the Chapter Approved Version"
        />
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
          options={missionOptions}
          emptyValue="Select the Primary Mission"
          randomise={!props.IsCompleted}
        />
        {showMissionRule && (
          <SelectField
            label="Mission Rule"
            required={true}
            id="missionRule"
            name="MissionRule"
            changeFunction={props.changeFunctionSelect}
            value={props.MissionRule}
            options={missionRules}
            emptyValue="Select the Mission Rule"
            randomise={!props.IsCompleted}
          />
        )}
        <SelectField
          label="Deployment"
          required={true}
          id="deployment"
          name="Deployment"
          changeFunction={props.changeFunctionSelect}
          value={props.Deployment}
          options={deploymentZones}
          emptyValue="Select the Deployment Zone"
          randomise={!props.IsCompleted}
        />

        <div className={`opponent-layout ${!props.IsAttackerFirst ? "reverse" : ""}`}>
          <div className="opponent">
            <legend className="attacker">Attacker</legend>
            <SelectField
              label="General"
              required={true}
              id="attacker"
              name="Attacker"
              changeFunction={props.changeFunctionSelect}
              value={props.Attacker}
              options={props.Generals.filter((item) => item.Value != props.Defender)}
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
              required={!showArmageddon}
              id="attackerDetachment"
              name="AttackerDetachment"
              changeFunction={props.changeFunctionText}
              value={props.AttackerDetachment}
              emptyValue="Enter Detachment"
            />
            {showArmageddon && (
              <div style={{ marginTop: "0.5rem" }}>
                {(props.AttackerDetachments ?? []).map((d, i) => (
                  <TextField
                    key={i}
                    label={`Detachment ${i + 1}`}
                    type="text"
                    required={false}
                    id={`attackerDetachment${i}`}
                    name={`attackerDetachment${i}`}
                    value={d}
                    emptyValue="Enter Detachment"
                    changeFunction={(e) => props.onAttackerDetachmentChange?.(i, e.target.value)}
                  />
                ))}
                {!props.IsCompleted && (props.AttackerDetachments ?? []).length < 3 && (
                  <button type="button" className="button button-secondary" onClick={props.onAttackerAddDetachment} style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                    + Add Detachment
                  </button>
                )}
              </div>
            )}
            {showArmageddon && (
              <>
                <SelectField
                  label="Force Disposition"
                  required={true}
                  id="attackerForceDisposition"
                  name="AttackerForceDisposition"
                  changeFunction={props.changeFunctionSelect}
                  value={props.AttackerForceDisposition ?? ""}
                  options={forceDispositions}
                  emptyValue="Select Force Disposition"
                />
                <SelectField
                  label="Secondary Type"
                  required={true}
                  id="attackerSecondaryType"
                  name="AttackerSecondaryType"
                  changeFunction={props.changeFunctionSelect}
                  value={props.AttackerSecondaryType ?? ""}
                  options={secondaryTypeOptions}
                  emptyValue="Select Secondary Type"
                />
              </>
            )}
            <a className="button button-block button-secondary" onClick={() => setShowAttackerList(true)}>
              View/Update List
            </a>
          </div>

          <div className="opponent">
            <legend className="defender">Defender</legend>
            <SelectField
              label="General"
              required={true}
              id="defender"
              name="Defender"
              changeFunction={props.changeFunctionSelect}
              value={props.Defender}
              options={props.Generals.filter((item) => item.Value != props.Attacker)}
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
              required={!showArmageddon}
              id="defenderDetachment"
              name="DefenderDetachment"
              changeFunction={props.changeFunctionText}
              value={props.DefenderDetachment}
              emptyValue="Enter Detachment"
            />
            {showArmageddon && (
              <div style={{ marginTop: "0.5rem" }}>
                {(props.DefenderDetachments ?? []).map((d, i) => (
                  <TextField
                    key={i}
                    label={`Detachment ${i + 1}`}
                    type="text"
                    required={false}
                    id={`defenderDetachment${i}`}
                    name={`defenderDetachment${i}`}
                    value={d}
                    emptyValue="Enter Detachment"
                    changeFunction={(e) => props.onDefenderDetachmentChange?.(i, e.target.value)}
                  />
                ))}
                {!props.IsCompleted && (props.DefenderDetachments ?? []).length < 3 && (
                  <button type="button" className="button button-secondary" onClick={props.onDefenderAddDetachment} style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                    + Add Detachment
                  </button>
                )}
              </div>
            )}
            {showArmageddon && (
              <>
                <SelectField
                  label="Force Disposition"
                  required={true}
                  id="defenderForceDisposition"
                  name="DefenderForceDisposition"
                  changeFunction={props.changeFunctionSelect}
                  value={props.DefenderForceDisposition ?? ""}
                  options={forceDispositions}
                  emptyValue="Select Force Disposition"
                />
                <SelectField
                  label="Secondary Type"
                  required={true}
                  id="defenderSecondaryType"
                  name="DefenderSecondaryType"
                  changeFunction={props.changeFunctionSelect}
                  value={props.DefenderSecondaryType ?? ""}
                  options={secondaryTypeOptions}
                  emptyValue="Select Secondary Type"
                />
              </>
            )}
            <a className="button button-block button-secondary" onClick={() => setShowDefenderList(true)}>
              View/Update List
            </a>
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
          noOptionsMessage="Select the Attacker or Defender."
        />
      </fieldset>

      {showAttackerList && (
        <Modal
          onClose={() => setShowAttackerList(false)}
          title={titleCase(props.Attacker) + "'s " + titleCase(props.AttackerArmy) + " List"}
        >
          <TextAreaField
            label={null}
            id="attackerList"
            name="AttackerList"
            value={props.AttackerList}
            emptyValue="Attacker List..."
            required={false}
            changeFunction={props.changeFunctionTextArea}
          />
        </Modal>
      )}

      {showDefenderList && (
        <Modal
          onClose={() => setShowDefenderList(false)}
          title={titleCase(props.Defender) + "'s " + titleCase(props.DefenderArmy) + " List"}
        >
          <TextAreaField
            label={null}
            id="defenderList"
            name="DefenderList"
            value={props.DefenderList}
            emptyValue="Defender List..."
            required={false}
            changeFunction={props.changeFunctionTextArea}
          />
        </Modal>
      )}
    </>
  );
};

export default BattleFormPre;