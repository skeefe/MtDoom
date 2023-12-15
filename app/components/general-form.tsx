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
import TextField from "./textField";
import TextAreaField from "./textAreaField";

const GeneralForm = (props: { generalId?: string }) => {
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const docRef: string = props.generalId ? props.generalId : "";

  const [general, setGeneral] = useState({
    isEdit: props.generalId ? true : false,
    Name: "",
    Alias: "",
    Emoji: "",
    Nicknames: "",
    Bio: "",
  });

  useEffect(() => {
    if (general.isEdit) {
      const unsubscribe = onSnapshot(doc(db, "Generals", docRef), (doc) => {
        setGeneral((prev) => {
          return { ...prev, ...doc.data() };
        });
      });
      return () => unsubscribe();
    }
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    setGeneral((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleNicknames = () => {
    //Handle no Nicknames.
    if (!general.Nicknames || general.Nicknames.length === 0) {
      return [];
    }

    //Strip and spaces following commas.
    let nicknamesValue = general.Nicknames.toString().replace(", ", ",");

    //Split Nicknames string to array and remove empty entries.
    let nicknames = nicknamesValue.split(",").filter((str) => str !== "");

    //Title Case each Nickname.
    let formattedNicknames = new Array();
    nicknames.map(function (nickname) {
      formattedNicknames.push(titleCase(nickname));
    });

    //Remove Duplicates
    formattedNicknames = formattedNicknames.filter((element, index) => {
      return formattedNicknames.indexOf(element) === index;
    });

    //Neaten up Nickname Field
    setGeneral((prev) => {
      return { ...prev, ["Nicknames"]: formattedNicknames.join(", ") };
    });

    return formattedNicknames;
  };

  const handleAddGeneral = async (e) => {
    e.preventDefault();

    const db = getFirestore(firebase_app);

    //Confirm General name was supplied.
    if (general.Name.length > 0) {
      //Generate ID here
      const generalId = idify(general.Alias);
      const newDocRef = doc(db, "Generals", generalId);
      try {
        await runTransaction(db, async (transaction) => {
          const generalDoc = await transaction.get(newDocRef);
          if (generalDoc.exists()) {
            throw "General already exists. Please try a different alias.";
          }
        });
        //Create document.
        await setDoc(doc(db, "Generals", generalId), {
          Name: general.Name,
          Alias: general.Alias,
          Emoji: general.Emoji,
          Nicknames: handleNicknames(),
          Bio: general.Bio,
        });
      } catch (e) {
        console.log("The general was not added: ", e);
      }

      router.push(`/general/${generalId}/edit`);
    }

    return false;
  };

  const handleUpdateGeneral = async (e) => {
    e.preventDefault();

    await updateDoc(doc(db, "Generals", docRef), {
      Name: general.Name,
      Alias: general.Alias,
      Emoji: general.Emoji,
      Nicknames: handleNicknames(),
      Bio: general.Bio,
    })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });

    router.push(`/general/${props.generalId}/edit`);

    return false;
  };

  return !general.isEdit || (general.isEdit && general.Name.length > 0) ? (
    <>
      <section className="section">
        <header className="section-header">
          {general.isEdit ? (
            <>
              <h2>Edit: General {general.Alias}</h2>
              <Link href={`/general/${props.generalId}`}>
                <button className="button section-header-button">Cancel</button>
              </Link>
            </>
          ) : (
            <h2>Add a General</h2>
          )}
        </header>
        <div className="aside-layout">
          <div className="content content-dark">
            <form>
              <fieldset>
                <TextField
                  label="Name"
                  type="text"
                  id="generalName"
                  name="Name"
                  value={general.Name}
                  emptyValue="First Name"
                  required={true}
                  changeFunction={handleChange}
                />
                <TextField
                  label="Emoji"
                  type="text"
                  id="armyEmoji"
                  name="Emoji"
                  value={general.Emoji}
                  emptyValue="General Emoji: Windows Key + ."
                  required={false}
                  changeFunction={handleChange}
                />
                <TextField
                  label="Nicknames"
                  type="text"
                  id="generalNicknames"
                  name="Nicknames"
                  value={general.Nicknames}
                  emptyValue="Nicknames: Comma separated, e.g. Example1,Example2"
                  required={false}
                  changeFunction={handleChange}
                />
                <TextAreaField
                  label="Bio"
                  id="armyBio"
                  name="Bio"
                  emptyValue="Army biography."
                  value={general.Bio}
                  changeFunction={handleChange}
                />
              </fieldset>

              {general.isEdit ? (
                <>
                  <button
                    className="button button-center button-large"
                    type="submit"
                    onClick={(e) => handleUpdateGeneral(e)}
                  >
                    Update {general.Name}
                  </button>
                </>
              ) : (
                <button
                  className="button button-center button-large"
                  type="submit"
                  onClick={(e) => handleAddGeneral(e)}
                >
                  Add General
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

export default GeneralForm;
