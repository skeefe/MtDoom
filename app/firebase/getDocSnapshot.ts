import { useState, useEffect } from "react";
import firebase_app from "./config";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";

export default function getDocSnapshot(collectionId: string, docId: string) {
  const [fbData, setFBData] = useState({});

  const db = getFirestore(firebase_app);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, collectionId, docId), (doc) => {
      setFBData(() => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });
    });

    return unsubscribe;
  }, []);

  return fbData;
}
