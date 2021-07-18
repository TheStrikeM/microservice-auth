import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipher, createDecipher } from 'crypto';

@Injectable()
export default class CryptoService {
  private readonly algorithm: string;
  private readonly password: string;

  constructor(private readonly configService: ConfigService) {
    this.algorithm = this.configService.get<string>('CRYPTO_ALGORITHM');
    this.password = this.configService.get<string>('CRYPTO_PASSWORD');
  }

  encrypt(text: string) {
    const cipher = createCipher(this.algorithm, this.password);
    let encryptedText = cipher.update(text, 'utf8', 'hex');
    encryptedText += cipher.final('hex');
    return encryptedText;
  }

  decrypt(text: string) {
    const decipher = createDecipher(this.algorithm, this.password);
    let decryptedText = decipher.update(text, 'hex', 'utf8');
    decryptedText += decipher.final('utf8');
    return decryptedText;
  }

  comparePassword(decryptedPassword: string, encryptedPassword: string) {
    if (decryptedPassword === this.decrypt(encryptedPassword)) return true;
    else return false;
  }
}
