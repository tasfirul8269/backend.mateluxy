import express from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

const router = express.Router();

// Use hardcoded values as fallbacks
const AWS_REGION = process.env.AWS_REGION || 'eu-north-1';
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'mateluxy-assets';

// Initialize S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Log S3 configuration
console.log('S3 Proxy initialized with:', {
  region: AWS_REGION,
  bucketName: AWS_BUCKET_NAME,
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
});

/**
 * Route to proxy S3 images with a direct key path
 * GET /api/s3-proxy/direct-key
 * Query parameter: key - the full S3 key path
 */
router.get('/direct-key', async (req, res) => {
  try {
    // Get the key from query parameter
    const key = req.query.key;
    
    if (!key) {
      return res.status(400).send('Missing key parameter');
    }
    
    console.log(`Proxying S3 image with key: ${key}`);
    
    // Set up the S3 get object parameters
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    };

    // Get the object from S3
    try {
      const command = new GetObjectCommand(params);
      const s3Response = await s3Client.send(command);
      
      // Set appropriate headers
      if (s3Response.ContentType) {
        res.setHeader('Content-Type', s3Response.ContentType);
      }
      if (s3Response.ContentLength) {
        res.setHeader('Content-Length', s3Response.ContentLength);
      }
      
      // Stream the S3 object to the response
      if (s3Response.Body instanceof Readable) {
        s3Response.Body.pipe(res);
      } else {
        // If Body is not a stream, convert it to a buffer and send
        const responseBuffer = await s3Response.Body.transformToByteArray();
        res.send(Buffer.from(responseBuffer));
      }
    } catch (s3Error) {
      console.error('S3 error fetching object:', {
        error: s3Error.message,
        code: s3Error.code,
        bucket: AWS_BUCKET_NAME,
        key
      });
      return res.status(404).send(`Image not found: ${s3Error.message}`);
    }
    
  } catch (error) {
    console.error('Error proxying S3 image:', error);
    res.status(500).send('Server error processing image request');
  }
});

/**
 * Route to proxy S3 images
 * GET /api/s3-proxy/:folder/:filename
 * Example: /api/s3-proxy/admins/1747281671192-afccf2m6rxj.png
 */
router.get('/:folder/:filename', async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const key = `${folder}/${filename}`;
    
    console.log(`Proxying S3 image: ${key}`);
    
    // Set up the S3 get object parameters
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    };

    // Get the object from S3
    try {
      const command = new GetObjectCommand(params);
      const s3Response = await s3Client.send(command);
      
      // Set appropriate headers
      if (s3Response.ContentType) {
        res.setHeader('Content-Type', s3Response.ContentType);
      }
      if (s3Response.ContentLength) {
        res.setHeader('Content-Length', s3Response.ContentLength);
      }
      
      // Stream the S3 object to the response
      if (s3Response.Body instanceof Readable) {
        s3Response.Body.pipe(res);
      } else {
        // If Body is not a stream, convert it to a buffer and send
        const responseBuffer = await s3Response.Body.transformToByteArray();
        res.send(Buffer.from(responseBuffer));
      }
    } catch (s3Error) {
      console.error('S3 error fetching object:', {
        error: s3Error.message,
        code: s3Error.code,
        bucket: AWS_BUCKET_NAME,
        key
      });
      return res.status(404).send(`Image not found: ${s3Error.message}`);
    }
    
  } catch (error) {
    console.error('Error proxying S3 image:', error);
    res.status(500).send('Server error processing image request');
  }
});

export default router;
