//crypto.service.ts
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'; // 需要先安装: npm install crypto-js
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  // 客户端加密公钥（实际项目中应从配置或环境变量获取）
  private readonly publicKey = environment.encryption?.publicKey || 'your-public-key';

  // 对密码进行首次加密
  encryptPassword(password: string): string {
    // 1. 先进行SHA256哈希
    const hashedPassword = CryptoJS.SHA256(password).toString();
    
    // 2. 加入时间戳防重放
    const timestamp = new Date().getTime();
    const dataToEncrypt = `${hashedPassword}:${timestamp}`;
    
    // 3. 使用AES加密
    return CryptoJS.AES.encrypt(dataToEncrypt, this.publicKey).toString();
  }
}