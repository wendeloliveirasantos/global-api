import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TravelService } from './travel.service';
import { TravelQuoteDto } from './dto/travel-quote.dto';
import { TravelCompraDto } from './dto/travel-compra.dto';

@ApiBearerAuth()
@ApiTags('Travels')
@Controller({
  path: 'travels',
  version: '1',
})
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Post('quotes')
  @HttpCode(HttpStatus.CREATED)
  quote(@Body() travelQuoteDto: TravelQuoteDto): Promise<any> {
    return this.travelService.cotacao(travelQuoteDto);
  }

  @Post('purchases')
  @HttpCode(HttpStatus.CREATED)
  purchase(@Body() travelCompraDto: TravelCompraDto): Promise<any> {
    return this.travelService.compra(travelCompraDto);
  }

  @Get('destinies')
  @HttpCode(HttpStatus.OK)
  destinies(): Promise<any> {
    return this.travelService.destinos();
  }

  @Get('consult-cep/:cep')
  @HttpCode(HttpStatus.OK)
  consultCep(@Param('cep') cep: string): Promise<any> {
    return this.travelService.consultarCep(cep);
  }
}
