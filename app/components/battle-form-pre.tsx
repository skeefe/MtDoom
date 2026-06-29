"use client";

import React, { useState } from "react";
import { selectOption } from "../types/select-option";
import SelectField from "./select-field";
import TextField from "./text-field";
import { chapterApprovedVersions } from "../../data/chapter-approved-versions";
import { battleSizes } from "../../data/battle-sizes";
import { deploymentZones } from "../../data/deployment-zones";
import { missionRules } from "../../data/mission-rules-10";
import { primaryMissions, primaryMissions11 } from "../../data/primary-missions";
import { dispositions, type ForceDisposition } from "../../data/primary-missions-11";
import MissionCardModal from "./mission-card-modal";
import TextAreaField from "./textarea-field";
import Modal from "./modal";
import { titleCase } from "../../utils/title-case";

const MIN_DETACHMENTS = 1;
const MAX_DETACHMENTS = 3;

const secondaryTypeOptions: selectOption[] = [
  { Label: "Tactical", Value: "Tactical", Active: true },
  { Label: "Fixed", Value: "Fixed", Active: true },
];

const isArmageddon = (version: string) => version === "Armageddon - Chapter Approved";

const layoutLabel = (a: string, b: string) => {
  const sorted = [a, b].sort();
  return `${sorted[0]} / ${sorted[1]}`;
};

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
  AttackerPrimaryMission?: string;
  DefenderPrimaryMission?: string;
  Layout?: string;
  onAttackerDetachmentChange?: (index: number, value: string) => void;
  onDefenderDetachmentChange?: (index: number, value: string) => void;
  onAttackerAddDetachment?: () => void;
  onDefenderAddDetachment?: () => void;
  onAttackerRemoveDetachment?: (index: number) => void;
  onDefenderRemoveDetachment?: (index: number) => void;
  changeFunctionSelect: React.ChangeEventHandler<HTMLSelectElement>;
  changeFunctionText: React.ChangeEventHandler<HTMLInputElement>;
  changeFunctionTextArea: React.ChangeEventHandler<HTMLTextAreaElement>;
}) => {
  const [showAttackerList, setShowAttackerList] = useState(false);
  const [showDefenderList, setShowDefenderList] = useState(false);
  const [missionCardModal, setMissionCardModal] = useState<{ missionName: string; disposition: ForceDisposition; opponentDisposition: ForceDisposition } | null>(null);

  const showMissionRule = !isArmageddon(props.ChapterApprovedVersion) && props.ChapterApprovedVersion !== "2025-26 Mission Deck";
  const showArmageddon = isArmageddon(props.ChapterApprovedVersion);

  const bothDispositionsSelected = !!(props.AttackerForceDisposition && props.DefenderForceDisposition);

  const layoutOptions: selectOption[] = bothDispositionsSelected
    ? [1, 2, 3].map((n) => ({
        Label: `${layoutLabel(props.AttackerForceDisposition!, props.DefenderForceDisposition!)} — Layout ${n}`,
        Value: `${layoutLabel(props.AttackerForceDisposition!, props.DefenderForceDisposition!)} — Layout ${n}`,
        Active: true,
      }))
    : [];

  const handleShowMissionCard = (
    missionName: string | undefined,
    disposition: string | undefined,
    opponentDisposition: string | undefined
  ) => {
    if (!missionName || !disposition || !opponentDisposition) return;
    setMissionCardModal({
      missionName,
      disposition: disposition as ForceDisposition,
      opponentDisposition: opponentDisposition as ForceDisposition,
    });
  };

  const renderDetachments = (
    side: "attacker" | "defender",
    detachments: string[],
    onDetachmentChange: ((index: number, value: string) => void) | undefined,
    onAddDetachment: (() => void) | undefined,
    onRemoveDetachment: ((index: number) => void) | undefined,
  ) => (
    <div style={{ marginTop: "0.5rem" }}>
      {detachments.map((d, i) => (
        <div key={i} style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              Detachment {i + 1}
            </span>
            {!props.IsCompleted && i >= MIN_DETACHMENTS && (
              <button
                type="button"
                className="button button-icon"
                title="Remove detachment"
                onClick={() => onRemoveDetachment?.(i)}
                aria-label={`Remove detachment ${i + 1}`}
              >
                &#x2212;
              </button>
            )}
          </div>
          <TextField
            label={null}
            type="text"
            required={false}
            id={`${side}Detachment${i}`}
            name={`${side}Detachment${i}`}
            value={d}
            emptyValue="Enter Detachment"
            changeFunction={(e) => onDetachmentChange?.(i, e.target.value)}
          />
        </div>
      ))}
      {!props.IsCompleted && detachments.length < MAX_DETACHMENTS && (
        <button
          type="button"
          className="button button-secondary"
          onClick={onAddDetachment}
          style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}
        >
          + Add Detachment
        </button>
      )}
    </div>
  );

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

        {!showArmageddon && (
          <SelectField
            label="Primary Mission"
            required={true}
            id="primaryMission"
            name="PrimaryMission"
            changeFunction={props.changeFunctionSelect}
            value={props.PrimaryMission}
            options={primaryMissions}
            emptyValue="Select the Primary Mission"
            randomise={!props.IsCompleted}
          />
        )}

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

        {showArmageddon && bothDispositionsSelected && (
          <SelectField
            label="Layout"
            required={true}
            id="layout"
            name="Layout"
            changeFunction={props.changeFunctionSelect}
            value={props.Layout ?? ""}
            options={layoutOptions}
            emptyValue="Select Layout"
          />
        )}

        <div className={`opponent-layout ${!props.IsAttackerFirst ? "reverse" : ""}`}>
          {/* Attacker */}
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

            {!showArmageddon && (
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
            )}

            {showArmageddon && renderDetachments(
              "attacker",
              props.AttackerDetachments ?? [],
              props.onAttackerDetachmentChange,
              props.onAttackerAddDetachment,
              props.onAttackerRemoveDetachment,
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
                  options={dispositions.map((d) => ({ Label: d, Value: d, Active: true }))}
                  emptyValue="Select Force Disposition"
                />
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <SelectField
                      label="Primary Mission"
                      required={true}
                      id="attackerPrimaryMission"
                      name="AttackerPrimaryMission"
                      changeFunction={props.changeFunctionSelect}
                      value={props.AttackerPrimaryMission ?? ""}
                      options={primaryMissions11}
                      emptyValue="Select Primary Mission"
                      disabled={!bothDispositionsSelected}
                    />
                  </div>
                  {bothDispositionsSelected && props.AttackerPrimaryMission && (
                    <button
                      type="button"
                      className="button button-icon"
                      style={{ marginBottom: "1rem", fontSize: "1.1rem", padding: "0.4rem 0.6rem" }}
                      onClick={() => handleShowMissionCard(
                        props.AttackerPrimaryMission,
                        props.AttackerForceDisposition,
                        props.DefenderForceDisposition
                      )}
                      title="View mission card"
                    >
                      🃏
                    </button>
                  )}
                </div>
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

          {/* Defender */}
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

            {!showArmageddon && (
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
            )}

            {showArmageddon && renderDetachments(
              "defender",
              props.DefenderDetachments ?? [],
              props.onDefenderDetachmentChange,
              props.onDefenderAddDetachment,
              props.onDefenderRemoveDetachment,
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
                  options={dispositions.map((d) => ({ Label: d, Value: d, Active: true }))}
                  emptyValue="Select Force Disposition"
                />
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <SelectField
                      label="Primary Mission"
                      required={true}
                      id="defenderPrimaryMission"
                      name="DefenderPrimaryMission"
                      changeFunction={props.changeFunctionSelect}
                      value={props.DefenderPrimaryMission ?? ""}
                      options={primaryMissions11}
                      emptyValue="Select Primary Mission"
                      disabled={!bothDispositionsSelected}
                    />
                  </div>
                  {bothDispositionsSelected && props.DefenderPrimaryMission && (
                    <button
                      type="button"
                      className="button button-icon"
                      style={{ marginBottom: "1rem", fontSize: "1.1rem", padding: "0.4rem 0.6rem" }}
                      onClick={() => handleShowMissionCard(
                        props.DefenderPrimaryMission,
                        props.DefenderForceDisposition,
                        props.AttackerForceDisposition
                      )}
                      title="View mission card"
                    >
                      🃏
                    </button>
                  )}
                </div>
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

      {missionCardModal && (
        <MissionCardModal
          missionName={missionCardModal.missionName}
          disposition={missionCardModal.disposition}
          opponentDisposition={missionCardModal.opponentDisposition}
          onClose={() => setMissionCardModal(null)}
        />
      )}
    </>
  );
};

export default BattleFormPre;