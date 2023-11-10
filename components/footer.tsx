import Container from "./container";

const Footer = () => {
  return (
    <footer className="bg-slate-800 py-5 mt-12 text-slate-500">
      <Container>
        <div className="justify-between flex flex-col lg:flex-row items-center">
          <a href="#home" className="no-underline">
            <h3 className="text-lg font-bold text-center lg:text-left mb-2 sm:mb-0 text-slate-500">
              Mt. Doom &#x1F30B;
            </h3>
          </a>
        </div>
        <span className="text-sm block lg:inline text-center">
          &copy; Skeefe.net 2023
        </span>
      </Container>
    </footer>
  );
};

export default Footer;
