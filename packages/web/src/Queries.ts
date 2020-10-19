import { gql } from "@apollo/client";

// things i learned. It is important to use the same name
// for inputs like the server. no plan why.

export const GET_ENTRIES = gql`
  query entries {
    getEntries {
      id: entry_id
      title
      date
      content
    }
  }
`;

export const GET_ENTRY = gql`
  query entry($id: Int!) {
    getEntry(id: $id) {
      id: entry_id
      title
      date
      content
      isPublic
      location
    }
  }
`;

export const GET_IMAGE_URL = gql`
  query imageUrl($key: String!) {
    getImageUrl(key: $key) {
      url
    }
  }
`;

export const UPDATE_ENTRY = gql`
  mutation updateEntry($entryId: Int, $newEntry: EntryInput) {
    updateEntry(entryId: $entryId, newEntry: $newEntry) {
      id: entry_id
      title
      date
      content
      isPublic
      location
    }
  }
`;

export const REMOVE_ENTRY = gql`
  mutation removeEntry($entryId: Int) {
    removeEntry(entryId: $entryId)
  }
`;
