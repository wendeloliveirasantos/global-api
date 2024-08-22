import { registerAs } from '@nestjs/config';
import { IsJSON, IsOptional, IsString, ValidateIf } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { NowSys } from './config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.NOW_SYS_URL)
  @IsString()
  NOW_SYS_URL: string;

  @ValidateIf((envValues) => envValues.NOW_SYS_LOGIN)
  @IsString()
  NOW_SYS_LOGIN: string;

  @ValidateIf((envValues) => envValues.NOW_SYS_SENHA)
  @IsString()
  NOW_SYS_SENHA: string;
}

export default registerAs<NowSys>(
  'nowSys',
  () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
      nowSysUrl: 'https://saas-dev.nowseguros.seg.br',
      nowSysLogin: 'globalcorp@globalcorp.com.br',
      nowSysSenha: 'global2024',
    };
  },
);
