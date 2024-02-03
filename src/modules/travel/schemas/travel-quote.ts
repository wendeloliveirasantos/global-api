import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TravelQuoteDocument = HydratedDocument<TravelQuote>;

@Schema()
export class TravelQuote {
  @Prop()
  provider: string;

  @Prop()
  destinations: string;

  @Prop()
  metadata: string;
}

export const TravelQuoteSchema = SchemaFactory.createForClass(TravelQuote);
