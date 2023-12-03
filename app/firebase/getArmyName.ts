import { useState, useEffect } from "react";
import firebase_app from "./config";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";

export default function getArmyName(armyId: string) {
  const [fbData, setFBData] = useState({});

  const db = getFirestore(firebase_app);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Armies", armyId), (doc) => {
      setFBData(() => {
        return {
          ...doc.data(),
        };
      });
    });

    return unsubscribe;
  }, []);

  return fbData["Name"];
}
