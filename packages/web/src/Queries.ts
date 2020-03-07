import { gql } from 'apollo-boost';

export const GET_ENTRIES = gql`
  query Entries {
    entries {
      title
      date
      content
    }
  }
`;
