import path from 'path'
import { promises as fs, createReadStream, createWriteStream } from 'fs'
import sharp from 'sharp'
import { v4 as uuid } from "uuid";
import s3Client from "./s3";
import File from "./types/file";


type ImportConfig = Record<string, number>;
export interface Images extends Record<string, string> {
    fileName: string;
    original: string;
    large?: string;
    medium?: string;
    small?: string;
    title?: string;
    date?: string;
    location?: string;
    updated_at?: string;
    created_at?: string;
    entry_id?: string;
}

export interface ImageDoc {
    image_id: number;
    entry_id: number;
    title: string;
    original: string;
    large: string;
    medium: string;
    small: string;
    date: string;
    location: string;
    updated_at: string;
    created_at: string;
}

export function importImage(file: File) {
    return uploadAndBuildScaledVersions(
        {
            large: 1024,
            medium: 512,
            small: 128,
        },
        file,
    );
}

async function writeStreamToFile(file: File, targetPath: string): Promise<void> {
    const writeStream = createWriteStream(targetPath)
    const readStream = file.createReadStream()
    readStream.pipe(writeStream)

    return new Promise((resolve, reject) => {
        readStream.on("end", () => resolve());
        readStream.on("error", error => reject(error));
    });
}


async function uploadToS3(filePath: string, mimeType: string, encoding: string) {
    const request = s3Client.upload({
        Bucket: "joujou-images",
        ContentType: mimeType,
        ContentEncoding: encoding,
        Key: filePath,
        ServerSideEncryption: "AES256",
        Body: createReadStream(filePath),
    });

    const res = await request.promise()
    return res.Key;
};

export async function uploadAndBuildScaledVersions(
    config: ImportConfig,
    file: File,
) {
    console.log("Start to upload images.")
    const { filename: fileName, mimetype: mimeType, encoding } = file
    const fileExtention = path.extname(fileName);
    const hash = uuid();

    const imageURIs: Images = {
        fileName: fileName,
        original: `uploads/images/${hash}-original${fileExtention}`,
    };

    await fs.mkdir('uploads/images', { recursive: true });
    await writeStreamToFile(file, imageURIs.original)

    await Promise.all(
        Object.entries(config).map(async ([sizeKey, endHeight]) => {
            const targetFileName = `uploads/images/${hash}-${sizeKey}.png`;
            await sharp(imageURIs.original).resize(null, endHeight).toFormat('png').toFile(targetFileName);
            imageURIs[sizeKey] = targetFileName;
        }),
    );

    await Promise.all(
        Object.entries(imageURIs).map(async ([key, uri]) => {
            if (key !== 'fileName') {
                if (key === 'original') {
                    imageURIs[key] = await uploadToS3(uri, mimeType, encoding);
                } else {
                    imageURIs[key] = await uploadToS3(uri, 'image/png', encoding);
                }
            }
        }),
    );

    //await fs.rmdir('uploads/images', { recursive: true })

    return imageURIs;
}