import { useState, useEffect } from "react";
import firebase_app from "./config";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  OrderByDirection,
} from "firebase/firestore";

export default function getCollectionShapshot(fbCollection, orderProperty:string = "Date", orderDirection:OrderByDirection = "desc") {
  const db = getFirestore(firebase_app);

  const [fbData, setFBData] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, fbCollection);
    const q = query(collectionRef, orderBy(orderProperty,orderDirection));

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
