"use client";
import React, { useEffect, useState } from "react";
import {
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import firebase_app from "../../firebase/config"; // Adjusted path to match your structure
import Spinner from "../../components/spinner";

import SelectField from "../../components/select-field";
import { editions } from "../../../data/editions";

const AdminConfig = () => {
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    defaultEdition: 10,
  });

  // Retrieve Global Config
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Settings", "appConfig"), (doc) => {
      if (doc.exists()) {
        setConfig((prev) => ({ ...prev, ...doc.data() }));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  // Handle Change & Sync to Firestore
  const handleEditionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    // 1. Force convert to Number. If it's empty, default to 10.
    const newValue = parseInt(e.target.value, 10) || 10;

    // 2. Update Local State immediately for UI snappiness
    setConfig((prev) => ({ ...prev, defaultEdition: newValue }));

    // 3. Update Firestore
    try {
      const configRef = doc(db, "Settings", "appConfig");
      await updateDoc(configRef, {
        defaultEdition: newValue,
        lastUpdated: serverTimestamp(),
      });
      console.log("Config synced to Firestore:", newValue);
    } catch (error) {
      console.error("Error updating configuration:", error);
      alert("Failed to save config. Check your permissions.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <section className="section configuration">

      <header className="section-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap', // Allows wrapping if the title is long
        gap: '1rem'
      }}>
        <h2>Site Configuration</h2>

        <button
          className="button"
          onClick={() => router.push("/")}
        >
          Return to Battles
        </button>
      </header>

      <div className="aside-layout">
        <div className="content content-dark">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <h2 className="label">Default Game Edition</h2>
              

            <SelectField
                  label="Set the default edition for all new battles created.
                This can still be overridden manually on the battle form."
                  required={true}
                  id="defaultEdition"
                  name="defaultEdition"
                  changeFunction={handleEditionChange}
                  value={config.defaultEdition.toString()}
                  options={editions}
                  emptyValue="Select the Default Edition"
                />

            </div>
          </form>
        </div>

        <aside>
          <div className="content content-dark content-sticky">
            <h2>System Status</h2>
            <div>
              <p>Current Default: <strong>{config.defaultEdition}th Edition</strong></p>
            </div>
          </div>
        </aside>
      </div>

      <p className="instruction">Changes are saved automatically and applied to all new records.</p>
    </section >
  );
};

export default AdminConfig;