"use client";
import React, { useEffect, useState } from "react";
import {
  doc,
  getFirestore,
  increment,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import firebase_app from "../firebase/config";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";

import { selectOption } from "../types/select-option";
import { iBattle } from "../types/battle";

import { formatDate } from "../../utils/date-format";
import { collectionToSelect } from "../../utils/collection-to-select";
import { propertyFromID } from "../../utils/property-from-id";
import { stringToNumber } from "../../utils/string-to-number";

import Spinner from "./spinner";
import BattleFormPre from "./battle-form-pre";
import BattleFormRound from "./battle-form-round";
import BattleFormEnd from "./battle-form-end";
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
  const [battle, setBattle] = useState<iBattle>({
    id: props.battleId,
    IsCompleted: false,

    Date: {
      seconds: 0,
    },
    PrimaryMission: "",
    Size: "3000pt",
    MissionRule: "",
    Deployment: "",
    Attacker: "",
    AttackerArmy: "",
    AttackerDetachment: "",
    AttackerList: "",
    Defender: "",
    DefenderArmy: "",
    DefenderDetachment: "",
    DefenderList: "",
    FirstTurn: "",

    T1AttackerPrimary: 0,
    T2AttackerPrimary: 0,
    T3AttackerPrimary: 0,
    T4AttackerPrimary: 0,
    T5AttackerPrimary: 0,
    AttackerMissionBonus: 0,
    TotalAttackerPrimary: 0,

    T1AttackerSecondary1Title: "",
    T1AttackerSecondary1: 0,
    T1AttackerSecondary2Title: "",
    T1AttackerSecondary2: 0,
    T2AttackerSecondary1Title: "",
    T2AttackerSecondary1: 0,
    T2AttackerSecondary2Title: "",
    T2AttackerSecondary2: 0,
    T3AttackerSecondary1Title: "",
    T3AttackerSecondary1: 0,
    T3AttackerSecondary2Title: "",
    T3AttackerSecondary2: 0,
    T4AttackerSecondary1Title: "",
    T4AttackerSecondary1: 0,
    T4AttackerSecondary2Title: "",
    T4AttackerSecondary2: 0,
    T5AttackerSecondary1Title: "",
    T5AttackerSecondary1: 0,
    T5AttackerSecondary2Title: "",
    T5AttackerSecondary2: 0,
    TotalAttackerSecondary: 0,

    TotalAttacker: 0,

    T1DefenderPrimary: 0,
    T2DefenderPrimary: 0,
    T3DefenderPrimary: 0,
    T4DefenderPrimary: 0,
    T5DefenderPrimary: 0,
    DefenderMissionBonus: 0,
    TotalDefenderPrimary: 0,

    T1DefenderSecondary1Title: "",
    T1DefenderSecondary1: 0,
    T1DefenderSecondary2Title: "",
    T1DefenderSecondary2: 0,
    T2DefenderSecondary1Title: "",
    T2DefenderSecondary1: 0,
    T2DefenderSecondary2Title: "",
    T2DefenderSecondary2: 0,
    T3DefenderSecondary1Title: "",
    T3DefenderSecondary1: 0,
    T3DefenderSecondary2Title: "",
    T3DefenderSecondary2: 0,
    T4DefenderSecondary1Title: "",
    T4DefenderSecondary1: 0,
    T4DefenderSecondary2Title: "",
    T4DefenderSecondary2: 0,
    T5DefenderSecondary1Title: "",
    T5DefenderSecondary1: 0,
    T5DefenderSecondary2Title: "",
    T5DefenderSecondary2: 0,
    TotalDefenderSecondary: 0,

    TotalDefender: 0,

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

  //Handle Change
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    //Update State
    setBattle((prev) => {
      return { ...prev, [name]: value };
    });

    //Update Firestore
    updateDoc(doc(db, "Battles", docId), { [name]: value })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  //Handle Points Calculate
  useEffect(() => {
    //-- Primary --
    let totalAttackerPrimary: number =
      stringToNumber(battle.T1AttackerPrimary.toString()) +
      stringToNumber(battle.T2AttackerPrimary.toString()) +
      stringToNumber(battle.T3AttackerPrimary.toString()) +
      stringToNumber(battle.T4AttackerPrimary.toString()) +
      stringToNumber(battle.T5AttackerPrimary.toString()) +
      stringToNumber(battle.AttackerMissionBonus.toString());
    totalAttackerPrimary =
      totalAttackerPrimary > 50 ? 50 : totalAttackerPrimary;

    let totalDefenderPrimary: number =
      stringToNumber(battle.T1DefenderPrimary.toString()) +
      stringToNumber(battle.T2DefenderPrimary.toString()) +
      stringToNumber(battle.T3DefenderPrimary.toString()) +
      stringToNumber(battle.T4DefenderPrimary.toString()) +
      stringToNumber(battle.T5DefenderPrimary.toString()) +
      stringToNumber(battle.DefenderMissionBonus.toString());
    totalDefenderPrimary =
      totalDefenderPrimary > 50 ? 50 : totalDefenderPrimary;

    //-- Secondary --
    let totalAttackerSecondary: number =
      stringToNumber(battle.T1AttackerSecondary1.toString()) +
      stringToNumber(battle.T1AttackerSecondary2.toString()) +
      stringToNumber(battle.T2AttackerSecondary1.toString()) +
      stringToNumber(battle.T2AttackerSecondary2.toString()) +
      stringToNumber(battle.T3AttackerSecondary1.toString()) +
      stringToNumber(battle.T3AttackerSecondary2.toString()) +
      stringToNumber(battle.T4AttackerSecondary1.toString()) +
      stringToNumber(battle.T4AttackerSecondary2.toString()) +
      stringToNumber(battle.T5AttackerSecondary1.toString()) +
      stringToNumber(battle.T5AttackerSecondary2.toString());
    totalAttackerSecondary =
      totalAttackerSecondary > 40 ? 40 : totalAttackerSecondary;

    let totalDefenderSecondary: number =
      stringToNumber(battle.T1DefenderSecondary1.toString()) +
      stringToNumber(battle.T1DefenderSecondary2.toString()) +
      stringToNumber(battle.T2DefenderSecondary1.toString()) +
      stringToNumber(battle.T2DefenderSecondary2.toString()) +
      stringToNumber(battle.T3DefenderSecondary1.toString()) +
      stringToNumber(battle.T3DefenderSecondary2.toString()) +
      stringToNumber(battle.T4DefenderSecondary1.toString()) +
      stringToNumber(battle.T4DefenderSecondary2.toString()) +
      stringToNumber(battle.T5DefenderSecondary1.toString()) +
      stringToNumber(battle.T5DefenderSecondary2.toString());
    totalDefenderSecondary =
      totalDefenderSecondary > 40 ? 40 : totalDefenderSecondary;

    //-- Total --
    const totalAttacker: number = totalAttackerPrimary + totalAttackerSecondary;
    const totalDefender: number = totalDefenderPrimary + totalDefenderSecondary;

    //Update State
    setBattle((prev) => {
      return {
        ...prev,
        ["TotalAttackerPrimary"]: totalAttackerPrimary,
        ["TotalAttackerSecondary"]: totalAttackerSecondary,
        ["TotalAttacker"]: totalAttacker,
        ["TotalDefenderPrimary"]: totalDefenderPrimary,
        ["TotalDefenderSecondary"]: totalDefenderSecondary,
        ["TotalDefender"]: totalDefender,
      };
    });

    //Update Firestore
    updateDoc(doc(db, "Battles", docId), {
      TotalAttackerPrimary: totalAttackerPrimary,
      TotalAttackerSecondary: totalAttackerSecondary,
      TotalAttacker: totalAttacker,
      TotalDefenderPrimary: totalDefenderPrimary,
      TotalDefenderSecondary: totalDefenderSecondary,
      TotalDefender: totalDefender,
    })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }, [
    battle.T1AttackerPrimary,
    battle.T2AttackerPrimary,
    battle.T3AttackerPrimary,
    battle.T4AttackerPrimary,
    battle.T5AttackerPrimary,
    battle.AttackerMissionBonus,
    battle.T1DefenderPrimary,
    battle.T2DefenderPrimary,
    battle.T3DefenderPrimary,
    battle.T4DefenderPrimary,
    battle.T5DefenderPrimary,
    battle.DefenderMissionBonus,
    battle.T1AttackerSecondary1,
    battle.T1AttackerSecondary2,
    battle.T2AttackerSecondary1,
    battle.T2AttackerSecondary2,
    battle.T3AttackerSecondary1,
    battle.T3AttackerSecondary2,
    battle.T4AttackerSecondary1,
    battle.T4AttackerSecondary2,
    battle.T5AttackerSecondary1,
    battle.T5AttackerSecondary2,
    battle.T1DefenderSecondary1,
    battle.T1DefenderSecondary2,
    battle.T2DefenderSecondary1,
    battle.T2DefenderSecondary2,
    battle.T3DefenderSecondary1,
    battle.T3DefenderSecondary2,
    battle.T4DefenderSecondary1,
    battle.T4DefenderSecondary2,
    battle.T5DefenderSecondary1,
    battle.T5DefenderSecondary2,
  ]);

  //Handle Battle End
  const handleBattleEnd = (e) => {
    e.preventDefault();

    //To Do: Validate the form.

    //Update State
    setBattle((prev) => {
      return { ...prev, ["IsCompleted"]: true };
    });

    //Update Firestore
    updateDoc(doc(db, "Battles", docId), { ["IsCompleted"]: true })
      .then(() => {
        console.log("Battle Ended");
      })
      .catch((error) => {
        console.log(error);
      });

    /*
    //#### No longer doing this - pulling data directly from the Battle Table. ####

    //Push data to Armies.
    //updateArmies(true);

    //Push data to Generals.
    //updateGenerals(true);
    */
  };

  //Handle Battle Restart
  const handleBattleRestart = (e) => {
    e.preventDefault();

    //Update State
    setBattle((prev) => {
      return { ...prev, ["IsCompleted"]: false };
    });

    //Update Firestore
    updateDoc(doc(db, "Battles", docId), { ["IsCompleted"]: false })
      .then(() => {
        console.log("Battle Restarted");
      })
      .catch((error) => {
        console.log(error);
      });

    /*
    //#### No longer doing this - pulling data directly from the Battle Table. ####

    //Push data to Armies.
    //updateArmies(true);

    //Push data to Generals.
    //updateGenerals(true);
    */
  };

  /*
  // #### No longer doing this as pulling data directly from the Battles table ####
  //Update Armies
  const updateArmies = (isAdd: boolean) => {
    const docAttackerArmyRef = doc(db, "Armies", battle.AttackerArmy);
    const docDefenderArmyRef = doc(db, "Armies", battle.DefenderArmy);

    const incrementValue = isAdd ? 1 : -1;
    const isAttackerVictor = checkAttackerVictor();
    const isAttackerFirstTurn = checkAttackerFirstTurn();

    //Attacker Army
    updateDoc(docAttackerArmyRef, {
      Played: increment(incrementValue),
      Won: increment(isAttackerVictor ? incrementValue : 0),
      Lost: increment(!isAttackerVictor ? incrementValue : 0),
      PrimaryPointsFor: increment(incrementValue * battle.TotalAttackerPrimary),
      PrimaryPointsAgainst: increment(
        incrementValue * battle.TotalDefenderPrimary
      ),
      SecondaryPointsFor: increment(
        incrementValue * battle.TotalAttackerSecondary
      ),
      SecondaryPointsAgainst: increment(
        incrementValue * battle.TotalDefenderSecondary
      ),
      FirstTurn: increment(isAttackerFirstTurn ? incrementValue : 0),
    })
      .then(() => {
        console.log("Attacker Army Updated");
      })
      .catch((error) => {
        console.log(error);
      });

    //Defender Army
    updateDoc(docDefenderArmyRef, {
      Played: increment(incrementValue),
      Won: increment(!isAttackerVictor ? incrementValue : 0),
      Lost: increment(isAttackerVictor ? incrementValue : 0),
      PrimaryPointsFor: increment(incrementValue * battle.TotalDefenderPrimary),
      PrimaryPointsAgainst: increment(
        incrementValue * battle.TotalAttackerPrimary
      ),
      SecondaryPointsFor: increment(
        incrementValue * battle.TotalDefenderSecondary
      ),
      SecondaryPointsAgainst: increment(
        incrementValue * battle.TotalAttackerSecondary
      ),
      FirstTurn: increment(!isAttackerFirstTurn ? incrementValue : 0),
    })
      .then(() => {
        console.log("Defender Army Updated");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  */

  /*
  // #### No longer doing this as pulling data directly from the Battles table ####
  //Update Generals
  const updateGenerals = (isAdd: boolean) => {
    const docAttackerRef = doc(db, "Generals", battle.Attacker);
    const docDefenderRef = doc(db, "Generals", battle.Defender);

    const incrementValue = isAdd ? 1 : -1;
    const isAttackerVictor = checkAttackerVictor();
    const isAttackerFirstTurn = checkAttackerFirstTurn();

    //Attacker General
    updateDoc(docAttackerRef, {
      Played: increment(incrementValue),
      Won: increment(isAttackerVictor ? incrementValue : 0),
      Lost: increment(!isAttackerVictor ? incrementValue : 0),
      PrimaryPointsFor: increment(incrementValue * battle.TotalAttackerPrimary),
      PrimaryPointsAgainst: increment(
        incrementValue * battle.TotalDefenderPrimary
      ),
      SecondaryPointsFor: increment(
        incrementValue * battle.TotalAttackerSecondary
      ),
      SecondaryPointsAgainst: increment(
        incrementValue * battle.TotalDefenderSecondary
      ),
      FirstTurn: increment(isAttackerFirstTurn ? incrementValue : 0),
    })
      .then(() => {
        console.log("Attacker Updated");
      })
      .catch((error) => {
        console.log(error);
      });

    //Defender General
    updateDoc(docDefenderRef, {
      Played: increment(incrementValue),
      Won: increment(!isAttackerVictor ? incrementValue : 0),
      Lost: increment(isAttackerVictor ? incrementValue : 0),
      PrimaryPointsFor: increment(incrementValue * battle.TotalDefenderPrimary),
      PrimaryPointsAgainst: increment(
        incrementValue * battle.TotalAttackerPrimary
      ),
      SecondaryPointsFor: increment(
        incrementValue * battle.TotalDefenderSecondary
      ),
      SecondaryPointsAgainst: increment(
        incrementValue * battle.TotalAttackerSecondary
      ),
      FirstTurn: increment(!isAttackerFirstTurn ? incrementValue : 0),
    })
      .then(() => {
        console.log("Defender Updated");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  */

  //Utilities
  const checkAttackerVictor = () => {
    return battle.Victor === battle.Attacker ? true : false;
  };
  const checkAttackerFirstTurn = () => {
    return battle.FirstTurn === battle.Attacker ? true : false;
  };

  return isHydrated ? (
    <>
      <section className="section">
        <header className="section-header">
          <h2>
            {battle.AttackerArmy && battle.DefenderArmy
              ? ` ${propertyFromID(
                  armiesCollection,
                  battle.AttackerArmy,
                  "Name"
                )} vs 
            ${propertyFromID(armiesCollection, battle.DefenderArmy, "Name")}`
              : `Battle Report`}
          </h2>
          <span className="battle-date">
            {formatDate(battle.Date.seconds).full}
          </span>
        </header>

        <div className="aside-layout">
          <div className="content content-dark">
            <form>
              <BattleFormPre
                IsCompleted={battle.IsCompleted}
                Generals={generals}
                Armies={armies}
                Opponents={collectOpponents()}
                Size={battle.Size}
                PrimaryMission={battle.PrimaryMission}
                MissionRule={battle.MissionRule}
                Deployment={battle.Deployment}
                Attacker={battle.Attacker}
                Defender={battle.Defender}
                AttackerArmy={battle.AttackerArmy}
                DefenderArmy={battle.DefenderArmy}
                AttackerDetachment={battle.AttackerDetachment}
                DefenderDetachment={battle.DefenderDetachment}
                AttackerList={battle.AttackerList}
                DefenderList={battle.DefenderList}
                FirstTurn={battle.FirstTurn}
                changeFunctionSelect={handleChange}
                changeFunctionText={handleChange}
                changeFunctionTextArea={handleChange}
              />

              {/* Round 1 */}
              <BattleFormRound
                RoundNumber={1}
                IsCompleted={battle.IsCompleted}
                AttackerPrimary={battle.T1AttackerPrimary}
                AttackerSecondary1Title={battle.T1AttackerSecondary1Title}
                AttackerSecondary1={battle.T1AttackerSecondary1}
                AttackerSecondary2Title={battle.T1AttackerSecondary2Title}
                AttackerSecondary2={battle.T1AttackerSecondary2}
                DefenderPrimary={battle.T1DefenderPrimary}
                DefenderSecondary1Title={battle.T1DefenderSecondary1Title}
                DefenderSecondary1={battle.T1DefenderSecondary1}
                DefenderSecondary2Title={battle.T1DefenderSecondary2Title}
                DefenderSecondary2={battle.T1DefenderSecondary2}
                changeFunction={handleChange}
              />

              {/* Round 2 */}
              <BattleFormRound
                RoundNumber={2}
                IsCompleted={battle.IsCompleted}
                AttackerPrimary={battle.T2AttackerPrimary}
                AttackerSecondary1Title={battle.T2AttackerSecondary1Title}
                AttackerSecondary1={battle.T2AttackerSecondary1}
                AttackerSecondary2Title={battle.T2AttackerSecondary2Title}
                AttackerSecondary2={battle.T2AttackerSecondary2}
                DefenderPrimary={battle.T2DefenderPrimary}
                DefenderSecondary1Title={battle.T2DefenderSecondary1Title}
                DefenderSecondary1={battle.T2DefenderSecondary1}
                DefenderSecondary2Title={battle.T2DefenderSecondary2Title}
                DefenderSecondary2={battle.T2DefenderSecondary2}
                changeFunction={handleChange}
              />

              {/* Round 3 */}
              <BattleFormRound
                RoundNumber={3}
                IsCompleted={battle.IsCompleted}
                AttackerPrimary={battle.T3AttackerPrimary}
                AttackerSecondary1Title={battle.T3AttackerSecondary1Title}
                AttackerSecondary1={battle.T3AttackerSecondary1}
                AttackerSecondary2Title={battle.T3AttackerSecondary2Title}
                AttackerSecondary2={battle.T3AttackerSecondary2}
                DefenderPrimary={battle.T3DefenderPrimary}
                DefenderSecondary1Title={battle.T3DefenderSecondary1Title}
                DefenderSecondary1={battle.T3DefenderSecondary1}
                DefenderSecondary2Title={battle.T3DefenderSecondary2Title}
                DefenderSecondary2={battle.T3DefenderSecondary2}
                changeFunction={handleChange}
              />

              {/* Round 4 */}
              <BattleFormRound
                RoundNumber={4}
                IsCompleted={battle.IsCompleted}
                AttackerPrimary={battle.T4AttackerPrimary}
                AttackerSecondary1Title={battle.T4AttackerSecondary1Title}
                AttackerSecondary1={battle.T4AttackerSecondary1}
                AttackerSecondary2Title={battle.T4AttackerSecondary2Title}
                AttackerSecondary2={battle.T4AttackerSecondary2}
                DefenderPrimary={battle.T4DefenderPrimary}
                DefenderSecondary1Title={battle.T4DefenderSecondary1Title}
                DefenderSecondary1={battle.T4DefenderSecondary1}
                DefenderSecondary2Title={battle.T4DefenderSecondary2Title}
                DefenderSecondary2={battle.T4DefenderSecondary2}
                changeFunction={handleChange}
              />

              {/* Round 5 */}
              <BattleFormRound
                RoundNumber={5}
                IsCompleted={battle.IsCompleted}
                AttackerPrimary={battle.T5AttackerPrimary}
                AttackerSecondary1Title={battle.T5AttackerSecondary1Title}
                AttackerSecondary1={battle.T5AttackerSecondary1}
                AttackerSecondary2Title={battle.T5AttackerSecondary2Title}
                AttackerSecondary2={battle.T5AttackerSecondary2}
                DefenderPrimary={battle.T5DefenderPrimary}
                DefenderSecondary1Title={battle.T5DefenderSecondary1Title}
                DefenderSecondary1={battle.T5DefenderSecondary1}
                DefenderSecondary2Title={battle.T5DefenderSecondary2Title}
                DefenderSecondary2={battle.T5DefenderSecondary2}
                changeFunction={handleChange}
              />

              <BattleFormEnd
                IsCompleted={battle.IsCompleted}
                AttackerMissionBonus={battle.AttackerMissionBonus}
                DefenderMissionBonus={battle.DefenderMissionBonus}
                changeFunctionText={handleChange}
              />

              <BattleFormPost
                IsCompleted={battle.IsCompleted}
                Opponents={collectOpponents()}
                AttackerScore={battle.TotalAttacker}
                DefenderScore={battle.TotalDefender}
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

              {battle.Victor &&
                (battle.IsCompleted ? (
                  <button
                    className="button button-large button-center button-secondary"
                    type="submit"
                    onClick={(e) => handleBattleRestart(e)}
                  >
                    Restart Battle
                  </button>
                ) : (
                  <button
                    className="button button-xlarge button-center"
                    type="submit"
                    onClick={(e) => handleBattleEnd(e)}
                  >
                    End Battle
                  </button>
                ))}
            </form>
          </div>
          <aside>
            <div className="content content-dark content-sticky content-score">
              <div className="opponent-layout">
                <div className="opponent">
                  <legend>Attacker</legend>
                  <span className="score-highlight">
                    {battle.TotalAttacker}
                  </span>
                  <span>Primary:{battle.TotalAttackerPrimary}/50</span>
                  <span>Secondary:{battle.TotalAttackerSecondary}/40</span>
                </div>
                <div className="opponent">
                  <legend>Defender</legend>
                  <span className="score-highlight">
                    {battle.TotalDefender}
                  </span>
                  <span>Primary:{battle.TotalDefenderPrimary}/50</span>
                  <span>Secondary:{battle.TotalDefenderSecondary}/40</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
        <div className="device-score-bar hide-lg">
          <div className="opponent-layout">
            <div className="opponent">
              <span className="score-highlight">{battle.TotalAttacker}</span>
              <div>
                <legend>Attacker</legend>
                <span title="Primary Points">
                  P:{battle.TotalAttackerPrimary}/50
                </span>
                <span title="Secondary Points">
                  S:{battle.TotalAttackerSecondary}/40
                </span>
              </div>
            </div>
            <div className="opponent">
              <span className="score-highlight">{battle.TotalDefender}</span>
              <div>
                <legend>Defender</legend>
                <span title="Primary Points">
                  P:{battle.TotalDefenderPrimary}/50
                </span>
                <span title="Secondary Points">
                  S:{battle.TotalDefenderSecondary}/40
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default BattleForm;
