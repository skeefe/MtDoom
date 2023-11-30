import React, { useState } from "react";
import Container from "./container";
import Link from "next/link";

const Header = () => {
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
                className="text-slate-300 hover:text-white no-underline transition-colors transition duration-300 ease-in-out font-logo ml-8"
              >
                Battles
              </Link>
            </li>
            <li>
              <Link
                href="/armies"
                className="text-slate-300 hover:text-white no-underline transition-colors transition duration-300 ease-in-out font-logo ml-8"
              >
                Armies
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
