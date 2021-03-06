import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import * as React from "react";
import { render } from "react-dom";
import { createUploadLink } from "apollo-upload-client";

import "antd/dist/antd.css";
import "react-vertical-timeline-component/style.min.css";
import "./styles/main.scss";

import App from "./App";

const LOCAL = window.location.origin === "http://localhost:3000";
const GRAPHQL_API_URL = !LOCAL
  ? `${window.location.origin}/graphql`
  : "http://localhost:8080/graphql";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: GRAPHQL_API_URL,
  }),
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
