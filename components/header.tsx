import React, { useState } from "react";
import Container from "./container";

const Header = () => {
  return (
    <header className="bg-slate-800 py-1 fixed w-full z-10 top-0">
      <Container>
        <a href="/" className="no-underline">
          <h2 className="text-xl m-0 float-left font-bold font-logo text-slate-500">
            Mt. Doom  &#x1F30B;
          </h2>
        </a>
      </Container>
    </header>
  );
};

export default Header;
