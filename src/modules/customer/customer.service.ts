// contato.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private contatoModel: Model<Customer>,
  ) {}

  async createCustomer(contatoData: Partial<Customer>): Promise<Customer> {
    const createdCustomer = new this.contatoModel(contatoData);
    return createdCustomer.save();
  }

  async findOneById(contatoId: string): Promise<Customer | null> {
    return this.contatoModel.findById(contatoId).exec();
  }

  async findOneByCpf(cpfNumber: string): Promise<Customer | null> {
    return this.contatoModel.findOne({ cpfNumber }).exec();
  }
}
