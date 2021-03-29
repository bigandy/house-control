import { Fragment } from "react";
import Head from "next/head";

import "../styles/globals.scss";

function NextHouseControlApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </Fragment>
  );
}

export default NextHouseControlApp;
