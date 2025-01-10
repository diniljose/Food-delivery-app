import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly encryptionKey = process.env.ENCRYPTKEY;
  constructor() { }
  async create_session(
    email: string,
    // userId: string,
    expiresIn: string | number,
  ): Promise<any> {
    try {
      const tokenGeneration = this.generateToken({ email }, expiresIn);
      return this.encrypt(tokenGeneration);
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }

  generateToken(payload: any, expiresIn: string | number): string {
    return jwt.sign(payload, process.env.JWTKEY, {
      expiresIn,
      algorithm: 'HS256',
    });
  }

  encrypt(dataToEncrypt: any): any {
    try {
      const encryptedData = CryptoJS.AES.encrypt(
        dataToEncrypt,
        this.encryptionKey,
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        },
      ).toString();
      return encryptedData;
    } catch (error) {
      this.logger.error('Encryption error');
      throw error;
    }
  }

  encryptData(trackId, encryptionKey) {
    // Encrypt the trackId using AES encryption
    let encryptedData = CryptoJS.AES.encrypt(trackId, encryptionKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString();


    encryptedData = encryptedData.replace(/\//g, 'XXX');
    return encryptedData;
  }

  decrypt(encryptedValue: any): any {
    try {
      const encryptedValueDecode = decodeURIComponent(encryptedValue);
      const bytes = CryptoJS.AES.decrypt(
        encryptedValueDecode,
        this.encryptionKey,
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        },
      );
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedText;
    } catch (error) {
      this.logger.error('Decryption error');
      throw error;
    }
  }

  async validateToken(cookiesHeader: string): Promise<any> {
    if (!cookiesHeader) {
      this.logger.error('No cookies found');
      throw new UnauthorizedException('No cookies found');
    }
    const accessToken = cookiesHeader.replace(/^access_token=/, '');
    if (!accessToken) {
      this.logger.error('Access token is not provided');
      throw new UnauthorizedException('Access token is not provided');
    }
    const decrypt_token = this.decrypt(accessToken);
    const decodedToken: any = jwt.decode(decrypt_token);
    if (!decodedToken) {
      this.logger.error('Invalid token');
      throw new UnauthorizedException('Invalid token');
    }
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && currentTime >= decodedToken.exp) {
      this.logger.error('Token has expired');
      throw new UnauthorizedException('Token has expired');
    }
    return decodedToken;
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const saltOrRounds = 10;
      return await bcrypt.hash(password, saltOrRounds);
    } catch (error) {
      throw new InternalServerErrorException('Password hashing failed.');
    }
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashPassword);
    } catch (error) {
      throw new InternalServerErrorException('Password comparison failed.');
    }
  }
}
