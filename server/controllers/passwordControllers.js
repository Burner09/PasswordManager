import crypto from 'crypto';

import User from '../models/UserSchema.js';

// helper functions
const encryptPasswordDetails = (passwordDetails, key) => {
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

const decryptPasswordDetails = async (passwordDetails, iv, key) => {
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

// controllers
export const getAllPasswords = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }, { storedPasswords: 1 });

    if (!user) {
      return res.status(404).json('User not found');
    }

    const decryptedPasswords = await Promise.all(user.storedPasswords.map(async password => {
      const iv = password.iv;
      const passwordData = {
        _id: password._id,
        type: password.type,
        name: password.name,
        websiteOrDevice: password.websiteOrDevice,
        userName: password.userName,
        password: password.password
      }
      const decryptedFields = await decryptPasswordDetails(passwordData, iv, process.env.ENCRYPTION_KEY);
      return decryptedFields;
    }));
    
    res.status(200).json(decryptedPasswords);
  } catch(err) {
    console.log(err.message);
    res.status(500).json('Internal server error');
  }
}

export const createNewPassword = async (req, res) => {
  const { passwordDetails } = req.body;
  const { email } = req.params;

  try {
    const encryptionKey = process.env.ENCRYPTION_KEY;

    const { encryptedFields, base64iv } = encryptPasswordDetails(passwordDetails, encryptionKey);

    const user = await User.findOne({ email }, { storedPasswords: 1 });

    user.storedPasswords.push({ ...encryptedFields, iv: base64iv });
    await user.save();

    res.status(200).json({message: 'Password stored successfully'});
  } catch(err) {
    console.log(err.message);
    res.status(500).json('Internal server error');
  }
}

export const updatePassword = async (req, res) => {
  const { email, passwordId } = req.params;
  const { updatedPasswordDetails } = req.body;

  try {
    const user = await User.findOne({ email }, { storedPasswords: 1 });

    const passwordIndex = user.storedPasswords.findIndex(password => password._id.toString() === passwordId);
    if (passwordIndex === -1) {
      return res.status(404).json({ message: 'Password not found' });
    }

    const { encryptedFields, base64iv } = await encryptPasswordDetails(updatedPasswordDetails, process.env.ENCRYPTION_KEY);

    user.storedPasswords[passwordIndex] = { ...encryptedFields, iv: base64iv };
    await user.save();

    res.status(200).json({ message: 'Password details updated successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const deletePassword = async (req, res) => {
  const { email, passwordId } = req.params;

  try {
    const user = await User.findOne({ email }, { storedPasswords: 1 });

    const passwordIndex = user.storedPasswords.findIndex(password => password._id.toString() === passwordId);
    if (passwordIndex === -1) {
      return res.status(404).json('Password not found');
    }

    user.storedPasswords.splice(passwordIndex, 1);

    await user.save();

    res.status(200).json({message: 'Password deleted successfully'});
  } catch(err) {
    console.log(err.message);
    res.status(500).json({message: 'Internal server error'});
  }
}