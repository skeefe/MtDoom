import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  serverTimestamp 
} from "firebase/firestore";
import firebase_app from "../app/firebase/config";

export const createNewBattle = async (router: any) => {
  const db = getFirestore(firebase_app);
  console.log("DEBUG: 1. Utility Started");

  try {
    const configRef = doc(db, "Settings", "appConfig");
    console.log("DEBUG: 2. Fetching Config...");
    
    const configSnap = await getDoc(configRef);
    console.log("DEBUG: 3. Config Received. Exists:", configSnap.exists());
    
    const defaultEdition = configSnap.exists() ? configSnap.data().defaultEdition : 10;
    console.log("DEBUG: 4. Using Edition:", defaultEdition);

    const newBattle = {
      Edition: defaultEdition,
      IsCompleted: false,
      Show: true,
      Date: serverTimestamp(),
      ChapterApprovedVersion: defaultEdition === 11 ? "Season 1" : "2025-26 Mission Deck",
      TotalAttacker: 0,
      TotalDefender: 0,
      Attacker: "",
      Defender: "",
      AttackerArmy: "",
      DefenderArmy: "",
      Victor: "",
    };

    console.log("DEBUG: 5. Writing to Firestore...");
    const docRef = await addDoc(collection(db, "Battles"), newBattle);
    console.log("DEBUG: 6. Write Success. ID:", docRef.id);

    console.log("DEBUG: 7. Triggering Router Push to:", `/battle/${docRef.id}`);
    router.push(`/battle/${docRef.id}`);

  } catch (error) {
    console.error("DEBUG: CRITICAL ERROR:", error);
    throw error; 
  }
};