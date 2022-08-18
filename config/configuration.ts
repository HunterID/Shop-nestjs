export default () => ({
  port: process.env.PORT || 3000,
  postgres: {
    type: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpirationTime: +process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpirationTime: +process.env.JWT_REFRESH_TOKEN__EXPIRATION_TIME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
  s3: {
    accessKeyId: process.env.S3_ACCESSKEYID,
    secretAccessKey: process.env.S3_SECRETACCESSKEY,
    region: process.env.S3_REGION,
    bucketName: process.env.S3_BUCKET_NAME,
    endpoint: process.env.S3_ENDPOINT,
  },
  google: {
    googleId: process.env.GOOGLE_ID,
    googleSecret: process.env.GOOGLE_SECRET,
    googleRedirect: process.env.GOOGLE_REDIRECT,
  },
});
