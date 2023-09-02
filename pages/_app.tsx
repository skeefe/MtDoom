import { AppProps } from "next/app";
import Script from "next/script";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google tag (gtag.js) */}
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
      <Component {...pageProps} />
    </>
  );
}
