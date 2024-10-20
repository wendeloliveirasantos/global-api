import { registerAs } from '@nestjs/config';
import { IsJSON, IsOptional, IsString, ValidateIf } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { SendGrid } from './config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.SENDGRID_API_KEY)
  @IsString()
  SENDGRID_API_KEY: string;
}

export default registerAs<SendGrid>(
  'sendGrid',
  () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
      sendGridApiKey: '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'
    };
  },
);
