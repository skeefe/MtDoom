import firebase_app from "./config";
import { getFirestore, collection, query, or, where, getCountFromServer } from "firebase/firestore";

const db = getFirestore(firebase_app);
const battlesRef = collection(db, "Battles");

export async function getArmyPlayedCount(army:string) {
  let result = null;
  let error = null;
  try {
    
    const armyBattlesQuery = query(battlesRef, or( where("AttackerArmy", "==", army), where("DefenderArmy", "==", army) ));
    const armyBattlesQuantity = await getCountFromServer(armyBattlesQuery);
    result = armyBattlesQuantity.data().count;// val;

  } catch (e) {
    error = e;
  }

  return { result, error };
}
//export {getArmyPlayedCount };

/*
export async function getArmyWonCount(army:string) {
  let result = null;
  let error = null;
  try {
    
    const armyBattlesQuery = query(battlesRef, where("Victor", "==", army), where("DefenderArmy", "==", army) ));
    const armyBattlesQuantity = await getCountFromServer(armyBattlesQuery);
    result = armyBattlesQuantity.data().count;// val;

  } catch (e) {
    error = e;
  }

  return { result, error };
}
*/