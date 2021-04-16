import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

import S3 from "aws-sdk/clients/s3";
import process from "process";

const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const accessKeyId = process.env.ACCESS_KEY_ID;

if (secretAccessKey == null || accessKeyId == null)
  throw Error("Missing aws credentials!");

const s3Client = new S3({
  apiVersion: "2006-03-01",
  region: "eu-central-1",
  credentials: { secretAccessKey, accessKeyId },
});

export default s3Client;
