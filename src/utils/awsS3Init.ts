
import { S3Client } from '@aws-sdk/client-s3';
import {AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,S3_BUCKET,S3_REGION} from '../config'

export const s3Client = new S3Client({
    credentials: {
        accessKeyId: String(AWS_ACCESS_KEY_ID), 
        secretAccessKey: String(AWS_SECRET_ACCESS_KEY),
    },
    region: String(S3_REGION)
})



