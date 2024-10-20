export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
};

export type AuthConfig = {
  secret?: string;
  expires?: string;
  refreshSecret?: string;
  refreshExpires?: string;
};

export type UniversalAssistanceTravel = {
  universalAssistanceTravelUrl: string;
  universalAssistanceTravelLogin: string;
  universalAssistanceTravelSenha: string;
  universalAssistanceTravelTipoViagem: number;
  universalAssistanceTravelTipoTarifa: number;
};

export type AssistCard = {
  assistCardUrl: string;
  assistCardLogin: string;
  assistCardSenha: string;
};

export type NowSys = {
  nowSysUrl: string;
  nowSysLogin: string;
  nowSysSenha: string;
};

export type MailConfig = {
  port: number;
  host?: string;
  user?: string;
  password?: string;
  defaultEmail?: string;
  defaultName?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
};

export type OutSide = {
  cepUrl: string;
}

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  mail: MailConfig;
  universalAssistanceTravel: UniversalAssistanceTravel;
  assistCard: AssistCard;
  nowSys: NowSys;
  outSide: OutSide;
  sendGrid: SendGrid;
};

export type SendGrid = {
  sendGridApiKey: string;
}
