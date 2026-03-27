"use client";
import React, { useEffect, useState } from "react";
import {
  doc,
  getFirestore,
  increment,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
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


const BattleForm = (props: { battleId: string }) => {
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const docId: string = props.battleId;

  // Retrieve Battle
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Battles", docId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        setBattle((prev) => {
          return {
            ...prev,
            ...data,
            // If the DB field is missing, force it to 10. 
            // This bridges the gap for all your pre-2026 data.
            Edition: data.Edition || 10
          };
        });
        setIsHydrated(true);
      }
    });
    // Note: Ensure isHydrated is managed correctly if it's a ref or state
    return () => unsubscribe();
  }, [docId, db]); // Added docId and db to dependency array for best practice



  //Hydrate State
  const [isHydrated, setIsHydrated] = useState(false);

  const [battle, setBattle] = useState<iBattle>({
    id: props.battleId,
    Edition: 10, // Default to 10 so the UI has a safe starting point
    IsCompleted: false,
    Show: true,
    Date: {
      seconds: 0,
    },
    ChapterApprovedVersion: "",
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
    IsAttackerFirst: true,

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

    T2AttackerChallengerTitle: "",
    T2AttackerChallenger: 0,
    T3AttackerChallengerTitle: "",
    T3AttackerChallenger: 0,
    T4AttackerChallengerTitle: "",
    T4AttackerChallenger: 0,
    T5AttackerChallengerTitle: "",
    T5AttackerChallenger: 0,
    TotalAttackerChallenger: 0,

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

    T2DefenderChallengerTitle: "",
    T2DefenderChallenger: 0,
    T3DefenderChallengerTitle: "",
    T3DefenderChallenger: 0,
    T4DefenderChallengerTitle: "",
    T4DefenderChallenger: 0,
    T5DefenderChallengerTitle: "",
    T5DefenderChallenger: 0,
    TotalDefenderChallenger: 0,

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

  // Challenger Card Cutoff Date
  const CHALLENGER_RETIREMENT_DATE = 1735689600; // Jan 1, 2026 in seconds

  //Check if battle includes Challenger:
  const isChallenger =
    battle.Date.seconds < CHALLENGER_RETIREMENT_DATE &&
    battle.ChapterApprovedVersion === "2025-26 Mission Deck";

  //Handle Player Order
  useEffect(() => {
    setBattle((prev) => {
      return {
        ...prev,
        ["IsAttackerFirst"]:
          battle.FirstTurn === battle.Defender ? false : true,
      };
    });
  //}, [battle.FirstTurn, battle.Defender]);
  }, [battle.FirstTurn]);

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

  //Retrieve Amy Colours
  const attackerArmyColour = propertyFromID(armiesCollection, battle.AttackerArmy, "Colour") || "#ff006e";
  const defenderArmyColour = propertyFromID(armiesCollection, battle.DefenderArmy, "Colour") || "#00ffcc";

  //Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Build the specific field update
    let updates = { [name]: value };

    // --- The Logic ---
    if (name === "VictoryType" && value === "Points Draw") {
      updates["Victor"] = "DRAW";
    }

    // Update Local State
    setBattle((prev) => {
      return { ...prev, ...updates };
    });

    // Update Firestore
    // We ONLY send the 'updates' object. 
    // Because 'Date' is not in this object, Firestore won't touch it.
    updateDoc(doc(db, "Battles", docId), updates)
      .then(() => { })
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

    //-- Challenger Cards (Calculated based on isChallenger cutoff) --
    let currentAttackerChallenger: number = 0;
    let currentDefenderChallenger: number = 0;

    if (isChallenger) {
      currentAttackerChallenger =
        stringToNumber(battle.T2AttackerChallenger.toString()) +
        stringToNumber(battle.T3AttackerChallenger.toString()) +
        stringToNumber(battle.T4AttackerChallenger.toString()) +
        stringToNumber(battle.T5AttackerChallenger.toString());
      currentAttackerChallenger = currentAttackerChallenger > 12 ? 12 : currentAttackerChallenger;

      currentDefenderChallenger =
        stringToNumber(battle.T2DefenderChallenger.toString()) +
        stringToNumber(battle.T3DefenderChallenger.toString()) +
        stringToNumber(battle.T4DefenderChallenger.toString()) +
        stringToNumber(battle.T5DefenderChallenger.toString());
      currentDefenderChallenger = currentDefenderChallenger > 12 ? 12 : currentDefenderChallenger;
    }

    //-- Total --
    let totalAttacker: number =
      totalAttackerPrimary + totalAttackerSecondary + currentAttackerChallenger;
    totalAttacker = totalAttacker > 90 ? 90 : totalAttacker;

    let totalDefender: number =
      totalDefenderPrimary + totalDefenderSecondary + currentDefenderChallenger;
    totalDefender = totalDefender > 90 ? 90 : totalDefender;

    //Update State
    setBattle((prev) => {
      return {
        ...prev,
        ["TotalAttackerPrimary"]: totalAttackerPrimary,
        ["TotalAttackerSecondary"]: totalAttackerSecondary,
        ["TotalAttackerChallenger"]: currentAttackerChallenger,
        ["TotalAttacker"]: totalAttacker,
        ["TotalDefenderPrimary"]: totalDefenderPrimary,
        ["TotalDefenderSecondary"]: totalDefenderSecondary,
        ["TotalDefenderChallenger"]: currentDefenderChallenger,
        ["TotalDefender"]: totalDefender,
      };
    });

    //Update Firestore
    updateDoc(doc(db, "Battles", docId), {
      TotalAttackerPrimary: totalAttackerPrimary,
      TotalAttackerSecondary: totalAttackerSecondary,
      TotalAttackerChallenger: currentAttackerChallenger,
      TotalAttacker: totalAttacker,
      TotalDefenderPrimary: totalDefenderPrimary,
      TotalDefenderSecondary: totalDefenderSecondary,
      TotalDefenderChallenger: currentDefenderChallenger,
      TotalDefender: totalDefender,
    })
      .then(() => { })
      .catch((error) => {
        console.log(error);
      });
  }, [
    battle.ChapterApprovedVersion,
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
    battle.T2AttackerChallenger,
    battle.T3AttackerChallenger,
    battle.T4AttackerChallenger,
    battle.T5AttackerChallenger,
    battle.T2DefenderChallenger,
    battle.T3DefenderChallenger,
    battle.T4DefenderChallenger,
    battle.T5DefenderChallenger,
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

  const handleBattleHide = (e) => {
    e.preventDefault();

    //Update State
    setBattle((prev) => {
      return { ...prev, ["Show"]: false };
    });

    //Update Firestore
    updateDoc(doc(db, "Battles", docId), { ["Show"]: false })
      .then(() => {
        console.log("Battle hidden.");
      })
      .catch((error) => {
        console.log(error);
      });

    //Redirect back to the Battle list.
    router.push("/");
  };

  //Utilities
  /*
  const checkAttackerVictor = () => {
    return battle.Victor === battle.Attacker ? true : false;
  };
  const checkAttackerFirstTurn = () => {
    return battle.FirstTurn === battle.Attacker ? true : false;
  };
  */

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
                IsAttackerFirst={battle.IsAttackerFirst}
                Generals={generals}
                Armies={armies}
                Opponents={collectOpponents()}
                ChapterApprovedVersion={battle.ChapterApprovedVersion}
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
                ChapterApprovedVersion={battle.ChapterApprovedVersion}
                IsCompleted={battle.IsCompleted}
                IsAttackerFirst={battle.IsAttackerFirst}
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
                changeFunctionSelect={handleChange}
                AttackerChallengerTitle={""}
                AttackerChallenger={0}
                DefenderChallengerTitle={""}
                DefenderChallenger={0}
                showChallenger={false}
              />

              {/* Round 2 */}
              <BattleFormRound
                RoundNumber={2}
                ChapterApprovedVersion={battle.ChapterApprovedVersion}
                IsCompleted={battle.IsCompleted}
                IsAttackerFirst={battle.IsAttackerFirst}
                AttackerPrimary={battle.T2AttackerPrimary}
                AttackerSecondary1Title={battle.T2AttackerSecondary1Title}
                AttackerSecondary1={battle.T2AttackerSecondary1}
                AttackerSecondary2Title={battle.T2AttackerSecondary2Title}
                AttackerSecondary2={battle.T2AttackerSecondary2}
                AttackerChallengerTitle={isChallenger ? battle.T2AttackerChallengerTitle : ""}
                AttackerChallenger={isChallenger ? battle.T2AttackerChallenger : 0}
                DefenderPrimary={battle.T2DefenderPrimary}
                DefenderSecondary1Title={battle.T2DefenderSecondary1Title}
                DefenderSecondary1={battle.T2DefenderSecondary1}
                DefenderSecondary2Title={battle.T2DefenderSecondary2Title}
                DefenderSecondary2={battle.T2DefenderSecondary2}
                DefenderChallengerTitle={isChallenger ? battle.T2DefenderChallengerTitle : ""}
                DefenderChallenger={isChallenger ? battle.T2DefenderChallenger : 0}
                changeFunction={handleChange}
                changeFunctionSelect={handleChange}
                showChallenger={isChallenger}
              />

              {/* Round 3 */}
              <BattleFormRound
                RoundNumber={3}
                ChapterApprovedVersion={battle.ChapterApprovedVersion}
                IsCompleted={battle.IsCompleted}
                IsAttackerFirst={battle.IsAttackerFirst}
                AttackerPrimary={battle.T3AttackerPrimary}
                AttackerSecondary1Title={battle.T3AttackerSecondary1Title}
                AttackerSecondary1={battle.T3AttackerSecondary1}
                AttackerSecondary2Title={battle.T3AttackerSecondary2Title}
                AttackerSecondary2={battle.T3AttackerSecondary2}
                AttackerChallengerTitle={isChallenger ? battle.T3AttackerChallengerTitle : ""}
                AttackerChallenger={isChallenger ? battle.T3AttackerChallenger : 0}
                DefenderPrimary={battle.T3DefenderPrimary}
                DefenderSecondary1Title={battle.T3DefenderSecondary1Title}
                DefenderSecondary1={battle.T3DefenderSecondary1}
                DefenderSecondary2Title={battle.T3DefenderSecondary2Title}
                DefenderSecondary2={battle.T3DefenderSecondary2}
                DefenderChallengerTitle={isChallenger ? battle.T3DefenderChallengerTitle : ""}
                DefenderChallenger={isChallenger ? battle.T3DefenderChallenger : 0}
                changeFunction={handleChange}
                changeFunctionSelect={handleChange}
                showChallenger={isChallenger}
              />

              {/* Round 4 */}
              <BattleFormRound
                RoundNumber={4}
                ChapterApprovedVersion={battle.ChapterApprovedVersion}
                IsCompleted={battle.IsCompleted}
                IsAttackerFirst={battle.IsAttackerFirst}
                AttackerPrimary={battle.T4AttackerPrimary}
                AttackerSecondary1Title={battle.T4AttackerSecondary1Title}
                AttackerSecondary1={battle.T4AttackerSecondary1}
                AttackerSecondary2Title={battle.T4AttackerSecondary2Title}
                AttackerSecondary2={battle.T4AttackerSecondary2}
                AttackerChallengerTitle={isChallenger ? battle.T4AttackerChallengerTitle : ""}
                AttackerChallenger={isChallenger ? battle.T4AttackerChallenger : 0}
                DefenderPrimary={battle.T4DefenderPrimary}
                DefenderSecondary1Title={battle.T4DefenderSecondary1Title}
                DefenderSecondary1={battle.T4DefenderSecondary1}
                DefenderSecondary2Title={battle.T4DefenderSecondary2Title}
                DefenderSecondary2={battle.T4DefenderSecondary2}
                DefenderChallengerTitle={isChallenger ? battle.T4DefenderChallengerTitle : ""}
                DefenderChallenger={isChallenger ? battle.T4DefenderChallenger : 0}
                changeFunction={handleChange}
                changeFunctionSelect={handleChange}
                showChallenger={isChallenger}
              />

              {/* Round 5 */}
              <BattleFormRound
                RoundNumber={5}
                ChapterApprovedVersion={battle.ChapterApprovedVersion}
                IsCompleted={battle.IsCompleted}
                IsAttackerFirst={battle.IsAttackerFirst}
                AttackerPrimary={battle.T5AttackerPrimary}
                AttackerSecondary1Title={battle.T5AttackerSecondary1Title}
                AttackerSecondary1={battle.T5AttackerSecondary1}
                AttackerSecondary2Title={battle.T5AttackerSecondary2Title}
                AttackerSecondary2={battle.T5AttackerSecondary2}
                AttackerChallengerTitle={isChallenger ? battle.T5AttackerChallengerTitle : ""}
                AttackerChallenger={isChallenger ? battle.T5AttackerChallenger : 0}
                DefenderPrimary={battle.T5DefenderPrimary}
                DefenderSecondary1Title={battle.T5DefenderSecondary1Title}
                DefenderSecondary1={battle.T5DefenderSecondary1}
                DefenderSecondary2Title={battle.T5DefenderSecondary2Title}
                DefenderSecondary2={battle.T5DefenderSecondary2}
                DefenderChallengerTitle={isChallenger ? battle.T5DefenderChallengerTitle : ""}
                DefenderChallenger={isChallenger ? battle.T5DefenderChallenger : 0}
                changeFunction={handleChange}
                changeFunctionSelect={handleChange}
                showChallenger={isChallenger}
              />

              <BattleFormEnd
                IsCompleted={battle.IsCompleted}
                IsAttackerFirst={battle.IsAttackerFirst}
                AttackerMissionBonus={battle.AttackerMissionBonus}
                DefenderMissionBonus={battle.DefenderMissionBonus}
                changeFunctionText={handleChange}
              />

              <BattleFormPost
                Attacker={battle.Attacker}
                AttackerArmyColour={attackerArmyColour}
                DefenderArmyColour={defenderArmyColour}
                IsCompleted={battle.IsCompleted}
                IsAttackerFirst={battle.IsAttackerFirst}
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
                  <>
                    <button
                      className="button button-large button-center button-secondary"
                      type="submit"
                      onClick={(e) => handleBattleRestart(e)}
                    >
                      Restart Battle
                    </button>
                    <a
                      className="a-delete"
                      onClick={(e) => handleBattleHide(e)}
                    >
                      Delete Battle
                    </a>
                  </>
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
              <div
                className={`opponent-layout ${!battle.IsAttackerFirst ? "reverse" : ""
                  }`}
              >
                <div className="opponent">
                  <legend className="attacker">Attacker</legend>
                  <span className="score-highlight">
                    {battle.TotalAttacker}
                  </span>
                  <span>Primary:{battle.TotalAttackerPrimary}/50</span>
                  <span>Secondary:{battle.TotalAttackerSecondary}/40</span>
                  {isChallenger ? (
                    <span>Challenger:{battle.TotalAttackerChallenger}/12</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="opponent">
                  <legend className="defender">Defender</legend>
                  <span className="score-highlight">
                    {battle.TotalDefender}
                  </span>
                  <span>Primary:{battle.TotalDefenderPrimary}/50</span>
                  <span>Secondary:{battle.TotalDefenderSecondary}/40</span>
                  {isChallenger ? (
                    <span>Challenger:{battle.TotalDefenderChallenger}/12</span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
        <div className="device-score-bar hide-lg">
          <div
            className={`opponent-layout ${!battle.IsAttackerFirst ? "reverse" : ""
              }`}
          >
            <div className="opponent">
              <span className="score-highlight">{battle.TotalAttacker}</span>
              <div>
                <legend className="attacker">Attacker</legend>
                <span title="Primary Points" className="type-points">
                  P:{battle.TotalAttackerPrimary}/50
                </span>
                <span title="Secondary Points" className="type-points">
                  S:{battle.TotalAttackerSecondary}/40
                </span>
                {isChallenger ? (
                  <span title="Challenger Points" className="type-points">
                    C:{battle.TotalAttackerChallenger}/12
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="opponent">
              <span className="score-highlight">{battle.TotalDefender}</span>
              <div>
                <legend className="defender">Defender</legend>
                <span title="Primary Points" className="type-points">
                  P:{battle.TotalDefenderPrimary}/50
                </span>
                <span title="Secondary Points" className="type-points">
                  S:{battle.TotalDefenderSecondary}/40
                </span>
                {isChallenger ? (
                  <span title="Challenger Points" className="type-points">
                    C:{battle.TotalDefenderChallenger}/12
                  </span>
                ) : (
                  ""
                )}
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
