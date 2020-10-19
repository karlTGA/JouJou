import { Readable } from "stream";

export default interface File {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}
