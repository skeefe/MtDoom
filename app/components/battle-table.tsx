import React from "react";
import {
  getFirestore,
  updateDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import BattleTableRow from "./battle-table-row";
import { battleSummary } from "../types/battle";
import firebase_app from "../firebase/config";
import router from "next/router";
import Spinner from "./spinner";

const BattleTable = (props: {
  title: string;
  battles: battleSummary[];
  showCreateButton: boolean;
}) => {
  async function handleAddBattle() {
    const db = getFirestore(firebase_app);
    const docRef = await addDoc(collection(db, "Battles"), {});

    //Add date.
    updateDoc(docRef, { Date: Timestamp.now() })
      .then((docRef) => {})
      .catch((error) => {
        console.log(error);
      });

    router.push(`/battle/${docRef.id}`);
  }

  return props.battles.length > 0 ? (
    <>
      <section className="section">
        <header className="section-header">
          <h2>{props.title}</h2>

          {props.showCreateButton ? (
            <button
              className="button section-header-button"
              type="submit"
              onClick={(event) => handleAddBattle()}
            >
              Create Battle
            </button>
          ) : null}
        </header>

        <table className="primary-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Mission</th>
              <th>Attacker</th>
              <th>Defender</th>
            </tr>
          </thead>

          <tbody>
            {props.battles.map((battle, index) => (
              <BattleTableRow battle={battle} key={index} />
            ))}
          </tbody>
        </table>
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default BattleTable;
