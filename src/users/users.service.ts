import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, MongooseError } from 'mongoose';
import { CreateUserDto } from './dto';
import { AuthProvider } from '../auth/providers/auth.provider';
import { UserAlreadyExistException } from './exceptions/user-already-exist.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userData = {
        fullname: createUserDto.fullname,
        email: createUserDto.email.toLowerCase(),
        password: createUserDto.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      userData.password = await AuthProvider.generateHash(
        createUserDto.password,
      );
      const user = new this.userModel(userData);
      return await user.save();
    } catch (e) {
      if (e && e.code === 11000) {
        throw new UserAlreadyExistException();
      }
      throw e;
    }
  }

  async getUser(query: object): Promise<User> {
    return this.userModel.findOne(query);
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findOne({
      _id: id,
    });
  }
}
