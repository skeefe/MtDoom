import Link from "next/link";
import Container from "./container";

const Footer = () => {
  return (
    <footer className="primary-footer">
      <Container>
        <Link href="/" className="logo-link">
          <span className="logo">Mt. Doom &#x1F30B;</span>
        </Link>
        <span className="copyright">&copy; Skeefe.net 2024</span>
      </Container>
    </footer>
  );
};

export default Footer;
