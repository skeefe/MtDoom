"use client";

import { doc, getFirestore, setDoc, runTransaction } from "firebase/firestore";
import React, { useState } from "react";
import firebase_app from "../firebase/config";
import { idify } from "../../utils/idify";
import { titleCase } from "../../utils/title-case";
import { useRouter } from "next/navigation";

const ArmyFormAdd = () => {
  const router = useRouter();

  const [army, setArmy] = useState({
    Name: "",
    Colour: "#FFD700",
    Crest: "",
    Emoji: "",
    Adjectives: "",
    Bio: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    setArmy((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleAdjectives = () => {
    //Strip and spaces following commas.
    let adjectivesValue = army.Adjectives.replace(", ", ",");

    //Split Adjectives string to array and remove empty entries.
    let adjectives = adjectivesValue.split(",").filter((str) => str !== "");

    //Title Case each adgective.
    let formattedAdjectives = new Array();
    adjectives.map(function (adjective) {
      formattedAdjectives.push(titleCase(adjective));
    });

    //Neaten up Adjective Field
    setArmy((prev) => {
      return { ...prev, ["Adjectives"]: formattedAdjectives.join(", ") };
    });

    return formattedAdjectives;
  };

  async function handleAddArmy(e) {
    e.preventDefault();

    const db = getFirestore(firebase_app);

    //Confirm and army name was supplied.

    if (army.Name.length > 0) {
      //Generate ID here
      const armyId = idify(army.Name);
      const docRef = doc(db, "Armies", armyId);
      try {
        await runTransaction(db, async (transaction) => {
          const armyDoc = await transaction.get(docRef);
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
    }

    router.push("/");

    return false;
  }

  return (
    <>
      <section className="section">
        <header className="section-header">
          <h2>Add an Army</h2>
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
            <button
              className="button button-full button-large"
              type="submit"
              onClick={(e) => handleAddArmy(e)}
            >
              Add Army
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default ArmyFormAdd;
