"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Spinner from "../../components/spinner";
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
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);

  const handleCellClick = (
    missionName: string,
    yourDisposition: ForceDisposition,
    opponentDisposition: ForceDisposition
  ) => {
    setFrontLoaded(false);
    setBackLoaded(false);
    setSelected({ name: missionName, yourDisposition, opponentDisposition });
  };

  const handleClose = () => setSelected(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const images = selected
    ? getMissionImages(selected.name, selected.yourDisposition)
    : null;

  const bothLoaded = images?.back ? frontLoaded && backLoaded : frontLoaded;

  return (
    <>
      <header className="section-header">
        <h1>Force Disposition Matrix</h1>
      </header>

      <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
        Cross-reference your Force Disposition (rows) against your opponent's (columns) to find each player's Primary Mission. Click any cell to view the mission card.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{
          borderCollapse: "collapse",
          width: "100%",
          minWidth: "44rem",
        }}>
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
                <th
                  key={opp}
                  style={{
                    padding: "2rem 0.75rem",
                    background: hoveredCol === colIdx
                      ? "var(--color-primary)"
                      : "var(--color-bg-dark)",
                    color: hoveredCol === colIdx
                      ? "#fff"
                      : "var(--color-text-primary)",
                    fontSize: "0.875rem",
                    fontFamily: "Aleo, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    textAlign: "center",
                    transition: "background 0.15s ease, color 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                >
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
                  background: hoveredRow === rowIdx
                    ? "var(--color-primary)"
                    : "var(--color-bg-dark)",
                  color: hoveredRow === rowIdx
                    ? "#fff"
                    : "var(--color-text-primary)",
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
                        background: isFocused
                          ? "var(--color-primary)"
                          : isHighlighted
                          ? "var(--color-accent-subtle)"
                          : "var(--color-accent-light)",
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

      {/* Modal */}
      {selected && images && (
        <div className="modal-overlay" onClick={handleClose}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--color-bg-dark)",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              width: "calc(100vw - 3rem)",
              maxWidth: images.back ? "72rem" : "36rem",
              maxHeight: "calc(100vh - 3rem)",
              overflowY: "auto",
              zIndex: 20,
            }}
          >
            {/* Modal header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{selected.name}</h2>
                <small style={{ color: "var(--color-text-secondary)" }}>
                  {selected.yourDisposition} vs {selected.opponentDisposition}
                  {selected.yourDisposition === selected.opponentDisposition ? " — Mirror" : ""}
                </small>
              </div>
              <button
                onClick={handleClose}
                className="button button-secondary"
                style={{ padding: "0.25rem 0.75rem", fontSize: "1rem", flexShrink: 0, marginLeft: "1rem" }}
              >
                ✕
              </button>
            </div>

            {/* Spinner while images load */}
            {!bothLoaded && <Spinner size="small" />}

            {/* Card images */}
            <div style={{
              display: "grid",
              gridTemplateColumns: images.back ? "1fr 1fr" : "1fr",
              gap: "1rem",
              visibility: bothLoaded ? "visible" : "hidden",
              height: bothLoaded ? "auto" : 0,
              overflow: "hidden",
            }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "420 / 740" }}>
                <Image
                  src={images.front}
                  alt={`${selected.name} — front`}
                  fill
                  style={{ objectFit: "contain", borderRadius: "0.35rem" }}
                  onLoad={() => setFrontLoaded(true)}
                />
              </div>
              {images.back && (
                <div style={{ position: "relative", width: "100%", aspectRatio: "420 / 740" }}>
                  <Image
                    src={images.back}
                    alt={`${selected.name} — back`}
                    fill
                    style={{ objectFit: "contain", borderRadius: "0.35rem" }}
                    onLoad={() => setBackLoaded(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}