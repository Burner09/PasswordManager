import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator'
import crypto from 'crypto';

import User from '../models/UserSchema.js';

// helper functions
export const createToken = async (id) => {
  const maxAge = 60 * 5;
  return jwt.sign({ id }, process.env.SECRETMESSAGE, { expiresIn: maxAge });
};

const encryptName = (data) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY, iv);
  let encryptedName = cipher.update(data, 'utf-8', 'hex');
  encryptedName += cipher.final('hex');
  const base64Iv = iv.toString('base64');
  return { encryptedName, iv: base64Iv };
};

// controllers
export const refreshJWT = async (req, res) => {
  const user = req.user;
  try {
    const token = await createToken(user.id);
    res.status(200).json({ message: 'verified', token })
  } catch(err) {
    console.log(err);
    res.status(400).json(err.message);
  }
}

export const userSignUp = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    if(!validator.isEmail(email)) {
      return res.status(400).json({message: "Please enter a valid email"})
    }

    const user = await User.findOne({ email}, { email: 1} );

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      return res.status(400).json({ message: "Password does not meet the requirements" });
    }

    const fullName = `${firstName} ${lastName}`;
    const { encryptedName, iv: base64Iv } = encryptName(fullName);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = User({
      fullName: { name: encryptedName, iv: base64Iv },
      email,
      password: hashedPassword
    });
    await newUser.save();

    res.status(201).json({message: 'Account created successfully'});
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
}

export const userSignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if(!validator.isEmail(email)) {
      return res.status(400).json({message: "Please enter a valid email"})
    }

    const user = await User.findOne({ email }, { fullName: 1, password: 1 });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY, Buffer.from(user.fullName.iv, 'base64'));
    let decryptedFullName = decipher.update(user.fullName.name, 'hex', 'utf-8');
    decryptedFullName += decipher.final('utf-8');

    const token = await createToken(user._id);
    res.status(200).json({ message: "Authentication successful", token, fullName: decryptedFullName });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
}

export const changeUserAccountPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }, { password: 1});

    const auth = await bcrypt.compare(oldPassword, user.password);
    
    if (!auth) {
      return res.status(401).json({message: "Password is incorrect"});
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({message: "New password must be different"});
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPassword)) {
      return res.status(400).json({message: "New password does not meet requirements"});
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
}

export const changeUserName = async (req, res) => {
  const { firstName, lastName, password } = req.body;
  const { email, } = req.params;

  try {
    const user = await User.findOne({ email }, { fullName: 1, password: 1 });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(401).json({message: "Password is incorrect"});
    }

    const newFullName = `${firstName} ${lastName}`;
    const { encryptedName, iv: base64Iv } = encryptName(newFullName);

    user.fullName = { name: encryptedName, iv: base64Iv };
    await user.save();

    res.status(200).json({ message: "Username changed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changeUserEmail = async (req, res) => {
  const { newEmail, password } = req.body;
  const { email } = req.params;

  try {
    if(!validator.isEmail(newEmail)) {
      return res.status(400).json({message: "Please enter a valid email"})
    }
    const user = await User.findOne({ email }, { email: 1, password: 1 });

    if (email === newEmail) {
      return res.status(400).json({message: "New email must be different"});
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    user.email = newEmail;
    await user.save();

    res.status(200).json({ message: "Email changed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserAccount = async (req, res) => {
  const { password } = req.body;
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }, {password: 1});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const auth = await bcrypt.compare(password, user.password);
    
    if (!auth) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    await user.deleteOne({ email });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}