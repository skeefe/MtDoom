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
              <Link href="/">Battles</Link>
            </li>
            <li>
              <Link href="/armies">Armies</Link>
            </li>
            <li>
              <Link href="/generals">Generals</Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
