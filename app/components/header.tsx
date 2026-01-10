"use client";

import React from "react";
import Container from "./container";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="primary-header">
      <Container>
        <Link href="/" className="logo-link">
          <span className="logo">Mt. Doom &#x1F30B;</span>
        </Link>
        <nav className="primary-nav">
          <ul>
            <li>
              <Link
                href="/"
                className={pathname === "/" ? "active-nav" : ""}
              >
                Battles
              </Link>
            </li>
            <li>
              <Link
                href="/armies"
                className={pathname === "/armies" ? "active-nav" : ""}
              >
                Armies
              </Link>
            </li>
            <li>
              <Link
                href="/generals"
                className={pathname === "/generals" ? "active-nav" : ""}
              >
                Generals
              </Link>
            </li>
            <li>
              <Link
                href="/meta"
                className={pathname === "/meta" ? "active-nav" : ""}
              >
                Meta
                <span className="beta">(BETA)</span>
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;




