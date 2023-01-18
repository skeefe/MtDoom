import Container from "./container";
import { EXAMPLE_PATH } from "../lib/constants";

const Footer = () => {
  return (
    <footer className="bg-gray-300 py-5 mt-12">
      <Container>
        <div className="justify-between flex flex-col lg:flex-row items-center">
          <a href="#home" className="no-underline">
            <h3 className="text-lg font-bold text-center lg:text-left mb-2 sm:mb-0">
              Simon Keefe - Digital Product Management
            </h3>
          </a>
          <nav>
            <ul className="text-center sm:text-left mb-4">
              <li className="inline-block">
                <a
                  href="#home"
                  className="py-2 px-3 text-sm uppercase no-underline"
                >
                  Home
                </a>
              </li>
              <li className="inline-block">
                <a
                  href="#skillset"
                  className="py-2 px-3 text-sm uppercase no-underline"
                >
                  Skillset
                </a>
              </li>
              <li className="inline-block">
                <a
                  href="#experience"
                  className="py-2 px-3 text-sm uppercase no-underline"
                >
                  Experience
                </a>
              </li>
              <li className="inline-block">
                <a
                  href="#education"
                  className="py-2 px-3 text-sm uppercase no-underline"
                >
                  Education
                </a>
              </li>
              <li className="inline-block">
                <a
                  href="#projects"
                  className="py-2 px-3 text-sm uppercase no-underline"
                >
                  Projects
                </a>
              </li>
              <li className="inline-block">
                <a
                  href="#contact"
                  className="py-2 px-3 text-sm uppercase no-underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <span className="text-sm block lg:inline text-center">&copy; Skeefe.net 2023</span>
      </Container>
    </footer>
  );
};

export default Footer;
