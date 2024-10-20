import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, catchError, firstValueFrom, map, tap } from 'rxjs';
import { AllConfigType } from 'src/config/config.type';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  private readonly logger = new Logger(SendGridService.name);

  async sendEmailDobyseg(to: string, dynamicData: Record<string, any>) {
    const msg = {
      to,
      from: 'contato@contrate.digital',
      templateId: 'd-6ed5485f26c2446795117c597b34c510',
      dynamic_template_data: dynamicData,
    };
    try {
      await sgMail.send(msg);
    } catch (error) {
    }
  }

  private getConfig() {
    
    const sendGridApiKey = this.configService.get(
      'sendGrid.sendGridApiKey',
      {
        infer: true,
      },
    );
    return {
        sendGridApiKey
    };
  }
}
