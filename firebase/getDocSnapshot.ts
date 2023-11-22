import { useState, useEffect } from "react";
import firebase_app from "./config";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";

export default function getDocShapshot(fbCollection, docId:string) {
  const [fbData, setFBData] = useState({});

  const db = getFirestore(firebase_app);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, fbCollection, docId), (doc) => {
      setFBData(() => {
        return {
          ...doc.data()
        };
      });
    });

    return unsubscribe;
  }, []);

  return fbData;
}