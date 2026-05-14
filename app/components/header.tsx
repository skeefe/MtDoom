"use client";

import React from "react";
import Container from "./container";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SelectField from "./select-field";
import { editions } from "../../data/editions";
import { useEdition } from "../context/EditionContext";

const Header = () => {
  const pathname = usePathname();
  const { selectedEdition, setSelectedEdition } = useEdition();

  return (
    <header className="primary-header">
      <Container>
        <Link href="/" className="logo-link">
          <span className="logo">Mt. Doom &#x1F30B;</span>
        </Link>
        <nav className="primary-nav">
          <ul>
            <li>
              <Link href="/" className={pathname === "/" ? "active-nav" : ""}>
                Battles
              </Link>
            </li>
            <li>
              <Link href="/armies" className={pathname === "/armies" ? "active-nav" : ""}>
                Armies
              </Link>
            </li>
            <li>
              <Link href="/generals" className={pathname === "/generals" ? "active-nav" : ""}>
                Generals
              </Link>
            </li>
            <li className="hide show-sm-inline">
              <Link href="/meta" className={pathname === "/meta" ? "active-nav" : ""}>
                Meta{" "}
                <span className="beta">(BETA)</span>
              </Link>
            </li>
            <li className="hide show-sm-inline">
              <SelectField
                id="edition-filter"
                name="edition-filter"
                value={selectedEdition}
                emptyValue=""
                hideEmpty={true}
                options={[
                  { Label: "All Editions", Value: "all", Active: true },
                  ...[...editions].filter((e) => e.Active).reverse(),
                ]}
                changeFunction={(e) => setSelectedEdition(e.target.value)}
              />
            </li>
          </ul>
        </nav>



      </Container>
    </header>
  );
};

export default Header;