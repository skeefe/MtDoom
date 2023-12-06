"use client";

import {
  doc,
  getFirestore,
  setDoc,
  runTransaction,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import firebase_app from "../firebase/config";
import { idify } from "../../utils/idify";
import { titleCase } from "../../utils/title-case";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "./spinner";

const BattleForm = (props: { battleId: string }) => {
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const docId: string = props.battleId;

  //Hydrate state with battle data on load.
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Battles", docId), (doc) => {
      setBattle((prev) => {
        return { ...prev, ...doc.data() };
      });
    });
    return () => unsubscribe();
  }, []);

  const [battle, setBattle] = useState({
    Date: { seconds: null }, //Populated on doc creation.
    PrimaryMission: "",
    Size: "3000pt",
  });

  const handleChange = (e) => {
    /*
    const name = e.target.name;
    let value = e.target.value;

    setArmy((prev) => {
      return { ...prev, [name]: value };
    });
    */
  };

  return (
    <>
      <section className="section">
        <header className="section-header">
          <h2>Battle Report</h2>
        </header>

        <form>
          <div className="content content-dark">
            <fieldset>
              <legend>Pre-Battle Setup</legend>
              <div className="field-container">
                <label htmlFor="battleSize">Battle Size*:</label>
                <input
                  id="battleSize"
                  name="Battle Size"
                  placeholder="Battle Size"
                  type="text"
                  value={battle.Size}
                  onChange={handleChange}
                  required
                />
              </div>
            </fieldset>
          </div>
        </form>
      </section>
    </>
  );
};

export default BattleForm;
