import { Injectable, UnauthorizedException, ConflictException, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('../../config.js').JWT_KEY;

import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  createUser(name: string, email: string, password: string) {
    return this.userModel.findOne({ email })
      .then((user) => {
        if (!password || password.length < 6) throw new NotAcceptableException('Password must be at least 6 characters long')
        if (user) throw new ConflictException('User with this email already exists'); // 409 statusCode

        const newUser = new this.userModel({
          name,
          email,
          password,
        });

        return this.saveUser(newUser);
      });
  }

  private async hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      });
    })
    return hashedPassword;
  }

  private async saveUser(user) {
    const hashedPassword = await this.hashPassword(user.password);
    user.password = hashedPassword;

    return user.save()
      .then((res) => {
        const { id, name, email } = res;
        return {
          token: this.jwtSignToken(id),
          user: { id, name, email },
          message: 'User has been created',
        };
      })
      .catch((err) => {
        throw err;
      });
  }

  authUser(email: string, password: string) {
    return this.userModel.findOne({ email })
      .then((user) => {
        if (!password || password.length < 6) throw new NotAcceptableException('Password must be at least 6 characters long')
        if (!user) throw new UnauthorizedException('Authentication failed'); // 401 statusCode

        return this.asyncAuth(user, password);
      });
  }

  private async asyncAuth(user, incomingPassword) {
    const result = await new Promise((resolve, reject) => {
      bcrypt.compare(incomingPassword, user.password, (err, res) => {
        if (err) reject(err)
        resolve(res)
      });
    });

    if (!result) throw new UnauthorizedException('Authentication failed');  // 401 statusCode
    return {
      token: this.jwtSignToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      message: 'Authentication successful',
    };
  }
  
  jwtSignToken(userId) {
    return jwt.sign(
      { userId },
      JWT_KEY,
      { expiresIn: '7d', }
    );
  }
  
}
