import { useState, useEffect } from "react";
import firebase_app from "./config";
import { getFirestore, collection, onSnapshot, query, doc } from "firebase/firestore";

export default async function getDocShapshot(collection, docId){
    //console.log("colllectionName: ", collection); //Working
    //console.log("docId: ", docId); //Working

    const db = getFirestore(firebase_app)

    const [report, setReport] = useState({
        Date:"",
        PrimaryMission: "",
        MissionRule: "",
        Attacker: "",
        AttackerArmy: "",
        Defender: "",
        DefenderArmy: "",
        FirstTurn: "",
        Size: "3000pt",
        T1AttackerSecondary1Title: "",
        T1AttackerSecondary1: 0,
        T1AttackerSecondary2Title: "",
        T1AttackerSecondary2: 0,
        T1DefenderSecondary1Title: "",
        T1DefenderSecondary1: 0,
        T1DefenderSecondary2Title: "",
        T1DefenderSecondary2: 0,
        T2AttackerPrimary: 0,
        T2AttackerSecondary1Title: "",
        T2AttackerSecondary1: 0,
        T2AttackerSecondary2Title: "",
        T2AttackerSecondary2: 0,
        T2DefenderPrimary: 0,
        T2DefenderSecondary1Title: "",
        T2DefenderSecondary1: 0,
        T2DefenderSecondary2Title: "",
        T2DefenderSecondary2: 0,
        T3AttackerPrimary: 0,
        T3AttackerSecondary1Title: "",
        T3AttackerSecondary1: 0,
        T3AttackerSecondary2Title: "",
        T3AttackerSecondary2: 0,
        T3DefenderPrimary: 0,
        T3DefenderSecondary1Title: "",
        T3DefenderSecondary1: 0,
        T3DefenderSecondary2Title: "",
        T3DefenderSecondary2: 0,
        T4AttackerPrimary: 0,
        T4AttackerSecondary1Title: "",
        T4AttackerSecondary1: 0,
        T4AttackerSecondary2Title: "",
        T4AttackerSecondary2: 0,
        T4DefenderPrimary: 0,
        T4DefenderSecondary1Title: "",
        T4DefenderSecondary1: 0,
        T4DefenderSecondary2Title: "",
        T4DefenderSecondary2: 0,
        T5AttackerPrimary: 0,
        T5AttackerSecondary1Title: "",
        T5AttackerSecondary1: 0,
        T5AttackerSecondary2Title: "",
        T5AttackerSecondary2: 0,
        T5DefenderPrimary: 0,
        T5DefenderSecondary1Title: "",
        T5DefenderSecondary1: 0,
        T5DefenderSecondary2Title: "",
        T5DefenderSecondary2: 0,
        AttackerMissionBonus: 0,
        DefenderMissionBonus: 0,
        Victor: "",
        VictoryType: "",
        TurnEnded: 0,
        AttackerMVP: "",
        DefenderMVP: "",
        BattleNotes: "",
        TotalAttacker: 0,
        TotalDefender: 0,
      });
    
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, collection, docId), (doc) => {
            setReport((prev) => {
                //console.log('doc.data(): ', doc.data()); //Working
                return { ...prev,  ...doc.data() }
            })
            return {
                ...doc.data(),
                id: doc.id
            }
        });
        return unsubscribe;
    },[])

    //console.log('Report', report); //Working
    return(report);   
}