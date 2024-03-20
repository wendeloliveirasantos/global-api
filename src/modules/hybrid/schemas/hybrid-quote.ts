import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HybridQuoteDocument = HydratedDocument<HybridQuote>;

@Schema()
export class HybridQuote {
  @Prop()
  provider: string;

  @Prop()
  business: string;

  @Prop()
  metadata: string;
}

export const HybridQuoteSchema = SchemaFactory.createForClass(HybridQuote);
