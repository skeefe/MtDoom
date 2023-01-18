import { AppProps } from 'next/app'
import Script from 'next/script'
import '../styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=UA-101599729-1"/>
      <Script
          id='google-analytics'
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-101599729-1');
            `,
            }}
        />
      <Component {...pageProps} />
    </>)
}
