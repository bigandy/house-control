import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useMemo } from "react";
const { HttpLink } = require("@apollo/client/link/http");

let apolloClient;

function createApolloClient() {
  const link = new HttpLink({ uri: "/api/graphql" });
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link,
    cache: new InMemoryCache(),
  });
}

export function initializeApollo() {
  const _apolloClient = apolloClient ? apolloClient : createApolloClient();
  apolloClient = _apolloClient;
  return apolloClient;
}

export function useApollo(initialState) {
  const client = useMemo(() => {
    return initializeApollo();
  }, [initialState]);
  return client;
}
