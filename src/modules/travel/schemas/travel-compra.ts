import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  Customer,
  CustomerSchema,
} from 'src/modules/customer/schemas/customer.schema';

export type TravelCompraDocument = HydratedDocument<TravelCompra>;

@Schema()
export class TravelCompra {
  @Prop()
  provider: string;

  @Prop()
  metadata: string;

  @Prop({ type: CustomerSchema })
  contato: Customer;
}

export const TravelCompraSchema = SchemaFactory.createForClass(TravelCompra);
