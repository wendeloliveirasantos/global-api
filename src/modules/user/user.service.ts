// contato.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  private readonly jwtSecret: string = 'seuSegredoJWT';

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createdCustomer = new this.userModel({ ...userData, password: hashedPassword });
    return createdCustomer.save();
  }

  async findOneById(contatoId: string): Promise<User | null> {
    return this.userModel.findById(contatoId).exec();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async login(username: string, password: string): Promise<string | null> {
    const user = await this.userModel.findOne({ username: username }).exec();

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, this.jwtSecret, { expiresIn: '1h' });
      return token;
    }
    
    return null;
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decodedToken = jwt.verify(token, this.jwtSecret);
      return decodedToken;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}
