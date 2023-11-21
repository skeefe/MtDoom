import React from "react";
import getCollection from "../firebase/getCollection";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import { collection, getCountFromServer, getFirestore, or, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import firebase_app from "../firebase/config";
import ArmyListRow from "./army-list-row";


const ArmyList = () => {
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc");
  
  function handleRowClick(id) {
    router.push(`/army/${id}`);
  }

  return (
    <>
      <div className="lg:flex gap-x-12">
        <section id="armyList" className="lg:flex-1">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8">
            Army List - Under Construction
          </h1>

          <table className="armys-list">
            <thead>
              <tr>
                <th>Name</th>
                <th>Played</th>
                <th>Won</th>
                <th>Lost</th>
                <th>Total Points</th>
                <th>Points +/-</th>
              </tr>
            </thead>

            <tbody>
              {armyCollection.map((armyItem, index) => (
                <ArmyListRow {...armyItem} key={index} />
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
};

export default ArmyList;