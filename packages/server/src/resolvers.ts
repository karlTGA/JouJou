import { GraphQLUpload } from "graphql-upload";
import db from "./db";
import Entry from "./types/entry";
import File from "./types/file";
import s3Client from "./s3";
import { v4 as uuid } from "uuid";

const uploadToS3 = async (file: File) => {
  const request = s3Client.upload({
    Bucket: "joujou-images",
    ContentType: file.mimetype,
    ContentEncoding: file.encoding,
    Key: uuid(),
    ServerSideEncryption: "AES256",
    Body: file.createReadStream(),
  });

  return request.promise();
};

export default {
  Upload: GraphQLUpload,
  Query: {
    getEntries: async () => await db.getEntries(),
    getEntry: async (parent: any, { id }: { id: number }) =>
      await db.getEntry(id),
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
    imageUpload: async (parent: any, args: any) => {
      try {
        const file: File = await args.file;
        const res = await uploadToS3(file);

        return {
          ...file,
          key: res.Key,
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    },
  },
};
