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
import TextField from "./text-field";
import TextAreaField from "./textarea-field";
import CheckboxField from "./checkboxField";  // Import the CheckboxField component

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
    CurrentCodexOwned: false,
  });

  useEffect(() => {
    if (army.isEdit) {
      const unsubscribe = onSnapshot(doc(db, "Armies", docRef), (doc) => {
        setArmy((prev) => {
          return { ...prev, ...doc.data() };  // Ensure the data is updated with the doc from Firestore
        });
      });
      return () => unsubscribe();
    }
  }, [army.isEdit, docRef]);  // Ensure this hook only runs when necessary

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setArmy((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleAdjectives = () => {
    if (!army.Adjectives || army.Adjectives.length === 0) {
      return [];
    }

    let adjectivesValue = army.Adjectives.toString().replace(", ", ",");

    let adjectives = adjectivesValue.split(",").filter((str) => str !== "");

    let formattedAdjectives = new Array();
    adjectives.map(function (adjective) {
      formattedAdjectives.push(titleCase(adjective));
    });

    formattedAdjectives = formattedAdjectives.filter((element, index) => {
      return formattedAdjectives.indexOf(element) === index;
    });

    setArmy((prev) => {
      return { ...prev, ["Adjectives"]: formattedAdjectives.join(", ") };
    });

    return formattedAdjectives;
  };

  const handleAddArmy = async (e) => {
    e.preventDefault();

    const db = getFirestore(firebase_app);

    if (army.Name.length > 0) {
      const armyId = idify(army.Name);
      const newDocRef = doc(db, "Armies", armyId);
      try {
        await runTransaction(db, async (transaction) => {
          const armyDoc = await transaction.get(newDocRef);
          if (armyDoc.exists()) {
            throw "Army already exists. Please try a different name.";
          }
        });
        await setDoc(doc(db, "Armies", armyId), {
          Name: army.Name,
          Colour: army.Colour,
          Crest: army.Crest,
          Emoji: army.Emoji,
          Adjectives: handleAdjectives(),
          Bio: army.Bio,
          CurrentCodexOwned: army.CurrentCodexOwned, // Save the new field
        });
      } catch (e) {
        console.log("The army was not added: ", e);
      }

      router.push(`/army/${armyId}`);
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
      CurrentCodexOwned: army.CurrentCodexOwned, // Update the field
    })
      .then((docBattlesRef) => { })
      .catch((error) => {
        console.log(error);
      });

    router.push(`/army/${props.armyId}`);

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
        <div className="aside-layout">
          <div className="content content-dark">
            <form>
              <fieldset>
                <TextField
                  label="Name"
                  type="text"
                  id="armyName"
                  name="Name"
                  value={army.Name}
                  emptyValue="Army Name"
                  required={true}
                  changeFunction={handleChange}
                />
                <TextField
                  label="Colour"
                  type="color"
                  id="armyColour"
                  name="Colour"
                  value={army.Colour}
                  emptyValue="Army Colour"
                  required={false}
                  changeFunction={handleChange}
                />
                <TextField
                  label="Crest (SVG Only)"
                  type="text"
                  id="armyCrest"
                  name="Crest"
                  value={army.Crest}
                  emptyValue="Army Crest - SVG Only, ideally square with a transparent background."
                  required={false}
                  changeFunction={handleChange}
                />
                <TextField
                  label="Emoji"
                  type="text"
                  id="armyEmoji"
                  name="Emoji"
                  value={army.Emoji}
                  emptyValue="Army Emoji: Windows Key + ."
                  required={false}
                  changeFunction={handleChange}
                />
                <TextField
                  label="Adjectives"
                  type="text"
                  id="armyAdjectives"
                  name="Adjectives"
                  value={army.Adjectives}
                  emptyValue="Army Adjectives: Comma separated, e.g. Example1, Example2"
                  required={false}
                  changeFunction={handleChange}
                />
                <TextAreaField
                  label="Bio"
                  id="armyBio"
                  name="Bio"
                  emptyValue="Army biography."
                  value={army.Bio}
                  changeFunction={handleChange}
                />

                {/* Use the CheckboxField component for Current Codex Owned */}
                <CheckboxField
                  label="Current Codex Owned"
                  id="currentCodexOwned"
                  name="CurrentCodexOwned"
                  checked={army.CurrentCodexOwned}  // This will correctly bind to `CurrentCodexOwned`
                  required={false}
                  changeFunction={handleChange}
                />
              </fieldset>

              {army.isEdit ? (
                <>
                  <button
                    className="button button-large button-center"
                    type="submit"
                    onClick={(e) => handleUpdateArmy(e)}
                  >
                    Update {army.Name}
                  </button>
                </>
              ) : (
                <button
                  className="button button-large button-center"
                  type="submit"
                  onClick={(e) => handleAddArmy(e)}
                >
                  Add Army
                </button>
              )}
            </form>
          </div>
          <aside></aside>
        </div>
      </section>
    </>
  ) : (
    <Spinner />
  );
};

export default ArmyForm;
