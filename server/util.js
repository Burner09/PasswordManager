import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const createToken = (id) => {
  const maxAge = 1 * 60 * 30;
  return jwt.sign({ id }, process.env.SECRETMESSAGE, { expiresIn: maxAge });
};

export function encryptPasswordDetails(passwordDetails, key) {
  const iv = crypto.randomBytes(16); // Generate a random initialization vector

  const passwordCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encryptedPassword = passwordCipher.update(passwordDetails.password, 'utf-8', 'hex');
  encryptedPassword += passwordCipher.final('hex');

  const userNameCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encryptedUserName = userNameCipher.update(passwordDetails.userName, 'utf-8', 'hex');
  encryptedUserName += userNameCipher.final('hex');

  const base64iv = iv.toString('base64');
  return { encryptedPassword, encryptedUserName, base64iv };
}

export function decryptPasswordDetails(encryptedPassword, encryptedUserName, base64iv, key) {
  const iv = Buffer.from(base64iv, 'base64');

  const passwordDecipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decryptedPassword = passwordDecipher.update(encryptedPassword, 'hex', 'utf-8');
  decryptedPassword += passwordDecipher.final('utf-8');

  const userNameDecipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decryptedUserName = userNameDecipher.update(encryptedUserName, 'hex', 'utf-8');
  decryptedUserName += userNameDecipher.final('utf-8');

  return { decryptedPassword, decryptedUserName };
}

export function generateRandomPassword(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  const randomBytes = crypto.randomBytes(length);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(randomBytes[i] % characters.length);
  }
  return password;
}

export function generatePasswordWithWord(word, length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';

  while (password.length < length - word.length - 3) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const randomIndex = Math.floor(Math.random() * (password.length + 1));
  password = password.slice(0, randomIndex) + word + password.slice(randomIndex);

  if (password.length > length) {
    password = password.slice(0, length);
  } else if (password.length < length) {
    const specialCharIndex = Math.floor(Math.random() * (password.length + 1));
    password = password.slice(0, specialCharIndex) + '!@#$%^&*()-_=+'.charAt(Math.floor(Math.random() * '!@#$%^&*()-_=+'.length)) + password.slice(specialCharIndex);

    const numberIndex = Math.floor(Math.random() * (password.length + 1));
    password = password.slice(0, numberIndex) + '0123456789'.charAt(Math.floor(Math.random() * '0123456789'.length)) + password.slice(numberIndex);
    
    const capitalIndex = Math.floor(Math.random() * (password.length + 1));
    password = password.slice(0, capitalIndex) + characters.charAt(Math.floor(Math.random() * 26) + 26) + password.slice(capitalIndex);
  }

  return password;
}