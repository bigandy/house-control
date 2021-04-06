import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { useMemo } from "react";

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createIsomorphicLink(req = null) {
  if (typeof window === "undefined" && req) {
    const { SchemaLink } = require("@apollo/client/link/schema");
    const { schema } = require("utils/database/schema");
    const { createContext } = require("utils/database/context");
    return new SchemaLink({ schema, context: createContext({ req }) });
  } else {
    const { HttpLink } = require("@apollo/client/link/http");
    return new HttpLink({ uri: "/api/graphql" });
  }
}

function createApolloClient(req = null) {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createIsomorphicLink(req),
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
