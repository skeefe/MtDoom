import { useState, useEffect } from "react";
import firebase_app from "./config";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";

//NOT IN USE - moved to the form-battle-report.

export default async function getDocShapshot(collection, docId) {
  const db = getFirestore(firebase_app);

  const [report, setReport] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, collection, docId), (doc) => {
      setReport((prev) => {
        return { ...doc.data() };
      });
    });

    return unsubscribe;
  }, []);

  return report;
}
