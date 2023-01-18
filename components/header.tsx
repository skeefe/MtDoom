import React, { useState } from "react";
import Container from "./container";

const Header = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <header className="bg-gray-300 py-1 fixed w-full z-10 top-0">
      <Container>
        <a href="#home" className="no-underline">
          <h2 className="text-xl m-0 float-left font-bold font-logo">
            Skeefe.net
          </h2>
        </a>

        <label
          htmlFor="menu-toggle"
          className="cursor-pointer lg:hidden block float-right mt-1"
          onClick={() => setIsChecked(!isChecked)}
        >
          <svg
            className="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </label>
        <input
          className="hidden"
          type="checkbox"
          id="menu-toggle"
          checked={isChecked}
          readOnly={true}
        />
        <div
          className="hidden lg:flex lg:items-center lg:w-auto w-full"
          id="menu"
        >
          <nav className="md:text-right w-full">
            <ul className="clear-both md:clear-none pt-4 md:pt-0">
              <li className="block md:inline-block">
                <a
                  href="#home"
                  className="block md:inline py-2 md:py-2 md:px-3 text-sm font-semibold uppercase no-underline"
                  onClick={() => setIsChecked(!isChecked)}
                >
                  Home
                </a>
              </li>
              <li className="hidden md:block md:inline-block border-t border-gray-400 md:border-t-0">
                <a
                  href="#projects"
                  className="block md:inline py-2 md:py-2 md:px-3 text-sm font-semibold uppercase no-underline"
                  onClick={() => setIsChecked(!isChecked)}
                >
                  Projects
                </a>
              </li>
              <li className="block md:inline-block border-t border-gray-400 md:border-t-0">
                <a
                  href="#skillset"
                  className="block md:inline py-2 md:py-2 md:px-3 text-sm font-semibold uppercase no-underline"
                  onClick={() => setIsChecked(!isChecked)}
                >
                  Skillset
                </a>
              </li>
              <li className="block md:inline-block border-t border-gray-400 md:border-t-0">
                <a
                  href="#experience"
                  className="block md:inline py-2 md:py-2 md:px-3 text-sm font-semibold uppercase no-underline"
                  onClick={() => setIsChecked(!isChecked)}
                >
                  Experience
                </a>
              </li>
              <li className="block md:inline-block border-t border-gray-400 md:border-t-0">
                <a
                  href="#education"
                  className="block md:inline py-2 md:py-2 md:px-3 text-sm font-semibold uppercase no-underline"
                  onClick={() => setIsChecked(!isChecked)}
                >
                  Education
                </a>
              </li>
              <li className="block md:inline-block border-t border-gray-400 md:border-t-0">
                <a
                  href="#contact"
                  className="block md:inline py-2 md:py-2 md:px-3 text-sm font-semibold uppercase no-underline"
                  onClick={() => setIsChecked(!isChecked)}
                >
                  Contact
                </a>
              </li>
              <li className="block md:hidden md:inline-block border-t border-gray-400 md:border-t-0">
                <a
                  href="#projects"
                  className="block md:inline py-2 md:py-2 md:px-3 text-sm font-semibold uppercase no-underline"
                  onClick={() => setIsChecked(!isChecked)}
                >
                  Projects
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;
