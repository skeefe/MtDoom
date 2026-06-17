"use client";
import React, { useEffect, useState } from "react";
import {
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import firebase_app from "../firebase/config";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";

import { selectOption } from "../types/select-option";
import { iBattle } from "../types/battle";
import { iSecondaryEntry } from "./battle-form-round";

import { formatDate } from "../../utils/date-format";
import { collectionToSelect } from "../../utils/collection-to-select";
import { propertyFromID } from "../../utils/property-from-id";
import { stringToNumber } from "../../utils/string-to-number";

import Spinner from "./spinner";
import BattleFormPre from "./battle-form-pre";
import BattleFormRound from "./battle-form-round";
import BattleFormEnd from "./battle-form-end";
import BattleFormPost from "./battle-form-post";

// ─── 11th edition secondary state ────────────────────────────────────────────

type RoundKey = 1 | 2 | 3 | 4 | 5;
type SideKey = "Attacker" | "Defender";

const emptySecondaries = (): iSecondaryEntry[] => [
  { title: "", points: 0 },
  { title: "", points: 0 },
];

interface ArmageddonSecondaries {
  T1AttackerSecondaries: iSecondaryEntry[];
  T2AttackerSecondaries: iSecondaryEntry[];
  T3AttackerSecondaries: iSecondaryEntry[];
  T4AttackerSecondaries: iSecondaryEntry[];
  T5AttackerSecondaries: iSecondaryEntry[];
  T1DefenderSecondaries: iSecondaryEntry[];
  T2DefenderSecondaries: iSecondaryEntry[];
  T3DefenderSecondaries: iSecondaryEntry[];
  T4DefenderSecondaries: iSecondaryEntry[];
  T5DefenderSecondaries: iSecondaryEntry[];
}

const emptyArmageddonSecondaries = (): ArmageddonSecondaries => ({
  T1AttackerSecondaries: emptySecondaries(),
  T2AttackerSecondaries: emptySecondaries(),
  T3AttackerSecondaries: emptySecondaries(),
  T4AttackerSecondaries: emptySecondaries(),
  T5AttackerSecondaries: emptySecondaries(),
  T1DefenderSecondaries: emptySecondaries(),
  T2DefenderSecondaries: emptySecondaries(),
  T3DefenderSecondaries: emptySecondaries(),
  T4DefenderSecondaries: emptySecondaries(),
  T5DefenderSecondaries: emptySecondaries(),
});

// ─── Component ────────────────────────────────────────────────────────────────

const BattleForm = (props: { battleId: string }) => {
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const docId: string = props.battleId;

  const [isHydrated, setIsHydrated] = useState(false);
  const [armageddonSecondaries, setArmageddonSecondaries] = useState<ArmageddonSecondaries>(emptyArmageddonSecondaries());
  const [attackerDetachments, setAttackerDetachments] = useState<string[]>([""]);
  const [defenderDetachments, setDefenderDetachments] = useState<string[]>([""]);

  const [battle, setBattle] = useState<iBattle>({
    id: props.battleId,
    Edition: 10,
    IsCompleted: false,
    Show: true,
    Date: { seconds: 0 },
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
    AttackerForceDisposition: "",
    DefenderForceDisposition: "",
    AttackerSecondaryType: "",
    DefenderSecondaryType: "",
    T1AttackerPrimary: 0, T2AttackerPrimary: 0, T3AttackerPrimary: 0, T4AttackerPrimary: 0, T5AttackerPrimary: 0,
    AttackerMissionBonus: 0, TotalAttackerPrimary: 0,
    T1AttackerSecondary1Title: "", T1AttackerSecondary1: 0, T1AttackerSecondary2Title: "", T1AttackerSecondary2: 0,
    T2AttackerSecondary1Title: "", T2AttackerSecondary1: 0, T2AttackerSecondary2Title: "", T2AttackerSecondary2: 0,
    T3AttackerSecondary1Title: "", T3AttackerSecondary1: 0, T3AttackerSecondary2Title: "", T3AttackerSecondary2: 0,
    T4AttackerSecondary1Title: "", T4AttackerSecondary1: 0, T4AttackerSecondary2Title: "", T4AttackerSecondary2: 0,
    T5AttackerSecondary1Title: "", T5AttackerSecondary1: 0, T5AttackerSecondary2Title: "", T5AttackerSecondary2: 0,
    TotalAttackerSecondary: 0,
    T2AttackerChallengerTitle: "", T2AttackerChallenger: 0,
    T3AttackerChallengerTitle: "", T3AttackerChallenger: 0,
    T4AttackerChallengerTitle: "", T4AttackerChallenger: 0,
    T5AttackerChallengerTitle: "", T5AttackerChallenger: 0,
    TotalAttackerChallenger: 0,
    TotalAttacker: 0,
    T1DefenderPrimary: 0, T2DefenderPrimary: 0, T3DefenderPrimary: 0, T4DefenderPrimary: 0, T5DefenderPrimary: 0,
    DefenderMissionBonus: 0, TotalDefenderPrimary: 0,
    T1DefenderSecondary1Title: "", T1DefenderSecondary1: 0, T1DefenderSecondary2Title: "", T1DefenderSecondary2: 0,
    T2DefenderSecondary1Title: "", T2DefenderSecondary1: 0, T2DefenderSecondary2Title: "", T2DefenderSecondary2: 0,
    T3DefenderSecondary1Title: "", T3DefenderSecondary1: 0, T3DefenderSecondary2Title: "", T3DefenderSecondary2: 0,
    T4DefenderSecondary1Title: "", T4DefenderSecondary1: 0, T4DefenderSecondary2Title: "", T4DefenderSecondary2: 0,
    T5DefenderSecondary1Title: "", T5DefenderSecondary1: 0, T5DefenderSecondary2Title: "", T5DefenderSecondary2: 0,
    TotalDefenderSecondary: 0,
    T2DefenderChallengerTitle: "", T2DefenderChallenger: 0,
    T3DefenderChallengerTitle: "", T3DefenderChallenger: 0,
    T4DefenderChallengerTitle: "", T4DefenderChallenger: 0,
    T5DefenderChallengerTitle: "", T5DefenderChallenger: 0,
    TotalDefenderChallenger: 0,
    TotalDefender: 0,
    Victor: "", VictoryType: "", TurnEnded: 0,
    AttackerMVP: "", DefenderMVP: "", AttackerLVP: "", DefenderLVP: "", BattleNotes: "",
  });

  // ─── Retrieve Battle ────────────────────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Battles", docId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBattle((prev) => ({ ...prev, ...data, Edition: data.Edition || 10 }));

        // Hydrate armageddon secondaries from Firestore if they exist
        setArmageddonSecondaries((prev) => ({
          T1AttackerSecondaries: data.T1AttackerSecondaries ?? prev.T1AttackerSecondaries,
          T2AttackerSecondaries: data.T2AttackerSecondaries ?? prev.T2AttackerSecondaries,
          T3AttackerSecondaries: data.T3AttackerSecondaries ?? prev.T3AttackerSecondaries,
          T4AttackerSecondaries: data.T4AttackerSecondaries ?? prev.T4AttackerSecondaries,
          T5AttackerSecondaries: data.T5AttackerSecondaries ?? prev.T5AttackerSecondaries,
          T1DefenderSecondaries: data.T1DefenderSecondaries ?? prev.T1DefenderSecondaries,
          T2DefenderSecondaries: data.T2DefenderSecondaries ?? prev.T2DefenderSecondaries,
          T3DefenderSecondaries: data.T3DefenderSecondaries ?? prev.T3DefenderSecondaries,
          T4DefenderSecondaries: data.T4DefenderSecondaries ?? prev.T4DefenderSecondaries,
          T5DefenderSecondaries: data.T5DefenderSecondaries ?? prev.T5DefenderSecondaries,
        }));

        // Hydrate detachments
        if (data.AttackerDetachments) setAttackerDetachments(data.AttackerDetachments);
        if (data.DefenderDetachments) setDefenderDetachments(data.DefenderDetachments);

        setIsHydrated(true);
      }
    });
    return () => unsubscribe();
  }, [docId, db]);

  // ─── Derived state ──────────────────────────────────────────────────────────

  const CHALLENGER_RETIREMENT_DATE = 1735689600;
  const isArmageddon = battle.ChapterApprovedVersion === "Armageddon - Chapter Approved";
  const isChallenger = battle.Date.seconds < CHALLENGER_RETIREMENT_DATE && battle.ChapterApprovedVersion === "2025-26 Mission Deck";

  // ─── Player order ───────────────────────────────────────────────────────────

  useEffect(() => {
    setBattle((prev) => ({ ...prev, IsAttackerFirst: battle.FirstTurn === battle.Defender ? false : true }));
  }, [battle.FirstTurn]);

  // ─── Collections ───────────────────────────────────────────────────────────

  const generalsCollection = getCollectionSnapshot("Generals", "Alias", "asc");
  const generals = collectionToSelect(generalsCollection, "Alias", "id");
  const armiesCollection = getCollectionSnapshot("Armies", "Name", "asc");
  const armies = collectionToSelect(armiesCollection, "Name", "id");

  const collectOpponents = () => {
    let opponentsOptions: selectOption[] = [];
    if (battle.Attacker) opponentsOptions.push({
      Label: `${propertyFromID(armiesCollection, battle.AttackerArmy, "Name")} - ${propertyFromID(generalsCollection, battle.Attacker, "Alias")}`,
      Value: battle.Attacker, Active: true,
    });
    if (battle.Defender) opponentsOptions.push({
      Label: `${propertyFromID(armiesCollection, battle.DefenderArmy, "Name")} - ${propertyFromID(generalsCollection, battle.Defender, "Alias")}`,
      Value: battle.Defender, Active: true,
    });
    return opponentsOptions;
  };

  const attackerArmyColour = propertyFromID(armiesCollection, battle.AttackerArmy, "Colour") || "#ff006e";
  const defenderArmyColour = propertyFromID(armiesCollection, battle.DefenderArmy, "Colour") || "#00ffcc";

  // ─── Handle Change (10th edition fields) ───────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updates = { [name]: value };
    if (name === "VictoryType" && value === "Points Draw") updates["Victor"] = "DRAW";
    setBattle((prev) => ({ ...prev, ...updates }));
    updateDoc(doc(db, "Battles", docId), updates).catch((error) => console.log(error));
  };

  // ─── Handle Secondary Change (11th edition) ────────────────────────────────

  const handleSecondaryChange = (
    round: RoundKey,
    side: SideKey,
    index: number,
    field: "title" | "points",
    value: string | number
  ) => {
    const key = `T${round}${side}Secondaries` as keyof ArmageddonSecondaries;
    setArmageddonSecondaries((prev) => {
      const updated = prev[key].map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      );
      const newState = { ...prev, [key]: updated };
      updateDoc(doc(db, "Battles", docId), { [key]: updated }).catch((e) => console.log(e));
      return newState;
    });
  };

  const handleAddSecondary = (round: RoundKey, side: SideKey) => {
    const key = `T${round}${side}Secondaries` as keyof ArmageddonSecondaries;
    setArmageddonSecondaries((prev) => {
      const updated = [...prev[key], { title: "", points: 0 }];
      const newState = { ...prev, [key]: updated };
      updateDoc(doc(db, "Battles", docId), { [key]: updated }).catch((e) => console.log(e));
      return newState;
    });
  };

  const handleDetachmentChange = (side: "Attacker" | "Defender", index: number, value: string) => {
    const setter = side === "Attacker" ? setAttackerDetachments : setDefenderDetachments;
    const key = side === "Attacker" ? "AttackerDetachments" : "DefenderDetachments";
    setter((prev) => {
      const updated = prev.map((d, i) => i === index ? value : d);
      updateDoc(doc(db, "Battles", docId), { [key]: updated }).catch((e) => console.log(e));
      return updated;
    });
  };

  const handleAddDetachment = (side: "Attacker" | "Defender") => {
    const setter = side === "Attacker" ? setAttackerDetachments : setDefenderDetachments;
    const key = side === "Attacker" ? "AttackerDetachments" : "DefenderDetachments";
    setter((prev) => {
      const updated = [...prev, ""];
      updateDoc(doc(db, "Battles", docId), { [key]: updated }).catch((e) => console.log(e));
      return updated;
    });
  };

  // ─── Score Calculation ──────────────────────────────────────────────────────

  useEffect(() => {
    // Primary
    let totalAttackerPrimary =
      stringToNumber(battle.T1AttackerPrimary.toString()) +
      stringToNumber(battle.T2AttackerPrimary.toString()) +
      stringToNumber(battle.T3AttackerPrimary.toString()) +
      stringToNumber(battle.T4AttackerPrimary.toString()) +
      stringToNumber(battle.T5AttackerPrimary.toString()) +
      stringToNumber(battle.AttackerMissionBonus.toString());
    const primaryCap = isArmageddon ? 45 : 50;
    totalAttackerPrimary = Math.min(totalAttackerPrimary, primaryCap);

    let totalDefenderPrimary =
      stringToNumber(battle.T1DefenderPrimary.toString()) +
      stringToNumber(battle.T2DefenderPrimary.toString()) +
      stringToNumber(battle.T3DefenderPrimary.toString()) +
      stringToNumber(battle.T4DefenderPrimary.toString()) +
      stringToNumber(battle.T5DefenderPrimary.toString()) +
      stringToNumber(battle.DefenderMissionBonus.toString());
    totalDefenderPrimary = Math.min(totalDefenderPrimary, primaryCap);

    // Secondary
    const secondaryCap = isArmageddon ? 45 : 40;
    let totalAttackerSecondary: number;
    let totalDefenderSecondary: number;

    if (isArmageddon) {
      const sumArr = (arr: iSecondaryEntry[]) => arr.reduce((sum, s) => sum + (s.points || 0), 0);
      totalAttackerSecondary = Math.min(
        sumArr(armageddonSecondaries.T1AttackerSecondaries) +
        sumArr(armageddonSecondaries.T2AttackerSecondaries) +
        sumArr(armageddonSecondaries.T3AttackerSecondaries) +
        sumArr(armageddonSecondaries.T4AttackerSecondaries) +
        sumArr(armageddonSecondaries.T5AttackerSecondaries),
        secondaryCap
      );
      totalDefenderSecondary = Math.min(
        sumArr(armageddonSecondaries.T1DefenderSecondaries) +
        sumArr(armageddonSecondaries.T2DefenderSecondaries) +
        sumArr(armageddonSecondaries.T3DefenderSecondaries) +
        sumArr(armageddonSecondaries.T4DefenderSecondaries) +
        sumArr(armageddonSecondaries.T5DefenderSecondaries),
        secondaryCap
      );
    } else {
      totalAttackerSecondary = Math.min(
        stringToNumber(battle.T1AttackerSecondary1.toString()) + stringToNumber(battle.T1AttackerSecondary2.toString()) +
        stringToNumber(battle.T2AttackerSecondary1.toString()) + stringToNumber(battle.T2AttackerSecondary2.toString()) +
        stringToNumber(battle.T3AttackerSecondary1.toString()) + stringToNumber(battle.T3AttackerSecondary2.toString()) +
        stringToNumber(battle.T4AttackerSecondary1.toString()) + stringToNumber(battle.T4AttackerSecondary2.toString()) +
        stringToNumber(battle.T5AttackerSecondary1.toString()) + stringToNumber(battle.T5AttackerSecondary2.toString()),
        secondaryCap
      );
      totalDefenderSecondary = Math.min(
        stringToNumber(battle.T1DefenderSecondary1.toString()) + stringToNumber(battle.T1DefenderSecondary2.toString()) +
        stringToNumber(battle.T2DefenderSecondary1.toString()) + stringToNumber(battle.T2DefenderSecondary2.toString()) +
        stringToNumber(battle.T3DefenderSecondary1.toString()) + stringToNumber(battle.T3DefenderSecondary2.toString()) +
        stringToNumber(battle.T4DefenderSecondary1.toString()) + stringToNumber(battle.T4DefenderSecondary2.toString()) +
        stringToNumber(battle.T5DefenderSecondary1.toString()) + stringToNumber(battle.T5DefenderSecondary2.toString()),
        secondaryCap
      );
    }

    // Challenger
    let currentAttackerChallenger = 0;
    let currentDefenderChallenger = 0;
    if (isChallenger) {
      currentAttackerChallenger = Math.min(
        stringToNumber(battle.T2AttackerChallenger.toString()) + stringToNumber(battle.T3AttackerChallenger.toString()) +
        stringToNumber(battle.T4AttackerChallenger.toString()) + stringToNumber(battle.T5AttackerChallenger.toString()), 12
      );
      currentDefenderChallenger = Math.min(
        stringToNumber(battle.T2DefenderChallenger.toString()) + stringToNumber(battle.T3DefenderChallenger.toString()) +
        stringToNumber(battle.T4DefenderChallenger.toString()) + stringToNumber(battle.T5DefenderChallenger.toString()), 12
      );
    }

    // Total
    const totalAttacker = Math.min(totalAttackerPrimary + totalAttackerSecondary + currentAttackerChallenger, 90);
    const totalDefender = Math.min(totalDefenderPrimary + totalDefenderSecondary + currentDefenderChallenger, 90);

    setBattle((prev) => ({
      ...prev,
      TotalAttackerPrimary: totalAttackerPrimary,
      TotalAttackerSecondary: totalAttackerSecondary,
      TotalAttackerChallenger: currentAttackerChallenger,
      TotalAttacker: totalAttacker,
      TotalDefenderPrimary: totalDefenderPrimary,
      TotalDefenderSecondary: totalDefenderSecondary,
      TotalDefenderChallenger: currentDefenderChallenger,
      TotalDefender: totalDefender,
    }));

    updateDoc(doc(db, "Battles", docId), {
      TotalAttackerPrimary: totalAttackerPrimary, TotalAttackerSecondary: totalAttackerSecondary,
      TotalAttackerChallenger: currentAttackerChallenger, TotalAttacker: totalAttacker,
      TotalDefenderPrimary: totalDefenderPrimary, TotalDefenderSecondary: totalDefenderSecondary,
      TotalDefenderChallenger: currentDefenderChallenger, TotalDefender: totalDefender,
    }).catch((error) => console.log(error));

  }, [
    battle.ChapterApprovedVersion,
    battle.T1AttackerPrimary, battle.T2AttackerPrimary, battle.T3AttackerPrimary, battle.T4AttackerPrimary, battle.T5AttackerPrimary,
    battle.AttackerMissionBonus,
    battle.T1DefenderPrimary, battle.T2DefenderPrimary, battle.T3DefenderPrimary, battle.T4DefenderPrimary, battle.T5DefenderPrimary,
    battle.DefenderMissionBonus,
    battle.T1AttackerSecondary1, battle.T1AttackerSecondary2, battle.T2AttackerSecondary1, battle.T2AttackerSecondary2,
    battle.T3AttackerSecondary1, battle.T3AttackerSecondary2, battle.T4AttackerSecondary1, battle.T4AttackerSecondary2,
    battle.T5AttackerSecondary1, battle.T5AttackerSecondary2,
    battle.T1DefenderSecondary1, battle.T1DefenderSecondary2, battle.T2DefenderSecondary1, battle.T2DefenderSecondary2,
    battle.T3DefenderSecondary1, battle.T3DefenderSecondary2, battle.T4DefenderSecondary1, battle.T4DefenderSecondary2,
    battle.T5DefenderSecondary1, battle.T5DefenderSecondary2,
    battle.T2AttackerChallenger, battle.T3AttackerChallenger, battle.T4AttackerChallenger, battle.T5AttackerChallenger,
    battle.T2DefenderChallenger, battle.T3DefenderChallenger, battle.T4DefenderChallenger, battle.T5DefenderChallenger,
    armageddonSecondaries,
  ]);

  // ─── Battle End/Restart/Hide ────────────────────────────────────────────────

  const handleBattleEnd = (e) => {
    e.preventDefault();
    setBattle((prev) => ({ ...prev, IsCompleted: true }));
    updateDoc(doc(db, "Battles", docId), { IsCompleted: true }).catch((e) => console.log(e));
  };

  const handleBattleRestart = (e) => {
    e.preventDefault();
    setBattle((prev) => ({ ...prev, IsCompleted: false }));
    updateDoc(doc(db, "Battles", docId), { IsCompleted: false }).catch((e) => console.log(e));
  };

  const handleBattleHide = (e) => {
    e.preventDefault();
    setBattle((prev) => ({ ...prev, Show: false }));
    updateDoc(doc(db, "Battles", docId), { Show: false }).catch((e) => console.log(e));
    router.push("/");
  };

  // ─── Round props helper ─────────────────────────────────────────────────────

  const roundProps = (r: RoundKey) => ({
    RoundNumber: r,
    ChapterApprovedVersion: battle.ChapterApprovedVersion,
    IsCompleted: battle.IsCompleted,
    IsAttackerFirst: battle.IsAttackerFirst,
    isArmageddon,
    changeFunction: handleChange,
    changeFunctionSelect: handleChange,
    showChallenger: r > 1 ? isChallenger : false,
    AttackerSecondaryType: battle.AttackerSecondaryType,
    DefenderSecondaryType: battle.DefenderSecondaryType,
    // 10th primary
    AttackerPrimary: battle[`T${r}AttackerPrimary`],
    DefenderPrimary: battle[`T${r}DefenderPrimary`],
    // 10th secondaries
    AttackerSecondary1Title: battle[`T${r}AttackerSecondary1Title`],
    AttackerSecondary1: battle[`T${r}AttackerSecondary1`],
    AttackerSecondary2Title: battle[`T${r}AttackerSecondary2Title`],
    AttackerSecondary2: battle[`T${r}AttackerSecondary2`],
    DefenderSecondary1Title: battle[`T${r}DefenderSecondary1Title`],
    DefenderSecondary1: battle[`T${r}DefenderSecondary1`],
    DefenderSecondary2Title: battle[`T${r}DefenderSecondary2Title`],
    DefenderSecondary2: battle[`T${r}DefenderSecondary2`],
    // 10th challenger
    AttackerChallengerTitle: isChallenger && r > 1 ? battle[`T${r}AttackerChallengerTitle`] : "",
    AttackerChallenger: isChallenger && r > 1 ? battle[`T${r}AttackerChallenger`] : 0,
    DefenderChallengerTitle: isChallenger && r > 1 ? battle[`T${r}DefenderChallengerTitle`] : "",
    DefenderChallenger: isChallenger && r > 1 ? battle[`T${r}DefenderChallenger`] : 0,
    // 11th secondaries
    AttackerSecondaries: armageddonSecondaries[`T${r}AttackerSecondaries`],
    DefenderSecondaries: armageddonSecondaries[`T${r}DefenderSecondaries`],
    onAttackerSecondaryChange: (index: number, field: "title" | "points", value: string | number) =>
      handleSecondaryChange(r, "Attacker", index, field, value),
    onDefenderSecondaryChange: (index: number, field: "title" | "points", value: string | number) =>
      handleSecondaryChange(r, "Defender", index, field, value),
    onAttackerAddSecondary: () => handleAddSecondary(r, "Attacker"),
    onDefenderAddSecondary: () => handleAddSecondary(r, "Defender"),
  });

  // ─── Render ─────────────────────────────────────────────────────────────────

  return isHydrated ? (
    <>
      <section className="section">
        <header className="section-header">
          <h2>
            {battle.AttackerArmy && battle.DefenderArmy
              ? `${propertyFromID(armiesCollection, battle.AttackerArmy, "Name")} vs ${propertyFromID(armiesCollection, battle.DefenderArmy, "Name")}`
              : "Battle Report"}
          </h2>
          <span className="battle-date">{formatDate(battle.Date.seconds).full}</span>
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
                AttackerForceDisposition={battle.AttackerForceDisposition}
                DefenderForceDisposition={battle.DefenderForceDisposition}
                AttackerSecondaryType={battle.AttackerSecondaryType}
                DefenderSecondaryType={battle.DefenderSecondaryType}
                AttackerDetachments={attackerDetachments}
                DefenderDetachments={defenderDetachments}
                onAttackerDetachmentChange={(i, v) => handleDetachmentChange("Attacker", i, v)}
                onDefenderDetachmentChange={(i, v) => handleDetachmentChange("Defender", i, v)}
                onAttackerAddDetachment={() => handleAddDetachment("Attacker")}
                onDefenderAddDetachment={() => handleAddDetachment("Defender")}
                changeFunctionSelect={handleChange}
                changeFunctionText={handleChange}
                changeFunctionTextArea={handleChange}
              />

              <BattleFormRound {...roundProps(1)} />
              <BattleFormRound {...roundProps(2)} />
              <BattleFormRound {...roundProps(3)} />
              <BattleFormRound {...roundProps(4)} />
              <BattleFormRound {...roundProps(5)} />

              {!isArmageddon && (
                <BattleFormEnd
                  IsCompleted={battle.IsCompleted}
                  IsAttackerFirst={battle.IsAttackerFirst}
                  AttackerMissionBonus={battle.AttackerMissionBonus}
                  DefenderMissionBonus={battle.DefenderMissionBonus}
                  changeFunctionText={handleChange}
                />
              )}

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

              {battle.Victor && (
                battle.IsCompleted ? (
                  <>
                    <button className="button button-large button-center button-secondary" type="submit" onClick={handleBattleRestart}>
                      Restart Battle
                    </button>
                    <a className="a-delete" onClick={handleBattleHide}>Delete Battle</a>
                  </>
                ) : (
                  <button className="button button-xlarge button-center" type="submit" onClick={handleBattleEnd}>
                    End Battle
                  </button>
                )
              )}
            </form>
          </div>

          <aside>
            <div className="content content-dark content-sticky content-score">
              <div className={`opponent-layout ${!battle.IsAttackerFirst ? "reverse" : ""}`}>
                <div className="opponent">
                  <legend className="attacker">Attacker</legend>
                  <span className="score-highlight">{battle.TotalAttacker}</span>
                  <span>Primary:{battle.TotalAttackerPrimary}/{isArmageddon ? 45 : 50}</span>
                  <span>Secondary:{battle.TotalAttackerSecondary}/{isArmageddon ? 45 : 40}</span>
                  {isChallenger && <span>Challenger:{battle.TotalAttackerChallenger}/12</span>}
                </div>
                <div className="opponent">
                  <legend className="defender">Defender</legend>
                  <span className="score-highlight">{battle.TotalDefender}</span>
                  <span>Primary:{battle.TotalDefenderPrimary}/{isArmageddon ? 45 : 50}</span>
                  <span>Secondary:{battle.TotalDefenderSecondary}/{isArmageddon ? 45 : 40}</span>
                  {isChallenger && <span>Challenger:{battle.TotalDefenderChallenger}/12</span>}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="device-score-bar hide-lg">
          <div className={`opponent-layout ${!battle.IsAttackerFirst ? "reverse" : ""}`}>
            <div className="opponent">
              <span className="score-highlight">{battle.TotalAttacker}</span>
              <div>
                <legend className="attacker">Attacker</legend>
                <span title="Primary Points" className="type-points">P:{battle.TotalAttackerPrimary}/{isArmageddon ? 45 : 50}</span>
                <span title="Secondary Points" className="type-points">S:{battle.TotalAttackerSecondary}/{isArmageddon ? 45 : 40}</span>
                {isChallenger && <span title="Challenger Points" className="type-points">C:{battle.TotalAttackerChallenger}/12</span>}
              </div>
            </div>
            <div className="opponent">
              <span className="score-highlight">{battle.TotalDefender}</span>
              <div>
                <legend className="defender">Defender</legend>
                <span title="Primary Points" className="type-points">P:{battle.TotalDefenderPrimary}/{isArmageddon ? 45 : 50}</span>
                <span title="Secondary Points" className="type-points">S:{battle.TotalDefenderSecondary}/{isArmageddon ? 45 : 40}</span>
                {isChallenger && <span title="Challenger Points" className="type-points">C:{battle.TotalDefenderChallenger}/12</span>}
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