import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  Customer,
  CustomerSchema,
} from 'src/modules/customer/schemas/customer.schema';

export type HybridCompraDocument = HydratedDocument<HybridCompra>;

@Schema()
export class HybridCompra {
  @Prop()
  provider: string;

  @Prop()
  metadata: string;

  @Prop({ type: CustomerSchema })
  contato: Customer;
}

export const HybridCompraSchema = SchemaFactory.createForClass(HybridCompra);
