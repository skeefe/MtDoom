import { useState, useEffect } from "react";
import firebase_app from "./config";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  //orderBy,
  where,
  or
} from "firebase/firestore";

//Order by date.
export default function getArmyBattleCollectionSnapshot(armyID:string) {
  const db = getFirestore(firebase_app);
  const [fbData, setFBData] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, 'Battles');
    const q = query(collectionRef, or(where('AttackerArmy', '==', armyID), where('DefenderArmy', '==', armyID)));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setFBData(
        querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        })
      );
    });

    return unsubscribe;
  }, []);

  return fbData;
}
