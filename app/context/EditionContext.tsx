"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import getDocSnapshot from "../firebase/getDocSnapshot";

interface EditionContextType {
  selectedEdition: string;
  setSelectedEdition: (edition: string) => void;
}

const EditionContext = createContext<EditionContextType>({
  selectedEdition: "all",
  setSelectedEdition: () => {},
});

export const useEdition = () => useContext(EditionContext);

export const EditionProvider = ({ children }: { children: React.ReactNode }) => {
  const appConfig = getDocSnapshot("Settings", "appConfig") as { defaultEdition: number } | null;
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null);

  useEffect(() => {
    if (appConfig?.defaultEdition && selectedEdition === null) {
      setSelectedEdition(String(appConfig.defaultEdition));
    }
  }, [appConfig]);

  if (selectedEdition === null) return null;

  return (
    <EditionContext.Provider value={{ selectedEdition, setSelectedEdition }}>
      {children}
    </EditionContext.Provider>
  );
};