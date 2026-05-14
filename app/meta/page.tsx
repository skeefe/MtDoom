"use client";
 
import React from "react";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import MetaDashboard from "../components/meta-dashboard";
import Spinner from "../components/spinner";
import { useEdition } from "../context/EditionContext";
 
const MetaPage = () => {
  const { selectedEdition } = useEdition();
  const filterShow = (item: any) => item.Show !== false;
 
  const battleCollection = getCollectionSnapshot("Battles")
    .filter(filterShow)
    .filter((b) => selectedEdition === "all" || b.Edition === parseInt(selectedEdition));
 
  if (!battleCollection) return <Spinner />;
 
  return (
    <main className="container">
      <MetaDashboard battles={battleCollection} />
    </main>
  );
};
 
export default MetaPage;
 