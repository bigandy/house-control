import Head from "next/head";

import { Provider } from "next-auth/client";

import "../styles/globals.scss";

function NextHouseControlApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Provider session={pageProps.initialSession}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default NextHouseControlApp;
