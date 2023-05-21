import Head from "next/head";

import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";

import { useApollo } from "utils/useApollo";

import "../styles/globals.scss";

function NextHouseControlApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={client}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <SessionProvider session={pageProps.initialSession}>
        <Component {...pageProps} />
      </SessionProvider>
    </ApolloProvider>
  );
}

export default NextHouseControlApp;
