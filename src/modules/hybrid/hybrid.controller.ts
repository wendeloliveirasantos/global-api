import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HybridService } from './hybrid.service';
import { HybridQuoteDto } from './dto/hybrid-quote.dto';
import { HybridCompraDto } from './dto/hybrid-compra.dto';

@ApiBearerAuth()
@ApiTags('Hybrids')
@Controller({
  path: 'hybrids',
  version: '1',
})
export class HybridController {
  constructor(private readonly hybridService: HybridService) {}

  @Post('quotes')
  @HttpCode(HttpStatus.CREATED)
  quote(@Body() hybridQuoteDto: HybridQuoteDto): Promise<any> {
    return this.hybridService.cotacao(hybridQuoteDto);
  }

  @Post('purchases')
  @HttpCode(HttpStatus.CREATED)
  purchase(@Body() hybridCompraDto: HybridCompraDto): Promise<any> {
    return this.hybridService.compra(hybridCompraDto);
  }

  @Get('consult-cep/:cep')
  @HttpCode(HttpStatus.OK)
  consultCep(@Param('cep') cep: string): Promise<any> {
    return this.hybridService.consultarCep(cep);
  }
}
