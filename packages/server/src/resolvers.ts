import db from "./db";
import Entry from "./types/entry";

export default {
  Query: {
    getEntries: async () => await db.getEntries(),
    getEntry: async (parent: any, { entryId }: { entryId: number }) =>
      await db.getEntry(entryId),
  },
  Mutation: {
    updateEntry: async (
      parent: any,
      { entryId, newEntry }: { entryId: number | null; newEntry: Entry }
    ) => {
      if (entryId == null) {
        return db.insertEntry(newEntry);
      }

      return db.updateEntry(entryId, newEntry);
    },
    removeEntry: async (parent: any, { entryId }: { entryId: number }) => {
      if (entryId == null) return false;
      await db.removeEntry(entryId);
    },
  },
};
