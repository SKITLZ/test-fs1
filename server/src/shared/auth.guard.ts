import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
const jwt = require('jsonwebtoken');
const JWT_KEY = require('../../config.js').JWT_KEY;

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) return false;

    request.user = await this.validateToken(request.headers.authorization);
    
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    const token = auth.split(' ')[1];
    try {
      const decoded = await jwt.verify(token, JWT_KEY);
      return decoded;
    } catch(err) {
      const message = `Token error ${err.message}`;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}