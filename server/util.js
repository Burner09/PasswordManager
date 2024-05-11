import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const createToken = async (id) => {
  const maxAge = 1 * 60 * 30;
  return jwt.sign({ id }, process.env.SECRETMESSAGE, { expiresIn: maxAge });
};

export async function encryptPasswordDetails(passwordDetails, key) {
  const iv = crypto.randomBytes(16);

  const encryptedFields = {};
  Object.keys(passwordDetails).forEach(field => {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(passwordDetails[field], 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    encryptedFields[field] = encrypted;
  });

  const base64iv = iv.toString('base64');
  return { encryptedFields, base64iv };
}

export async function decryptPasswordDetails(passwordDetails, iv, key) {
  let decryptedFields = {};

  Object.entries(passwordDetails).forEach(field => {
    const [fieldName, fieldValue] = field;
    if (fieldName === '_id') {
      decryptedFields[fieldName] = fieldValue;
    } else {
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'));
      let decrypted = decipher.update(fieldValue, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');
      decryptedFields[fieldName] = decrypted;
    }
  });

  return decryptedFields;
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


  const specialCharIndex = Math.floor(Math.random() * (password.length + 1));
  password = password.slice(0, specialCharIndex) + '!@#$%^&*()-_=+'.charAt(Math.floor(Math.random() * '!@#$%^&*()-_=+'.length)) + password.slice(specialCharIndex);

  const numberIndex = Math.floor(Math.random() * (password.length + 1));
  password = password.slice(0, numberIndex) + '0123456789'.charAt(Math.floor(Math.random() * '0123456789'.length)) + password.slice(numberIndex);
  
  const capitalIndex = Math.floor(Math.random() * (password.length + 1));
  password = password.slice(0, capitalIndex) + characters.charAt(Math.floor(Math.random() * 26) + 26) + password.slice(capitalIndex);

  return password;
}