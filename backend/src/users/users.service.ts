import { ConflictException, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';

import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        email: email.toLowerCase(),
      })
      .exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async createUser(params: {
    email: string;
    name: string;
    passwordHash: string;
    role: Role;
  }): Promise<UserDocument> {
    const existing = await this.findByEmail(params.email);

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    return this.userModel.create(params);
  }

  async updateRefreshTokenHash(
    userId: string,
    hash: string | null,
  ): Promise<void> {
    await this.userModel.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          refreshTokenHash: hash,
        },
      },
    );
  }

  async findTechnicians() {
    return this.userModel
      .find({
        role: Role.TECHNICIAN,
        isActive: true,
      })
      .select('_id name email role')
      .sort({
        name: 1,
      })
      .lean()
      .exec();
  }
}
