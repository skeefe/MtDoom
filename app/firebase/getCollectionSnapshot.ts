"use client";

import {
  OrderByDirection,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import firebase_app from "./config";

export default function getCollectionSnapshot(
  fbCollection,
  orderProperty: string = "Date",
  orderDirection: OrderByDirection = "desc"
) {
  const [fbData, setFBData] = useState(new Array());

  const db = getFirestore(firebase_app);
  const collectionRef = collection(db, fbCollection);
  const q = query(collectionRef, orderBy(orderProperty, orderDirection));

  useEffect(() => {
    const getSnapShot = onSnapshot(q, (querySnapshot) => {
      setFBData(
        querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        })
      );
      return getSnapShot;
    });
  }, []);

  return fbData;
}
