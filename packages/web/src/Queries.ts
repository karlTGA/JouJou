import { gql } from "apollo-boost";

// things i learned. It is important to use the same name
// for inputs like the server. no plan why.

export const GET_ENTRIES = gql`
  query entries {
    getEntries {
      entryId: entry_id
      title
      date
      content
    }
  }
`;

export const UPDATE_ENTRY = gql`
  mutation updateEntry($entryId: Int, $newEntry: EntryInput) {
    updateEntry(entryId: $entryId, newEntry: $newEntry) {
      title
    }
  }
`;
