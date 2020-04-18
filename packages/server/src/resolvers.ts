import db from "./db";
import Entry from "./types/entry";

export default {
  Query: {
    getEntries: async () => await db.getEntries(),
  },
  Mutation: {
    updateEntry: async (entry_id: number | null, newEntry: Entry) => {
      if (entry_id == null) {
        return db.insertEntry(newEntry);
      }

      return db.updateEntry(entry_id, newEntry);
    },
  },
};
