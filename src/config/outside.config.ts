import { registerAs } from '@nestjs/config';
import { IsJSON, IsOptional, IsString, ValidateIf } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { OutSide } from './config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.CEP_URL)
  @IsString()
  CEP_URL: string;
}

export default registerAs<OutSide>(
  'outSide',
  () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
      cepUrl: 'https://viacep.com.br'
    };
  },
);
