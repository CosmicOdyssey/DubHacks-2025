import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config as appConfig } from '../config';

const s3 = new S3Client({ region: appConfig.awsRegion });

export async function putJson(key: string, data: unknown): Promise<void> {
  const bucket = appConfig.awsS3Bucket;
  if (!bucket) return;
  const Body = Buffer.from(JSON.stringify(data));
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body, ContentType: 'application/json' }));
}


