import React, { useState, useEffect } from "react";
import { getFirestore, updateDoc, onSnapshot, doc, getDoc } from "firebase/firestore";
import firebase_app from "./../firebase/config";
import { formatDate } from "../utils/date-format";
import { primaryMissions } from "../data/primary-missions";
import { missionRules } from "../data/mission-rules";
import { deploymentZones } from "../data/deployment-zones";

const FormBattleReport = (battleID) => {
  const db = getFirestore(firebase_app);  
  const docId: string = battleID.battleID;
  const docRef = doc(db, "Battles", docId);

  const [report, setReport] = useState({
    Date: {seconds:null},//Populated on doc creation.
    PrimaryMission: "",
    MissionRule: "",
    Deployment: "",
    Attacker: "",
    AttackerArmy: "",
    Defender: "",
    DefenderArmy: "",
    FirstTurn: "",
    Size: "3000pt",
    T1AttackerSecondary1Title: "",
    T1AttackerSecondary1: "",
    T1AttackerSecondary2Title: "",
    T1AttackerSecondary2: "",
    T1DefenderSecondary1Title: "",
    T1DefenderSecondary1: "",
    T1DefenderSecondary2Title: "",
    T1DefenderSecondary2: "",
    T2AttackerPrimary: "",
    T2AttackerSecondary1Title: "",
    T2AttackerSecondary1: "",
    T2AttackerSecondary2Title: "",
    T2AttackerSecondary2: "",
    T2DefenderPrimary: "",
    T2DefenderSecondary1Title: "",
    T2DefenderSecondary1: "",
    T2DefenderSecondary2Title: "",
    T2DefenderSecondary2: "",
    T3AttackerPrimary: "",
    T3AttackerSecondary1Title: "",
    T3AttackerSecondary1: "",
    T3AttackerSecondary2Title: "",
    T3AttackerSecondary2: "",
    T3DefenderPrimary: "",
    T3DefenderSecondary1Title: "",
    T3DefenderSecondary1: "",
    T3DefenderSecondary2Title: "",
    T3DefenderSecondary2: "",
    T4AttackerPrimary: "",
    T4AttackerSecondary1Title: "",
    T4AttackerSecondary1: "",
    T4AttackerSecondary2Title: "",
    T4AttackerSecondary2: "",
    T4DefenderPrimary: "",
    T4DefenderSecondary1Title: "",
    T4DefenderSecondary1: "",
    T4DefenderSecondary2Title: "",
    T4DefenderSecondary2: "",
    T5AttackerPrimary: "",
    T5AttackerSecondary1Title: "",
    T5AttackerSecondary1: "",
    T5AttackerSecondary2Title: "",
    T5AttackerSecondary2: "",
    T5DefenderPrimary: "",
    T5DefenderSecondary1Title: "",
    T5DefenderSecondary1: "",
    T5DefenderSecondary2Title: "",
    T5DefenderSecondary2: "",
    AttackerMissionBonus: "",
    DefenderMissionBonus: "",
    Victor: "",
    VictoryType: "",
    TurnEnded: 0,
    AttackerMVP: "",
    DefenderMVP: "",
    Notes: "",
    TotalAttackerPrimary:0,//50
    TotalAttackerSecondary:0,//40
    TotalAttacker: 0,
    TotalDefenderPrimary:0,//50
    TotalDefenderSecondary:0,//40
    TotalDefender: 0,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Battles", docId), (doc) => {
      setReport((prev) => {
        return { ...prev, ...doc.data() };
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [
    report.T1AttackerSecondary1,
    report.T1AttackerSecondary2,
    report.T1DefenderSecondary1,
    report.T1DefenderSecondary2,
    report.T2AttackerPrimary,
    report.T2AttackerSecondary1,
    report.T2AttackerSecondary2,
    report.T2DefenderPrimary,
    report.T2DefenderSecondary1,
    report.T2DefenderSecondary2,
    report.T3AttackerPrimary,
    report.T3AttackerSecondary1,
    report.T3AttackerSecondary2,
    report.T3DefenderPrimary,
    report.T3DefenderSecondary1,
    report.T3DefenderSecondary2,
    report.T4AttackerPrimary,
    report.T4AttackerSecondary1,
    report.T4AttackerSecondary2,
    report.T4DefenderPrimary,
    report.T4DefenderSecondary1,
    report.T4DefenderSecondary2,
    report.T5AttackerPrimary,
    report.T5AttackerSecondary1,
    report.T5AttackerSecondary2,
    report.T5DefenderPrimary,
    report.T5DefenderSecondary1,
    report.T5DefenderSecondary2,
    report.AttackerMissionBonus,
    report.DefenderMissionBonus,
  ]);

  function handleChange(e, calculate: boolean = false) {
    const name = e.target.name;
    let value: number = e.target.value;

    //Update FB
    updateDoc(docRef, { [name]: value })
      .then((docRef) => {
        console.log("Updated");
      })
      .catch((error) => {
        console.log(error);
      });

    if (calculate) {
      value = parseFloat(e.target.value);

      if (isNaN(value)) {
        value = 0;
      }
    }
    setReport((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function calculateTotal() {
    
    let TotalAttackerPrimary: number =
      getNumber(report.T2AttackerPrimary) +
      getNumber(report.T3AttackerPrimary) +
      getNumber(report.T4AttackerPrimary) +
      getNumber(report.T5AttackerPrimary);
    TotalAttackerPrimary = TotalAttackerPrimary > 50 ? 50 : TotalAttackerPrimary;

    let TotalAttackerSecondary: number =
      getNumber(report.T1AttackerSecondary1) +
      getNumber(report.T1AttackerSecondary2) +
      getNumber(report.T2AttackerSecondary1) +
      getNumber(report.T2AttackerSecondary2) +
      getNumber(report.T3AttackerSecondary1) +
      getNumber(report.T3AttackerSecondary2) +
      getNumber(report.T4AttackerSecondary1) +
      getNumber(report.T4AttackerSecondary2) +
      getNumber(report.T5AttackerSecondary1) +
      getNumber(report.T5AttackerSecondary2) +
      getNumber(report.AttackerMissionBonus);
    TotalAttackerSecondary = TotalAttackerSecondary > 40 ? 40 : TotalAttackerSecondary;
    
    const TotalAttacker: number =
      TotalAttackerPrimary +
      TotalAttackerSecondary +
      getNumber(report.AttackerMissionBonus);

    let TotalDefenderPrimary: number =
      getNumber(report.T2DefenderPrimary) +
      getNumber(report.T3DefenderPrimary) +
      getNumber(report.T4DefenderPrimary) +
      getNumber(report.T5DefenderPrimary);
    TotalDefenderPrimary = TotalDefenderPrimary > 50 ? 50 : TotalDefenderPrimary;

    let TotalDefenderSecondary: number =
      getNumber(report.T1DefenderSecondary1) +
      getNumber(report.T1DefenderSecondary2) +
      getNumber(report.T2DefenderSecondary1) +
      getNumber(report.T2DefenderSecondary2) +
      getNumber(report.T3DefenderSecondary1) +
      getNumber(report.T3DefenderSecondary2) +
      getNumber(report.T4DefenderSecondary1) +
      getNumber(report.T4DefenderSecondary2) +
      getNumber(report.T5DefenderSecondary1) +
      getNumber(report.T5DefenderSecondary2);
    TotalDefenderSecondary = TotalDefenderSecondary > 40 ? 40 : TotalDefenderSecondary;
    
    const TotalDefender: number =
      TotalDefenderPrimary +
      TotalDefenderSecondary +
      getNumber(report.DefenderMissionBonus);

    setReport((prev) => {
      updateDoc(docRef, {
        TotalAttacker: TotalAttacker,
        TotalDefender: TotalDefender,
      }).catch((error) => {
        console.log(error);
      });

      return {
        ...prev,
        ["TotalAttackerPrimary"]: TotalAttackerPrimary,
        ["TotalAttackerSecondary"]: TotalAttackerSecondary,
        ["TotalAttacker"]: TotalAttacker,
        ["TotalDefenderPrimary"]: TotalDefenderPrimary,
        ["TotalDefenderSecondary"]: TotalDefenderSecondary,
        ["TotalDefender"]: TotalDefender,
      };
    });
  }

  function getNumber(value) {
    let val = parseFloat(value);
    if (isNaN(val)) {
      val = 0;
    }
    return val;
  }

  function handleRandomise(data, property){
    const selection = data[Math.floor(Math.random()*data.length)];

    //Update FB
    updateDoc(docRef, { [property]: selection["value"] })
    .then((docRef) => {
      console.log("Updated");
    })
    .catch((error) => {
      console.log(error);
    });

    setReport((prev) => {
      return { ...prev, [property]: selection["value"] };
    });

    return;
  }


  /*
  //On Change highlight.
  const [borderColor, setBorderColor] = React.useState("initial");
  const updateTimer = React.useRef(null);

  React.useEffect(() => {
    return () => {
        if (updateTimer.current) {
            clearTimeout(updateTimer.current);
        }
    };
  }, []);

  React.useEffect(() => {
    if (!updateTimer.current) setUpdate();
  }, [report.PrimaryMission]);

  function setUpdate() {
    setBorderColor("#0284c7");
    updateTimer.current = setTimeout(() => {
        setBorderColor("transparent");
        updateTimer.current = null;
    }, 1000);
  }
  */
  return (
    <>
      <div className="lg:flex gap-x-12">
        <section id="calculator" className="lg:flex-1">
          <div className="content relative">
            <time className="hidden sm:inline sm:absolute sm:right-0 sm:pr-8">{formatDate(report.Date.seconds)}</time>
            <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8">
              Battle Report
            </h1>
            <form>
              {/* SETUP */}
              <fieldset>
                <legend>Setup</legend>

                <div className="mb-3">
                  <label htmlFor="size">Battle Size:</label>
                  <select
                    id="size"
                    name="Size"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    required
                    value={report.Size}
                  >
                    <option value="1000pts">1000pts</option>
                    <option value="1500pts">1500pts</option>
                    <option value="2000pts">2000pts</option>
                    <option value="3000pts">3000pts</option>
                  </select>
                </div>

                <div className="mb-3 random">
                  <label htmlFor="primaryMission">Primary Mission:</label>
                  <select
                    id="primaryMission"
                    name="PrimaryMission"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    required
                    value={report.PrimaryMission}>
                    <option value="">-- Select the Primary Mission --</option>   
                    {primaryMissions.map((mission) => <option value={mission.value}>{mission.label}</option>)}
                  </select>
                  <button onClick={(event) => handleRandomise(primaryMissions, "PrimaryMission")}>🎲</button>
                </div>

                <div className="mb-3 random">
                  <label htmlFor="missionRule">Mission Rule:</label>
                  <select
                    id="missionRule"
                    name="MissionRule"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    required
                    value={report.MissionRule}>
                    <option value="">-- Select the Mission Rule --</option>   
                    {missionRules.map((mission) => <option value={mission.value}>{mission.label}</option>)}
                  </select>
                  <button onClick={(event) => handleRandomise(missionRules, "MissionRule")}>🎲</button>
                </div>

                <div className="mb-3 random">
                  <label htmlFor="missionRule">Deployment:</label>
                  <select
                    id="deployment"
                    name="Deployment"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    required
                    value={report.Deployment}>
                    <option value="">-- Select the Deployment Type --</option>   
                    {deploymentZones.map((deployment) => <option value={deployment.value}>{deployment.label}</option>)}
                  </select>
                  <button onClick={(event) => handleRandomise(deploymentZones, "Deployment")}>🎲</button>
                </div>

                <div className="mb-3">
                  <label htmlFor="attacker">Attacker:</label>
                  <select
                    id="attacker"
                    name="Attacker"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    placeholder="Select the Attacker"
                    value={report.Attacker}
                    required
                  >
                    <option value="">-- Select the Attacker --</option>
                    <option value="James">JSmooth</option>
                    <option value="Andy">Spoonz</option>
                    <option value="Simon">Sir Sibot</option>
                    <option value="Josh">Joshita</option>
                    <option value="Luce">Bug-a-Lugs</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="attackerArmy">Attacker Army:</label>
                  <select
                    id="attackerArmy"
                    name="AttackerArmy"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    placeholder="Select the Attacker Army"
                    value={report.AttackerArmy}
                    required
                  >
                    <option value="">-- Select the Attacker Army --</option>
                    <option value="Astra Militarum">Astra Militarum</option>
                    <option value="Space Wolves">Space Wolves</option>
                    <option value="Ultramarines">Ultramarines</option>
                    <option value="Craftworld">Craftworld</option>
                    <option value="Blood Angels">Filthy Blood Angels</option>
                    <option value="Cold Blooded">Coldies</option>
                    <option value="Tau">Tau</option>
                    <option value="Bastiladons">Bastiladons</option>
                    <option value="Rusty Jeckyls">Rusty Jeckyls</option>
                    <option value="Orks">Orks</option>
                    <option value="Necrons">Necrons</option>
                    <option value="Imperial Knights">Imperial Knights</option>
                    <option value="Deathwatch">Deathwatch</option>
                    <option value="Dark Angels">Dark Angels</option>
                    <option value="Custodes">Custodes</option>
                    <option value="Ad Mech">Ad Mech</option>
                    <option value="Bridgeburners">Bridgeburners</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="defender">Defender:</label>
                  <select
                    id="defender"
                    name="Defender"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    placeholder="Select the Defender"
                    value={report.Defender}
                    required
                  >
                    <option value="">-- Select the Defender --</option>
                    <option value="James">JSmooth</option>
                    <option value="Andy">Spoonz</option>
                    <option value="Simon">Sir Sibot</option>
                    <option value="Josh">Joshita</option>
                    <option value="Luce">Bug-a-Lugs</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="defenderArmy">Defender Army:</label>
                  <select
                    id="defenderArmy"
                    name="DefenderArmy"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    placeholder="Select the Defender"
                    value={report.DefenderArmy}
                    required
                  >
                    <option value="">-- Select the Defender Army --</option>
                    <option value="Astra Militarum">Astra Militarum</option>
                    <option value="Space Wolves">Space Wolves</option>
                    <option value="Ultramarines">Ultramarines</option>
                    <option value="Craftworld">Craftworld</option>
                    <option value="Blood Angels">Filthy Blood Angels</option>
                    <option value="Cold Blooded">Coldies</option>
                    <option value="Tau">Tau</option>
                    <option value="Bastiladons">Bastiladons</option>
                    <option value="Rusty Jeckyls">Rusty Jeckyls</option>
                    <option value="Orks">Orks</option>
                    <option value="Necrons">Necrons</option>
                    <option value="Imperial Knights">Imperial Knights</option>
                    <option value="Deathwatch">Deathwatch</option>
                    <option value="Dark Angels">Dark Angels</option>
                    <option value="Custodes">Custodes</option>
                    <option value="Ad Mech">Ad Mech</option>
                    <option value="Bridgeburners">Bridgeburners</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="firstTurn">First Turn:</label>
                  <select
                    id="firstTurn"
                    name="FirstTurn"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    placeholder="Select the Player"
                    value={report.FirstTurn}
                    required
                  >
                    <option value="">-- Select the Player --</option>
                    <option value="James">JSmooth</option>
                    <option value="Andy">Spoonz</option>
                    <option value="Simon">Sir Sibot</option>
                    <option value="Josh">Joshita</option>
                    <option value="Luce">Bug-a-Lugs</option>
                  </select>
                </div>
              </fieldset>

              {/* TURN 1 */}
              <fieldset>
                <legend>Turn 1</legend>
                <div className="player">
                  <div className="secondaries">
                    <div className="mb-3">
                      <label htmlFor="t1AttackerSecondary1Title">
                        1 Title:
                      </label>
                      <input
                        id="t1AttackerSecondary1Title"
                        name="T1AttackerSecondary1Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T1AttackerSecondary1Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t1AttackerSecondary1">1 Points:</label>
                      <input
                        id="t1AttackerSecondary1"
                        name="T1AttackerSecondary1"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T1AttackerSecondary1}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t1AttackerSecondary2Title">
                        2 Title:
                      </label>
                      <input
                        id="t1AttackerSecondary2Title"
                        name="T1AttackerSecondary2Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T1AttackerSecondary2Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t1AttackerSecondary2">2 Points:</label>
                      <input
                        id="t1AttackerSecondary2"
                        name="T1AttackerSecondary2"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T1AttackerSecondary2}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="player">
                  <div className="secondaries">
                    <div className="mb-3">
                      <label htmlFor="t1DefenderSecondary1Title">
                        1 Title:
                      </label>
                      <input
                        id="t1DefenderSecondary1Title"
                        name="T1DefenderSecondary1Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T1DefenderSecondary1Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t1DefenderSecondary1">1 Points:</label>
                      <input
                        id="t1DefenderSecondary1"
                        name="T1DefenderSecondary1"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T1DefenderSecondary1}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t1DefenderSecondary2Title">
                        2 Title:
                      </label>
                      <input
                        id="t1DefenderSecondary2Title"
                        name="T1DefenderSecondary2Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T1DefenderSecondary2Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t1DefenderSecondary2">2 Points:</label>
                      <input
                        id="t1DefenderSecondary2"
                        name="T1DefenderSecondary2"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T1DefenderSecondary2}
                        required
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* TURN 2 */}
              <fieldset>
                <legend>Turn 2</legend>
                <div className="player">
                  <div className="mb-3">
                    <label htmlFor="t2AttackerPrimary">Primary Points:</label>
                    <input
                      id="t2AttackerPrimary"
                      name="T2AttackerPrimary"
                      placeholder="--"
                      type="number"
                      className="border p-2 w-full"
                      onChange={(event) => handleChange(event, true)}
                      min="0"
                      max="15"
                      value={report.T2AttackerPrimary}
                      required
                    />
                  </div>

                  <div className="secondaries">
                    <div className="mb-3">
                      <label htmlFor="t2AttackerSecondary1Title">
                        1 Title:
                      </label>
                      <input
                        id="t2AttackerSecondary1Title"
                        name="T2AttackerSecondary1Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T2AttackerSecondary1Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t2AttackerSecondary1">1 Points:</label>
                      <input
                        id="t2AttackerSecondary1"
                        name="T2AttackerSecondary1"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T2AttackerSecondary1}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t2AttackerSecondary2Title">
                        2 Title:
                      </label>
                      <input
                        id="t2AttackerSecondary2Title"
                        name="T2AttackerSecondary2Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T2AttackerSecondary2Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t2AttackerSecondary2">2 Points:</label>
                      <input
                        id="t2AttackerSecondary2"
                        name="T2AttackerSecondary2"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T2AttackerSecondary2}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="player">
                  <div className="mb-3">
                    <label htmlFor="t2DefenderPrimary">Primary Points:</label>
                    <input
                      id="t2DefenderPrimary"
                      name="T2DefenderPrimary"
                      placeholder="--"
                      type="number"
                      className="border p-2 w-full"
                      onChange={(event) => handleChange(event, true)}
                      min="0"
                      max="15"
                      value={report.T2DefenderPrimary}
                      required
                    />
                  </div>

                  <div className="secondaries">
                    <div className="mb-3">
                      <label htmlFor="t2DefenderSecondary1Title">
                        1 Title:
                      </label>
                      <input
                        id="t2DefenderSecondary1Title"
                        name="T2DefenderSecondary1Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T2DefenderSecondary1Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t2DefenderSecondary1">1 Points:</label>
                      <input
                        id="t2DefenderSecondary1"
                        name="T2DefenderSecondary1"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T2DefenderSecondary1}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t2DefenderSecondary2Title">
                        2 Title:
                      </label>
                      <input
                        id="t2DefenderSecondary2Title"
                        name="T2DefenderSecondary2Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T2DefenderSecondary2Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t2DefenderSecondary2">2 Points:</label>
                      <input
                        id="t2DefenderSecondary2"
                        name="T2DefenderSecondary2"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T2DefenderSecondary2}
                        required
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* TURN 3 */}
              <fieldset>
                <legend>Turn 3</legend>
                <div className="player">
                  <div className="mb-3">
                    <label htmlFor="t3AttackerPrimary">Primary Points:</label>
                    <input
                      id="t3AttackerPrimary"
                      name="T3AttackerPrimary"
                      placeholder="--"
                      type="number"
                      className="border p-2 w-full"
                      onChange={(event) => handleChange(event, true)}
                      min="0"
                      max="15"
                      value={report.T3AttackerPrimary}
                      required
                    />
                  </div>

                  <div className="secondaries">
                    <div className="mb-3">
                      <label htmlFor="t3AttackerSecondary1Title">
                        1 Title:
                      </label>
                      <input
                        id="t3AttackerSecondary1Title"
                        name="T3AttackerSecondary1Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T3AttackerSecondary1Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t3AttackerSecondary1">1 Points:</label>
                      <input
                        id="t3AttackerSecondary1"
                        name="T3AttackerSecondary1"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T3AttackerSecondary1}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t3AttackerSecondary2Title">
                        2 Title:
                      </label>
                      <input
                        id="t3AttackerSecondary2Title"
                        name="T3AttackerSecondary2Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T3AttackerSecondary2Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t3AttackerSecondary2">2 Points:</label>
                      <input
                        id="t3AttackerSecondary2"
                        name="T3AttackerSecondary2"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T3AttackerSecondary2}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="player">
                  <div className="mb-3">
                    <label htmlFor="t3DefenderPrimary">Primary Points:</label>
                    <input
                      id="primary"
                      name="T3DefenderPrimary"
                      placeholder="--"
                      type="number"
                      className="border p-2 w-full"
                      onChange={(event) => handleChange(event, true)}
                      min="0"
                      max="15"
                      value={report.T3DefenderPrimary}
                      required
                    />
                  </div>

                  <div className="secondaries">
                    <div className="mb-3">
                      <label htmlFor="t3DefenderSecondary1Title">
                        1 Title:
                      </label>
                      <input
                        id="t3DefenderSecondary1Title"
                        name="T3DefenderSecondary1Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T3DefenderSecondary1Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t3DefenderSecondary1">1 Points:</label>
                      <input
                        id="t3DefenderSecondary1"
                        name="T3DefenderSecondary1"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T3DefenderSecondary1}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t3DefenderSecondary2Title">
                        2 Title:
                      </label>
                      <input
                        id="t3DefenderSecondary2Title"
                        name="T3DefenderSecondary2Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        value={report.T3DefenderSecondary2Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t3DefenderSecondary2">2 Points:</label>
                      <input
                        id="t3DefenderSecondary2"
                        name="T3DefenderSecondary2"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T3DefenderSecondary2}
                        required
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* TURN 4 */}
              <fieldset>
                <legend>Turn 4</legend>
                <div className="player">
                  <div className="mb-3">
                    <label htmlFor="t4AttackerPrimary">Primary Points:</label>
                    <input
                      id="primary"
                      name="T4AttackerPrimary"
                      placeholder="--"
                      type="number"
                      className="border p-2 w-full"
                      onChange={(event) => handleChange(event, true)}
                      min="0"
                      max="15"
                      value={report.T4AttackerPrimary}
                      required
                    />
                  </div>

                  <div className="secondaries">
                    <div className="mb-3">
                      <label htmlFor="t4AttackerSecondary1Title">
                        1 Title:
                      </label>
                      <input
                        id="t4AttackerSecondary1Title"
                        name="T4AttackerSecondary1Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T4AttackerSecondary1Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t4AttackerSecondary1">1 Points:</label>
                      <input
                        id="t4AttackerSecondary1"
                        name="T4AttackerSecondary1"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T4AttackerSecondary1}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t4AttackerSecondary2Title">
                        2 Title:
                      </label>
                      <input
                        id="t4AttackerSecondary2Title"
                        name="T4AttackerSecondary2Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T4AttackerSecondary2Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t4AttackerSecondary2">2 Points:</label>
                      <input
                        id="t4AttackerSecondary2"
                        name="T4AttackerSecondary2"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T4AttackerSecondary2}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="player">
                  <div className="mb-3">
                    <label htmlFor="t4DefenderPrimary">Primary Points:</label>
                    <input
                      id="primary"
                      name="T4DefenderPrimary"
                      placeholder="--"
                      type="number"
                      className="border p-2 w-full"
                      onChange={(event) => handleChange(event, true)}
                      min="0"
                      max="15"
                      value={report.T4DefenderPrimary}
                      required
                    />
                  </div>

                  <div className="secondaries">
                    <div className="mb-3">
                      <label htmlFor="t4DefenderSecondary1Title">
                        1 Title:
                      </label>
                      <input
                        id="t4DefenderSecondary1Title"
                        name="T4DefenderSecondary1Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T4DefenderSecondary1Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t4DefenderSecondary1">1 Points:</label>
                      <input
                        id="t4DefenderSecondary1"
                        name="T4DefenderSecondary1"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T4DefenderSecondary1}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t4DefenderSecondary2Title">
                        2 Title:
                      </label>
                      <input
                        id="t4DefenderSecondary2Title"
                        name="T4DefenderSecondary2Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T4DefenderSecondary2Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t4DefenderSecondary2">2 Points:</label>
                      <input
                        id="t4DefenderSecondary2"
                        name="T4DefenderSecondary2"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T4DefenderSecondary2}
                        required
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* TURN 5 */}
              <fieldset>
                <legend>Turn 5</legend>
                <div className="player">
                  <div className="mb-3">
                    <label htmlFor="t5AttackerPrimary">Primary Points:</label>
                    <input
                      id="t5AttackerPrimary"
                      name="T5AttackerPrimary"
                      placeholder="--"
                      type="number"
                      className="border p-2 w-full"
                      onChange={(event) => handleChange(event, true)}
                      min="0"
                      max="15"
                      value={report.T5AttackerPrimary}
                      required
                    />
                  </div>

                  <div className="secondaries">
                    <div className="mb-3">
                      <label htmlFor="t5AttackerSecondary1Title">
                        1 Title:
                      </label>
                      <input
                        id="t5AttackerSecondary1Title"
                        name="T5AttackerSecondary1Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T5AttackerSecondary1Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t5AttackerSecondary1">1 Points:</label>
                      <input
                        id="t5AttackerSecondary1"
                        name="T5AttackerSecondary1"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T5AttackerSecondary1}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t5AttackerSecondary2Title">
                        2 Title:
                      </label>
                      <input
                        id="t5AttackerSecondary2Title"
                        name="T5AttackerSecondary2Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T5AttackerSecondary2Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t5AttackerSecondary2">2 Points:</label>
                      <input
                        id="t5AttackerSecondary2"
                        name="T5AttackerSecondary2"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T5AttackerSecondary2}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="player">
                  <div className="mb-3">
                    <label htmlFor="t5DefenderPrimary">Primary Points:</label>
                    <input
                      id="primary"
                      name="T5DefenderPrimary"
                      placeholder="--"
                      type="number"
                      className="border p-2 w-full"
                      onChange={(event) => handleChange(event, true)}
                      min="0"
                      max="15"
                      value={report.T5DefenderPrimary}
                      required
                    />
                  </div>

                  <div className="secondaries">
                    <div className="mb-3">
                      <label htmlFor="t5DefenderSecondary1Title">
                        1 Title:
                      </label>
                      <input
                        id="t5DefenderSecondary1Title"
                        name="T5DefenderSecondary1Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T5DefenderSecondary1Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t5DefenderSecondary1">1 Points:</label>
                      <input
                        id="t5DefenderSecondary1"
                        name="T5DefenderSecondary1"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T5DefenderSecondary1}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t5DefenderSecondary2Title">
                        2 Title:
                      </label>
                      <input
                        id="t5DefenderSecondary2Title"
                        name="T5DefenderSecondary2Title"
                        placeholder="Enter Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        value={report.T5DefenderSecondary2Title}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="t5DefenderSecondary2">2 Points:</label>
                      <input
                        id="t5DefenderSecondary2"
                        name="T5DefenderSecondary2"
                        placeholder="--"
                        type="number"
                        className="border p-2 w-full"
                        onChange={(event) => handleChange(event, true)}
                        min="0"
                        max="15"
                        value={report.T5DefenderSecondary2}
                        required
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* END OF GAME */}
              <fieldset>
                <legend>End of Game</legend>
                <div className="player">
                  <div className="mb-3">
                    <label htmlFor="attackerMissionBonus">Mission Bonus:</label>
                    <input
                      id="attackerMissionBonus"
                      name="AttackerMissionBonus"
                      placeholder="--"
                      type="number"
                      className="border p-2 w-full"
                      onChange={(event) => handleChange(event, true)}
                      min="0"
                      max="15"
                      value={report.AttackerMissionBonus}
                      required
                    />
                  </div>
                </div>
                <div className="player">
                  <div className="mb-3">
                    <label htmlFor="defenderMissionBonus">Mission Bonus:</label>
                    <input
                      id="defenderMissionBonus"
                      name="DefenderMissionBonus"
                      placeholder="--"
                      type="number"
                      className="border p-2 w-full"
                      onChange={(event) => handleChange(event, true)}
                      min="0"
                      max="15"
                      value={report.DefenderMissionBonus}
                      required
                    />
                  </div>
                </div>
              </fieldset>

              {/* POST GAME */}
              <fieldset>
                <legend>Post Game</legend>

                <div className="mb-20">
                  <h2 className="text-center uppercase">Total Scores</h2>
                  <div className="player score text-8xl font-bold">
                    {report.TotalAttacker}
                  </div>
                  <div className="player score text-8xl font-bold text-right">
                    {report.TotalDefender}
                  </div>
                </div>

                <div className="mb-3 pt-6">
                  <label htmlFor="victor">Victor:</label>
                  <select
                    id="victor"
                    name="Victor"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    placeholder="Select the Victor"
                    value={report.Victor}
                    required
                  >
                    <option value="">-- Select the Victor --</option>
                    <option value="James">JSmooth</option>
                    <option value="Andy">Spoonz</option>
                    <option value="Simon">Sir Sibot</option>
                    <option value="Josh">Joshita</option>
                    <option value="Luce">Bug-a-Lugs</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="victoryType">Victory Type:</label>
                  <select
                    id="victoryType"
                    name="VictoryType"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    placeholder="Select the Victory Type"
                    value={report.VictoryType}
                    required
                  >
                    <option value="">-- Select the Victory Type --</option>
                    <option value="Points Victory">Points Victory</option>
                    <option value="Points Draw">Points Draw</option>
                    <option value="Tabling">Tabling</option>
                    <option value="Crushing Victory">Crushing Victory</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="turnEnded">Turn Ended:</label>
                  <select
                    id="turnEnded"
                    name="TurnEnded"
                    className="border p-2 w-full"
                    onChange={handleChange}
                    placeholder="Select the Turn"
                    value={report.TurnEnded}
                    required
                  >
                    <option value="">-- Select the Turn --</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="attackerMVP">Attacker MVP:</label>
                  <input
                    id="attackerMVP"
                    name="AttackerMVP"
                    placeholder="Attacker MVP"
                    type="text"
                    className="border p-2 w-full"
                    onChange={(event) => handleChange(event)}
                    value={report.AttackerMVP}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="defenderMVP">Defender MVP:</label>
                  <input
                    id="defenderMVP"
                    name="DefenderMVP"
                    placeholder="Attacker MVP"
                    type="text"
                    className="border p-2 w-full"
                    onChange={(event) => handleChange(event)}
                    value={report.DefenderMVP}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="notes">Battle Notes:</label>
                  <textarea
                    id="notes"
                    name="Notes"
                    placeholder="Notes"
                    className="border p-2  w-full"
                    onChange={(event) => handleChange(event)}
                    value={report.Notes}
                    required
                  ></textarea>
                </div>
              </fieldset>
            </form>
          </div>
        </section>

        <section id="results" className="lg:w-96 lg:flex-none">
            <div className="score-panel text-center fixed lg:w-96">
              <span></span>
              <div className="player score text-2xl font-bold">
                {report.TotalAttacker}
              </div>
              <div className="player score text-2xl font-bold">
                {report.TotalDefender}
              </div>
            </div>
        </section>

      </div>

      <div className="score-bar text-center">
        <span></span>
        <div className="player score text-2xl font-bold">
          {report.TotalAttacker}
        </div>
        <div className="player score text-2xl font-bold">
          {report.TotalDefender}
        </div>
      </div>
    </>
  );
};

export default FormBattleReport;
