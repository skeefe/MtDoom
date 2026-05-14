import Script from "next/script";
import Header from "./components/header";
import Footer from "./components/footer";
import Container from "./components/container";
import { EditionProvider } from "./context/EditionContext";
import "../styles/global.css";

export const metadata = {
  title: "Mt. Doom",
  description:
    "Here lie the records of the finest generals in Mt. Doom. Get excited!!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-T6MY0YKMNK"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T6MY0YKMNK');
            `,
          }}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body>
        <EditionProvider>
          <Header />

          <main className="primary-content">
            <Container>
              {children}
            </Container>
          </main>
          <Footer />
        </EditionProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}