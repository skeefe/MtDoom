import Script from "next/script";
import Header from "./components/header";
import Footer from "./components/footer";
import Container from "../components/container";
import "../styles/global.css";

export const metadata = {
  title: "Mt. Doom",
  description: "",
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
      </head>
      <body>
        <Header />
        <main className="primary-content">
          <Container>{children}</Container>
        </main>
        <Footer />
      </body>
    </html>
  );
}
