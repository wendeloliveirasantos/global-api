import { registerAs } from '@nestjs/config';
import { UniversalAssistanceTravel } from './config.type';
import { IsJSON, IsOptional, IsString, ValidateIf } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.UNIVERSAL_ASSISTANCE_TRAVEL_URL)
  @IsString()
  UNIVERSAL_ASSISTANCE_TRAVEL_URL: string;

  @ValidateIf((envValues) => envValues.UNIVERSAL_ASSISTANCE_TRAVEL_LOGIN)
  @IsString()
  UNIVERSAL_ASSISTANCE_TRAVEL_LOGIN: string;

  @ValidateIf((envValues) => envValues.UNIVERSAL_ASSISTANCE_TRAVEL_SENHA)
  @IsString()
  UNIVERSAL_ASSISTANCE_TRAVEL_SENHA: string;

  @ValidateIf((envValues) => envValues.UNIVERSAL_ASSISTANCE_TRAVEL_TIPO_VIAGEM)
  @IsString()
  UNIVERSAL_ASSISTANCE_TRAVEL_TIPO_VIAGEM: string;

  @ValidateIf((envValues) => envValues.UNIVERSAL_ASSISTANCE_TRAVEL_TIPO_TARIFA)
  @IsString()
  UNIVERSAL_ASSISTANCE_TRAVEL_TIPO_TARIFA: string;
}

export default registerAs<UniversalAssistanceTravel>(
  'universalAssistanceTravel',
  () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
      universalAssistanceTravelUrl: 'https://apihomologacao.universal-assistance.com',
      universalAssistanceTravelLogin: 'tes.te',
      universalAssistanceTravelSenha: 'tes.te',
      universalAssistanceTravelTipoViagem: 1,
      universalAssistanceTravelTipoTarifa: 1,
    };
  },
);