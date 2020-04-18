import db from "./db";
import Entry from "./types/entry";

export default {
  Query: {
    getEntries: async () => await db.getEntries(),
  },
  Mutation: {
    updateEntry: async (
      parent: any,
      { entryId, newEntry }: { entryId: number | null; newEntry: Entry }
    ) => {
      console.log("Got request");
      console.log(entryId);
      console.log(newEntry);

      if (entryId == null) {
        return db.insertEntry(newEntry);
      }

      return db.updateEntry(entryId, newEntry);
    },
  },
};
