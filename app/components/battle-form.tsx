"use client";

import {
  doc,
  getFirestore,
  setDoc,
  runTransaction,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import firebase_app from "../firebase/config";
import { useRouter } from "next/navigation";
import Spinner from "./spinner";
import { formatDate } from "../../utils/date-format";
import { battleSizes } from "../../data/battle-sizes";
import { deploymentZones } from "../../data/deployment-zones";
import { missionRules } from "../../data/mission-rules";
import { primaryMissions } from "../../data/primary-missions";
import SelectField from "./selectField";

const BattleForm = (props: { battleId: string }) => {
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const docId: string = props.battleId;

  //Hydrate state with battle data on load.
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Battles", docId), (doc) => {
      setBattle((prev) => {
        return { ...prev, ...doc.data() };
      });
    });
    return () => unsubscribe();
  }, []);

  const [battle, setBattle] = useState({
    Date: { seconds: null }, //Populated on doc creation.
    PrimaryMission: "",
    Size: "3000pt",
    MissionRule: "",
    Deployment: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBattle((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return battle.Date ? ( //Improve this.
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
              {/*
              - Attacker
              - Attacker Army
              - Attacker Detachment
              - Defender
              - Defender Army
              - Defender Detachment
              - First Turn
              */}
            </fieldset>
          </div>
        </form>
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default BattleForm;
