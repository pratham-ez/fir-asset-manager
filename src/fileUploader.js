const AWS = require("aws-sdk");
const s3 = new AWS.S3();

// bucket name env var will be set in serverless.yml file
const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async (event) => {
  console.log(event);

  try {
    const postId = event.pathParameters.postId;
    const fileExtension = event.queryStringParameters.fileExtension;

    // Generate image ID by using UUID generator.
    const crypto = require("crypto");
    const imageId = crypto.randomUUID();

    const fileKey = `posts/${postId}/images/${imageId}.${fileExtension}`;
    const bucketName = BUCKET_NAME;

    const params = {
      Bucket: bucketName,
      Key: fileKey,
      ContentType: `image/${fileExtension}`,
    };

    const presignedUrl = await s3.getSignedUrlPromise("putObject", params);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Image's pre-signed url for putObject retrieved successfully`,
        presignedUrl,
        imageId,
      }),
    };
  } catch (error) {
    console.error("Failed to get the image's pre-signed url. Error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to get the image's pre-signed url`,
      }),
    };
  }
};
