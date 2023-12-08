import * as CryptoJS from 'crypto-js';

const DEFAULT_KEY = {
  SHARE_KEY: 'ase',
};

/**
 * AES加密
 * @param data
 * @param secretKey
 * @returns {string} 加密后的字符串
 */
function aesEncrypt(data: string, secretKey: string = DEFAULT_KEY.SHARE_KEY) {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}

/**
 * AES解密
 * @param data
 * @param secretKey
 * @returns {string} 解密后的字符串
 */
function aesDecrypt(data: string, secretKey: string = DEFAULT_KEY.SHARE_KEY) {
  return CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
}

export default {
  aesEncrypt,
  aesDecrypt,
};
