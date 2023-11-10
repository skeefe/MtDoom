import { useState, useEffect } from "react";
import firebase_app from "./config";
<<<<<<< HEAD
import { getFirestore, collection, onSnapshot, query, orderBy } from "firebase/firestore";
=======
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
>>>>>>> 02af7ab398ef14e64b9e2910b00289926e7281f0

export default function getCollectionShapshot(fbCollection) {
  const db = getFirestore(firebase_app);

  const [fbData, setFBData] = useState([]);

<<<<<<< HEAD
    useEffect(() => {
        const collectionRef = collection(db, colllection);
        const q = query(collectionRef, orderBy("Date", "desc"));
=======
  useEffect(() => {
    const collectionRef = collection(db, fbCollection);
    const q = query(collectionRef); //, orderBy('createdAt','desc'));

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
>>>>>>> 02af7ab398ef14e64b9e2910b00289926e7281f0

    return unsubscribe;
  }, []);

  return fbData;
}
