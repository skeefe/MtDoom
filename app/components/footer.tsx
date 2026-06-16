"use client";

import Link from "next/link";
import Container from "./container";
import SelectField from "./select-field";
import { editions } from "../../data/editions";
import { useEdition } from "../context/EditionContext";

const Footer = () => {
  const { selectedEdition, setSelectedEdition } = useEdition();

  return (
    <footer className="primary-footer">
      <Container>
        <div className="top">
        <Link href="/" className="logo-link">
          <span className="logo">Mt. Doom &#x1F30B;</span>
        </Link>

        <div className="hide-lg">
          <SelectField
            id="edition-filter-mobile"
            name="edition-filter-mobile"
            value={selectedEdition}
            emptyValue=""
            hideEmpty={true}
            options={[
              { Label: "All Editions", Value: "all", Active: true },
              ...[...editions].filter((e) => e.Active).reverse(),
            ]}
            changeFunction={(e) => setSelectedEdition(e.target.value)}
          />
        </div>
        </div>

        <span className="copyright">&copy; Skeefe.net 2026</span>
      </Container>
    </footer>
  );
};

export default Footer;