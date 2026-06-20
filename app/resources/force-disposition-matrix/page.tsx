"use client";

import React, { useState } from "react";
import MissionCardModal from "../../components/mission-card-modal";
import {
  dispositions,
  dispositionMatrix,
  getMissionImages,
  type ForceDisposition,
} from "../../../data/primary-missions-11";

type SelectedMission = {
  name: string;
  yourDisposition: ForceDisposition;
  opponentDisposition: ForceDisposition;
};

export default function MatrixPage() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [selected, setSelected] = useState<SelectedMission | null>(null);

  const handleCellClick = (
    missionName: string,
    yourDisposition: ForceDisposition,
    opponentDisposition: ForceDisposition
  ) => {
    setSelected({ name: missionName, yourDisposition, opponentDisposition });
  };

  const handleCellHover = (
    rowIdx: number,
    colIdx: number,
    yourDisposition: ForceDisposition,
    oppDisposition: ForceDisposition
  ) => {
    setHoveredRow(rowIdx);
    setHoveredCol(colIdx);
    const missionName = dispositionMatrix[yourDisposition][oppDisposition];
    const imgs = getMissionImages(missionName, yourDisposition);
    const preloadFront = new window.Image();
    preloadFront.src = imgs.front;
    if (imgs.back) {
      const preloadBack = new window.Image();
      preloadBack.src = imgs.back;
    }
  };

  return (
    <>
      <header className="section-header">
        <h1>Force Disposition Matrix</h1>
      </header>

      <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
        Cross-reference your Force Disposition (rows) against your opponent's (columns) to find each player's Primary Mission. Click any cell to view the mission card.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: "44rem" }}>
          <thead>
            <tr>
              <th style={{
                padding: "1rem 1.25rem",
                background: "var(--color-bg-darker)",
                borderRadius: "0.5rem 0 0 0",
              }}>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  You ↓ / Opp →
                </span>
              </th>
              {dispositions.map((opp, colIdx) => (
                <th key={opp} style={{
                  padding: "1rem 0.75rem",
                  background: hoveredCol === colIdx ? "var(--color-primary)" : "var(--color-bg-dark)",
                  color: hoveredCol === colIdx ? "#fff" : "var(--color-text-primary)",
                  fontSize: "0.875rem",
                  fontFamily: "Aleo, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                  transition: "background 0.15s ease, color 0.15s ease",
                  whiteSpace: "nowrap",
                }}>
                  {opp}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dispositions.map((yourDisp, rowIdx) => (
              <tr key={yourDisp}>
                <th style={{
                  padding: "2rem 1.25rem",
                  background: hoveredRow === rowIdx ? "var(--color-primary)" : "var(--color-bg-dark)",
                  color: hoveredRow === rowIdx ? "#fff" : "var(--color-text-primary)",
                  fontSize: "0.875rem",
                  fontFamily: "Aleo, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s ease, color 0.15s ease",
                }}>
                  {yourDisp}
                </th>
                {dispositions.map((oppDisp, colIdx) => {
                  const missionName = dispositionMatrix[yourDisp][oppDisp];
                  const isMirror = yourDisp === oppDisp;
                  const isHighlighted = hoveredRow === rowIdx || hoveredCol === colIdx;
                  const isFocused = hoveredRow === rowIdx && hoveredCol === colIdx;

                  return (
                    <td
                      key={oppDisp}
                      onClick={() => handleCellClick(missionName, yourDisp, oppDisp)}
                      onMouseEnter={() => handleCellHover(rowIdx, colIdx, yourDisp, oppDisp)}
                      onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null); }}
                      style={{
                        padding: "2rem 0.75rem",
                        background: isFocused ? "var(--color-primary)" : isHighlighted ? "var(--color-accent-subtle)" : "var(--color-accent-light)",
                        borderTop: "1px solid var(--color-bg-dark)",
                        borderLeft: "1px solid var(--color-bg-dark)",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "background 0.15s ease",
                      }}
                    >
                      <span style={{
                        display: "block",
                        fontSize: "0.95rem",
                        fontWeight: "bold",
                        color: isFocused ? "#fff" : "var(--color-text-primary)",
                        transition: "color 0.15s ease",
                      }}>
                        {missionName}
                      </span>
                      {isMirror && (
                        <span style={{
                          display: "block",
                          fontSize: "0.7rem",
                          color: isFocused ? "rgba(255,255,255,0.7)" : "var(--color-text-muted)",
                          marginTop: "0.25rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}>
                          Mirror
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <MissionCardModal
          missionName={selected.name}
          disposition={selected.yourDisposition}
          opponentDisposition={selected.opponentDisposition}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}