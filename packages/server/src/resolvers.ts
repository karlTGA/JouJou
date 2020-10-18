import { GraphQLUpload } from "graphql-upload";
import db from "./db";
import Entry from "./types/entry";
import File from "./types/file";

export default {
  Upload: GraphQLUpload,
  Query: {
    getEntries: async () => await db.getEntries(),
    getEntry: async (parent: any, { entryId }: { entryId: number }) =>
      await db.getEntry(entryId),
    uploads: (parent: any, args: any) => {
      console.log("upload");
    },
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

      return true;
    },
    imageUpload: (parent: any, args: any) => {
      return args.file.then((file: File) => {
        console.log(file);
        //Contents of Upload scalar: https://github.com/jaydenseric/graphql-upload#class-graphqlupload
        //file.createReadStream() is a readable node stream that contains the contents of the uploaded file
        //node stream api: https://nodejs.org/api/stream.html
        return file;
      });
    },
  },
};
