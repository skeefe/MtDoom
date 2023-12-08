"use client";

import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import firebase_app from "../firebase/config";
import Spinner from "./spinner";
import { formatDate } from "../../utils/date-format";
import { battleSizes } from "../../data/battle-sizes";
import { deploymentZones } from "../../data/deployment-zones";
import { missionRules } from "../../data/mission-rules";
import { primaryMissions } from "../../data/primary-missions";
import SelectField from "./selectField";
import TextField from "./textField";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import { collectionToSelect } from "../../utils/collection-to-select";
import { propertyFromID } from "../../utils/property-from-id";
import { selectOption } from "../types/select-option";
import BattleFormPost from "./battle-form-post";

//Hydrate state with battle data on load.
let isHydrated = false;

const BattleForm = (props: { battleId: string }) => {
  //const router = useRouter();
  const db = getFirestore(firebase_app);
  const docId: string = props.battleId;

  //Retrieve Battle
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Battles", docId), (doc) => {
      setBattle((prev) => {
        return { ...prev, ...doc.data() };
      });
    });
    isHydrated = true;
    return () => unsubscribe();
  }, []);

  //Hydrate State
  const [battle, setBattle] = useState({
    Date: { seconds: null },
    PrimaryMission: "",
    Size: "3000pt",
    MissionRule: "",
    Deployment: "",
    Attacker: "",
    AttackerArmy: "",
    AttackerDetachment: "",
    Defender: "",
    DefenderArmy: "",
    DefenderDetachment: "",
    FirstTurn: "",

    AttackerScore: 0,
    DefenderScore: 0,
    Victor: "",
    VictoryType: "",
    TurnEnded: 0,
    AttackerMVP: "",
    DefenderMVP: "",
    AttackerLVP: "",
    DefenderLVP: "",
    BattleNotes: "",
  });

  //Retrieve Generals
  const generalsCollection = getCollectionSnapshot("Generals", "Alias", "asc");
  const generals = collectionToSelect(generalsCollection, "Alias", "id");

  //Retrieve Armies
  const armiesCollection = getCollectionSnapshot("Armies", "Name", "asc");
  const armies = collectionToSelect(armiesCollection, "Name", "id");

  //Collect Opponents
  const collectOpponents = () => {
    let opponentsOptions: selectOption[] = [];

    if (battle.Attacker) {
      opponentsOptions.push({
        Label: `${propertyFromID(
          armiesCollection,
          battle.AttackerArmy,
          "Name"
        )} - ${propertyFromID(generalsCollection, battle.Attacker, "Alias")}`,
        Value: battle.Attacker,
        Active: true,
      });
    }
    if (battle.Defender) {
      opponentsOptions.push({
        Label: `${propertyFromID(
          armiesCollection,
          battle.DefenderArmy,
          "Name"
        )} - ${propertyFromID(generalsCollection, battle.Defender, "Alias")}`,
        Value: battle.Defender,
        Active: true,
      });
    }
    return opponentsOptions;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBattle((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return isHydrated ? (
    <>
      <section className="section">
        <header className="section-header">
          <h2>Battle Report</h2>
          <span className="battle-date">{formatDate(battle.Date.seconds)}</span>
        </header>

        <form>
          <div className="content content-dark">
            <fieldset>
              <legend>Pre-Battle Setup</legend>
              <SelectField
                label="Battle Size"
                required={true}
                id="battleSize"
                name="Size"
                changeFunction={handleChange}
                value={battle.Size}
                options={battleSizes}
                emptyValue="Select the Battle Size"
              />
              <SelectField
                label="Primary Mission"
                required={true}
                id="primaryMission"
                name="PrimaryMission"
                changeFunction={handleChange}
                value={battle.PrimaryMission}
                options={primaryMissions}
                emptyValue="Select the Primary Mission"
                randomise={true}
              />
              <SelectField
                label="Mission Rule"
                required={true}
                id="missionRule"
                name="MissionRule"
                changeFunction={handleChange}
                value={battle.MissionRule}
                options={missionRules}
                emptyValue="Select the Mission Rule"
                randomise={true}
              />
              <SelectField
                label="Deployment"
                required={true}
                id="deployment"
                name="Deployment"
                changeFunction={handleChange}
                value={battle.Deployment}
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
                    changeFunction={handleChange}
                    value={battle.Attacker}
                    //options={generals}
                    options={generals.filter(function (item) {
                      return item.Value != battle.Defender;
                    })}
                    emptyValue="Select the Attacker"
                  />
                  <SelectField
                    label="Army"
                    required={true}
                    id="attackerArmy"
                    name="AttackerArmy"
                    changeFunction={handleChange}
                    value={battle.AttackerArmy}
                    options={armies}
                    emptyValue="Select the Attacker Army"
                  />
                  <TextField
                    label="Detachment"
                    type="text"
                    required={true}
                    id="attackerDetachment"
                    name="AttackerDetachment"
                    changeFunction={handleChange}
                    value={battle.AttackerDetachment}
                    emptyValue="Enter Detachment"
                  />
                </div>

                <div className="opponent">
                  <legend>Defender</legend>
                  <SelectField
                    label="General"
                    required={true}
                    id="defender"
                    name="Defender"
                    changeFunction={handleChange}
                    value={battle.Defender}
                    //options={generals}
                    options={generals.filter(function (item) {
                      return item.Value != battle.Attacker;
                    })}
                    emptyValue="Select the Defender"
                  />
                  <SelectField
                    label="Army"
                    required={true}
                    id="defenderArmy"
                    name="DefenderArmy"
                    changeFunction={handleChange}
                    value={battle.DefenderArmy}
                    options={armies}
                    emptyValue="Select the Defender Army"
                  />
                  <TextField
                    label="Detachment"
                    type="text"
                    required={true}
                    id="defenderDetachment"
                    name="DefenderDetachment"
                    changeFunction={handleChange}
                    value={battle.DefenderDetachment}
                    emptyValue="Enter Detachment"
                  />
                </div>
              </div>
              <SelectField
                label="First Turn"
                required={true}
                id="firstTurn"
                name="FirstTurn"
                changeFunction={handleChange}
                value={battle.FirstTurn}
                options={collectOpponents()}
                emptyValue="Select the Player"
                noOptionsMessage="Please select an Attacker and Defender."
              />
            </fieldset>

            <BattleFormPost
              Opponents={collectOpponents()}
              AttackerScore={battle.AttackerScore}
              DefenderScore={battle.DefenderScore}
              Victor={battle.Victor}
              VictoryType={battle.VictoryType}
              TurnEnded={battle.TurnEnded}
              AttackerMVP={battle.AttackerMVP}
              DefenderMVP={battle.DefenderMVP}
              AttackerLVP={battle.AttackerLVP}
              DefenderLVP={battle.DefenderLVP}
              BattleNotes={battle.BattleNotes}
              changeFunctionSelect={handleChange}
              changeFunctionText={handleChange}
              changeFunctionTextArea={handleChange}
            />
          </div>
        </form>
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default BattleForm;
