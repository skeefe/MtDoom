"use client";

import React, { useState, useEffect } from "react";
import Spinner from "./spinner";
import { getMissionImages, type ForceDisposition } from "../../data/primary-missions-11";

const MissionCardModal = (props: {
  missionName: string;
  disposition: ForceDisposition;
  opponentDisposition?: ForceDisposition;
  onClose: () => void;
}) => {
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);

  const images = getMissionImages(props.missionName, props.disposition);
  const bothLoaded = images.back ? frontLoaded && backLoaded : frontLoaded;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [props.onClose]);

  return (
    <div className="modal-overlay" onClick={props.onClose}>
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
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{props.missionName}</h2>
            {props.opponentDisposition && (
              <small style={{ color: "var(--color-text-secondary)" }}>
                {props.disposition} vs {props.opponentDisposition}
                {props.disposition === props.opponentDisposition ? " — Mirror" : ""}
              </small>
            )}
          </div>
          <button
            onClick={props.onClose}
            className="button button-secondary"
            style={{ padding: "0.25rem 0.75rem", fontSize: "1rem", flexShrink: 0, marginLeft: "1rem" }}
          >
            ✕
          </button>
        </div>

        {/* Spinner */}
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
          <img
            src={images.front}
            alt={`${props.missionName} — front`}
            style={{ width: "100%", height: "auto", borderRadius: "0.35rem", display: "block" }}
            onLoad={() => setFrontLoaded(true)}
          />
          {images.back && (
            <img
              src={images.back}
              alt={`${props.missionName} — back`}
              style={{ width: "100%", height: "auto", borderRadius: "0.35rem", display: "block" }}
              onLoad={() => setBackLoaded(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionCardModal;