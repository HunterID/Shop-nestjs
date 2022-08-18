import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { S3_CLIENT } from './multer.constants';

export type S3Client = AWS.S3;

const S3Factory = async (configService: ConfigService): Promise<S3Client> => {
  const { accessKeyId, secretAccessKey, endpoint, region } = configService.get('s3');
  const credentials = {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  };
  return new AWS.S3({ credentials, endpoint, region, s3ForcePathStyle: true });
};

export const S3Provider: Provider = {
  useFactory: S3Factory,
  inject: [ConfigService],
  provide: S3_CLIENT,
};
