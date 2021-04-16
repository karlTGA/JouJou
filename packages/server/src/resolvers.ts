import { GraphQLUpload } from "graphql-upload";
import db from "./db";
import Entry from "./types/entry";
import File from "./types/file";
import s3Client from "./s3";
import { importImage } from "./images";

const getSignedUrl = async (key: string) => {
  return s3Client.getSignedUrlPromise("getObject", {
    Bucket: "joujou-images",
    Key: key,
    Expires: 60,
  });
};

export default {
  Upload: GraphQLUpload,
  Query: {
    getEntries: async () => await db.getEntries(),
    getEntry: async (parent: any, { id }: { id: number }) =>
      await db.getEntry(id),
    getImageUrls: async (parent: any, { keys }: { keys: Array<string> }) => {
      return { urls: Promise.all(keys.map(key => getSignedUrl(key))) };
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
    imageUpload: async (parent: any, args: any) => {
      try {
        const file: File = await args.file;
        const entryId: string = await args.entryId
        const res = await importImage(file);
        const image = await db.insertImage(res, parseInt(entryId))

        console.log(image)
        return image;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
  },
};
