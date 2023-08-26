import React, { useState, useEffect } from "react";
//import { getFirestore, collection, addDoc, Firestore } from "firebase/firestore";
//import {QueryDocumentSnapshot,DocumentData,query,where,limit,getDocs} from "@firebase/firestore";
import app from "../firebase/config";
import getCollection from "../firebase/getCollection";
import BattleItem from "./battle-item";

const BattleList = () => {

  /*
  const [battleList, setBattleList] = useState([{
    Date: "",
    PrimaryMission: "",
    MissionRule: "",
    Attacker: "",
    AttackerArmy: "",
    Defender: "",
    DefenderArmy: "",    
    Victor: "",
    VictoryType: "",
    TurnEnded: 0,
    AttackerMVP: "",
    DefenderMVP: "",
    BattleNotes: "",
    TotalAttacker: 0,
    TotalDefender: 0,
  }]);
  */

  const battleCollection = getCollection('Battles')

  return (
    <>
      <div className="lg:flex gap-x-12">
        <section id="battleList" className="lg:flex-1">

          <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8">
            Battle List
          </h1>

          <table className="battles-list">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mission</th>
                <th>Attacker</th>
                <th>Defender</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {battleCollection.map((battleItem, index) => (
                <tr key={index}>
                  <td>{battleItem.Date}</td>
                  <td>{battleItem.Mission}</td>
                  <td>
                    <strong>{battleItem.Attacker}</strong>
                    <span>Army: {battleItem.AttackerArmy}</span>
                    <span>Total: {battleItem.TotalAttacker}</span>
                  </td>
                  <td>
                    <strong>{battleItem.Defender}</strong>
                    <span>Army: {battleItem.DefenderArmy}</span>
                    <span>Total: {battleItem.TotalDefender}</span>
                  </td>
                  <td><a href="#">Details</a></td>
                </tr>
              ))}
            </tbody>

          </table>

        </section>

      </div>
    </>

  );
};

export default BattleList;
