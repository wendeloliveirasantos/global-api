import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SendGridService } from './sendgrid.service';

@ApiBearerAuth()
@ApiTags('SendGrid')
@Controller({
  path: 'sendGrid',
  version: '1',
})
export class SendGridController {
  constructor(private readonly sendGridService: SendGridService) {}

  @Post('send')
  async sendEmailDobyseg(@Body('email') email: string) {
    const dynamicData = {
      firstName: 'John', // Customize os dados como necessário
      product: 'Seguro de Vida',
    };
    await this.sendGridService.sendEmailDobyseg(email, dynamicData);
  }
}
