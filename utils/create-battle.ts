import { getFirestore, collection, addDoc, updateDoc, Timestamp } from "firebase/firestore";
import firebase_app from "../app/firebase/config";

export const createNewBattle = async (router: any) => {
  const db = getFirestore(firebase_app);

  // 1. Create the empty doc
  const docRef = await addDoc(collection(db, "Battles"), {});

  // 2. Set the default data
  await updateDoc(docRef, {
    Date: Timestamp.now(),
    Show: true
  });

  // 3. Navigate to the new battle page
  router.push(`/battle/${docRef.id}`);
};