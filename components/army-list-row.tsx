import React, { useState, useEffect } from 'react';
import getCollection from "../firebase/getCollection";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import { collection, getCountFromServer, getFirestore, or, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import firebase_app from "../firebase/config";
import {getArmyPlayedCount} from "../firebase/getArmyData";


export default function ArmyListRow(army) {
  const router = useRouter();
  
  const [armyData, setArmyData] = useState({
    played: 0,
    won:0,
    lost:0
  });

  const getArmyData = async () => {
    const played = await getArmyPlayedCount(army.army.Name)
    //const won = await getArmyWonCount(army.army.Name)
    setArmyData((prev) => {
      return { ...prev, ["played"]: played.result };
    });
  }

  useEffect(() => {
    getArmyData()
  }, [])

  function handleRowClick(id) {
    router.push(`/army/${id}`);
  }

  return (
    <>
      <tr
        onClick={() => handleRowClick(army.army.id)}
        className="cursor-pointer"
      >
        <td>{army.army.Name}</td>
        <td>{armyData.played}</td>        
        <td>{armyData.won}</td>
      </tr>
    </>
  );
};
