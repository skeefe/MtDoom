"use client";

import React from "react";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import MetaDashboard from "../components/meta-dashboard";
import Spinner from "../components/spinner";
import { useEdition } from "../context/EditionContext";

const MetaPage = () => {
  const { selectedEdition } = useEdition();
  const filterShow = (item: any) => item.Show !== false;

  const allBattles = getCollectionSnapshot("Battles").filter(filterShow);

  // Still loading
  if (allBattles.length === 0) return <Spinner />;

  const battleCollection = allBattles.filter((b) =>
    selectedEdition === "all" || b.Edition === parseInt(selectedEdition)
  );

  // No battles for this edition
  if (battleCollection.length === 0) {
    return (
      <main className="container">
        <p className="error">No Battle Data for this edition yet.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <MetaDashboard battles={battleCollection} />
    </main>
  );
};

export default MetaPage;