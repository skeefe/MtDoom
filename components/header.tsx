import React, { useState } from "react";
import Container from "./container";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-slate-800 py-1 fixed w-full z-10 top-0">
      <Container>
        <a href="/" className="no-underline">
          <h2 className="text-xl m-0 float-left font-bold font-logo text-slate-200">
            Mt. Doom &#x1F30B;
          </h2>
        </a>
        <nav className="float-right">
          <ul className="flex">
          ``<li><Link href="/" className="text-slate-300 hover:text-white no-underline transition-colors transition duration-300 ease-in-out font-logo ml-8">Battles</Link></li>
            <li><Link href="/armies" className="text-slate-300 hover:text-white no-underline transition-colors transition duration-300 ease-in-out font-logo ml-8">Armies</Link></li>
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
