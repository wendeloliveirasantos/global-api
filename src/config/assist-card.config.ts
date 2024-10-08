import { registerAs } from '@nestjs/config';
import { IsJSON, IsOptional, IsString, ValidateIf } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { AssistCard } from './config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.ASSIST_CARD_URL)
  @IsString()
  ASSIST_CARD_URL: string;

  @ValidateIf((envValues) => envValues.ASSIST_CARD_LOGIN)
  @IsString()
  ASSIST_CARD_LOGIN: string;

  @ValidateIf((envValues) => envValues.ASSIST_CARD_SENHA)
  @IsString()
  ASSIST_CARD_SENHA: string;
}

export default registerAs<AssistCard>(
  'assistCard',
  () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
      assistCardUrl: 'https://portalbr.assistcard.com',
      assistCardLogin: '31357',
      assistCardSenha: 'zKZrNJTs+pQNwnW+QG13AQ==',
    };
  },
);