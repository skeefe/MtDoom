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

const ArmyForm = (props: { armyId?: string }) => {
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const docRef: string = props.armyId ? props.armyId : "";

  const [army, setArmy] = useState({
    isEdit: props.armyId ? true : false,
    Name: "",
    Colour: "#FFD700",
    Crest: "",
    Emoji: "",
    Adjectives: "",
    Bio: "",
  });

  useEffect(() => {
    if (army.isEdit) {
      const unsubscribe = onSnapshot(doc(db, "Armies", docRef), (doc) => {
        setArmy((prev) => {
          return { ...prev, ...doc.data() };
        });
      });
      return () => unsubscribe();
    }
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    setArmy((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleAdjectives = () => {
    //Handle no adjectives.
    if (!army.Adjectives || army.Adjectives.length === 0) {
      return [];
    }

    //Strip and spaces following commas.
    let adjectivesValue = army.Adjectives.replace(", ", ",");

    //Split Adjectives string to array and remove empty entries.
    let adjectives = adjectivesValue.split(",").filter((str) => str !== "");

    //Title Case each Adjective.
    let formattedAdjectives = new Array();
    adjectives.map(function (adjective) {
      formattedAdjectives.push(titleCase(adjective));
    });

    //Remove Duplicates
    formattedAdjectives = formattedAdjectives.filter((element, index) => {
      return formattedAdjectives.indexOf(element) === index;
    });

    //Neaten up Adjective Field
    setArmy((prev) => {
      return { ...prev, ["Adjectives"]: formattedAdjectives.join(", ") };
    });

    return formattedAdjectives;
  };

  const handleAddArmy = async (e) => {
    e.preventDefault();

    const db = getFirestore(firebase_app);

    //Confirm and army name was supplied.
    if (army.Name.length > 0) {
      //Generate ID here
      const armyId = idify(army.Name);
      const newDocRef = doc(db, "Armies", armyId);
      try {
        await runTransaction(db, async (transaction) => {
          const armyDoc = await transaction.get(newDocRef);
          if (armyDoc.exists()) {
            throw "Army already exists. Please try a different name.";
          }
        });
        //Create document.
        await setDoc(doc(db, "Armies", armyId), {
          Name: army.Name,
          Colour: army.Colour,
          Crest: army.Crest,
          Emoji: army.Emoji,
          Adjectives: handleAdjectives(),
          Bio: army.Bio,
        });
      } catch (e) {
        console.log("The army was not added: ", e);
      }

      router.push(`/army/${armyId}/edit`);
    }

    return false;
  };

  const handleUpdateArmy = async (e) => {
    e.preventDefault();

    await updateDoc(doc(db, "Armies", docRef), {
      Name: army.Name,
      Colour: army.Colour,
      Crest: army.Crest,
      Emoji: army.Emoji,
      Adjectives: handleAdjectives(),
      Bio: army.Bio,
    })
      .then((docBattlesRef) => {})
      .catch((error) => {
        console.log(error);
      });

    router.push(`/army/${props.armyId}/edit`);

    return false;
  };

  return !army.isEdit || (army.isEdit && army.Name.length > 0) ? (
    <>
      <section className="section">
        <header className="section-header">
          {army.isEdit ? (
            <>
              <h2>Edit: {army.Name}</h2>
              <Link href={`/army/${props.armyId}`}>
                <button className="button section-header-button">Cancel</button>
              </Link>
            </>
          ) : (
            <h2>Add an Army</h2>
          )}
        </header>
        <form>
          <div className="content content-dark">
            <fieldset>
              <div className="field-container">
                <label htmlFor="armyName">Name*:</label>
                <input
                  id="armyName"
                  name="Name"
                  placeholder="Army Name"
                  type="text"
                  value={army.Name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field-container">
                <label htmlFor="armyColour">Colour:</label>
                <input
                  id="armyColour"
                  name="Colour"
                  placeholder="Army Colour"
                  type="color"
                  value={army.Colour}
                  onChange={handleChange}
                />
              </div>
              <div className="field-container">
                <label htmlFor="armyCrest">Crest (SVG Only):</label>
                <input
                  id="armyCrest"
                  name="Crest"
                  placeholder="Army Crest - SVG Only, ideally square with a transparent background."
                  type="text"
                  value={army.Crest}
                  onChange={handleChange}
                />
              </div>
              <div className="field-container">
                <label htmlFor="armyEmoji">Emoji:</label>
                <input
                  id="armyEmoji"
                  name="Emoji"
                  placeholder="Army Emoji: Windows Key + ."
                  type="text"
                  maxLength={4}
                  value={army.Emoji}
                  onChange={handleChange}
                />
              </div>
              <div className="field-container">
                <label htmlFor="armyAdjectives">Adjectives:</label>
                <input
                  id="armyAdjectives"
                  name="Adjectives"
                  placeholder="Army Adjectives: Comma separated, e.g. Example1, Example2"
                  type="text"
                  value={army.Adjectives}
                  onChange={handleChange}
                />
              </div>
              <div className="field-container">
                <label htmlFor="armyBio">Bio:</label>
                <textarea
                  id="armyBio"
                  name="Bio"
                  placeholder="Army biography."
                  value={army.Bio}
                  onChange={handleChange}
                />
              </div>
            </fieldset>

            {army.isEdit ? (
              <>
                <button
                  className="button button-full button-large"
                  type="submit"
                  onClick={(e) => handleUpdateArmy(e)}
                >
                  Update {army.Name}
                </button>
              </>
            ) : (
              <button
                className="button button-full button-large"
                type="submit"
                onClick={(e) => handleAddArmy(e)}
              >
                Add Army
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default ArmyForm;
