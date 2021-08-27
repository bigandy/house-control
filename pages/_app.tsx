import Head from "next/head";

import { Provider } from "next-auth/client";
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
      <Provider session={pageProps.initialSession}>
        <Component {...pageProps} />
      </Provider>
    </ApolloProvider>
  );
}

export default NextHouseControlApp;
