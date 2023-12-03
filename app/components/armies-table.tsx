import React from "react";
import {
  getFirestore,
  updateDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import router from "next/router";
import firebase_app from "../firebase/config";
import Spinner from "./spinner";
import ArmyTableRow from "./army-table-row";
import { ArmySummary } from "../types/army";

const ArmiesTable = (props: {
  title: string;
  armies: ArmySummary[];
  showCreateButton: boolean;
}) => {
  /*
  async function handleAddBattle() {
    const db = getFirestore(firebase_app);
    const docRef = await addDoc(collection(db, "Armies"), {});

    //Add date.
    updateDoc(docRef, { Date: Timestamp.now() })
      .then((docRef) => {})
      .catch((error) => {
        console.log(error);
      });

    router.push(`/battle/${docRef.id}`);
  }
  */

  console.log(props.armies.length);

  return props.armies.length > 0 ? (
    <>
      <section className="section">
        <header className="section-header">
          <h2>{props.title}</h2>

          {props.showCreateButton ? (
            <button
              className="button section-header-button"
              type="submit"
              //onClick={(event) => handleAddBattle()}
            >
              Add Army
            </button>
          ) : null}
        </header>

        <table className="primary-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Played</th>
              <th>Won</th>
              <th>Lost</th>
              <th>Avg. Points</th>
              <th>Total Points</th>
              <th>Points +/-</th>
              <th>Win %</th>
              <th>First Turn %</th>
            </tr>
          </thead>

          <tbody>
            {props.armies.map((army, index) => (
              <ArmyTableRow army={army} key={index} />
            ))}
          </tbody>
        </table>
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default ArmiesTable;
