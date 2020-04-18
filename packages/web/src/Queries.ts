import { gql } from "apollo-boost";

export const GET_ENTRIES = gql`
  query entries {
    getEntries {
      title
      date
      content
    }
  }
`;

export const UPDATE_ENTRY = gql`
  mutation updateEntry {
    updateEntry {
      title
    }
  }
`;
