"use client";

import Link from "next/link";

const resources = [
  {
    emoji: "💊",
    name: "Force Disposition Matrix",
    description: "Cross-reference dispositions to find each player's primary mission.",
    href: "/resources/force-disposition-matrix",
  },
  {
    emoji: "🧮",
    name: "MathHammer",
    description: "Calculate attack probabilities and expected wounds.",
    href: "/resources/mathhammer",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <header className="section-header">
        <h1>Resources</h1>
      </header>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
        gap: "1.5rem",
      }}>
        {resources.map((resource) => (
          <Link
            key={resource.href}
            href={resource.href}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              background: "var(--color-bg-dark)",
              borderRadius: "0.5rem",
              padding: "2rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              textAlign: "center",
              transition: "background 0.2s ease",
              cursor: "pointer",
              height: "100%",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bg-darker)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-bg-dark)")}
            >
              <span style={{ fontSize: "3rem", lineHeight: 1 }}>{resource.emoji}</span>
              <span style={{
                color: "var(--color-text-primary)",
                fontFamily: "Aleo, sans-serif",
                fontSize: "1.1rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                {resource.name}
              </span>
              <span style={{
                color: "var(--color-text-secondary)",
                fontSize: "0.875rem",
                lineHeight: 1.5,
              }}>
                {resource.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}