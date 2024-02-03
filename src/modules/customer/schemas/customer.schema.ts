import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Customer extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  gender: string;

  @Prop({ unique: true })
  cpfNumber: string;

  @Prop()
  cellPhone: string;

  @Prop()
  birthDate: string;

  @Prop()
  address: string;

  @Prop()
  number: string;

  @Prop()
  city: string;

  @Prop()
  neighborhood: string;

  @Prop()
  uf: string;

  @Prop()
  country: string;

  @Prop()
  zipCode: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
