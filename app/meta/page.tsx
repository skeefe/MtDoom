"use client";

import React from "react";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import MetaDashboard from "../components/meta-dashboard";
import Spinner from "../components/spinner";

const MetaPage = () => {
  const filterShow = (item: any) => item.Show !== false;
  
  // Use your existing snapshot hook to get the raw battle data
  const battleCollection = getCollectionSnapshot("Battles").filter(filterShow);

  if (!battleCollection) return <Spinner />;

  return (
    <main className="container">
      <MetaDashboard battles={battleCollection} />
    </main>
  );
};

export default MetaPage;