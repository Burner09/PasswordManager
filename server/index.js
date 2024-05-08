import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

import User from './Models/UserSchema.js';
import { verifyToken } from './middleware/authMiddleware.js';
import { generateRandomPassword, generatePasswordWithWord, encryptPasswordDetails, decryptPasswordDetails, createToken } from './util.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({limit: '15mb', extended: true}));
app.use(cookieParser())
app.use(cors());
app.use(helmet());

app.post('/generate', (req, res) => {
  const { word } = req.body;

  let length = word.length >= 8? word.length + 4 : 14

  try {
    let generatedPassword;

    if(word) {
      generatedPassword = generatePasswordWithWord(word, length);
    } else {
      generatedPassword = generateRandomPassword(length);
    }

    res.status(200).json(generatedPassword);
  } catch(err) {
    console.log(err);
    res.status(500).json('Internal server error');
  }
});

app.post('/auth', verifyToken, (req, res) => {
  res.status(200).json({ message: 'verified' })
})

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({message: "User already exist"});
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      return res.status(400).json({message: "Password does not meet the requirements"});
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = User({email, password: hashedPassword});
    await newUser.save();

    res.status(201).json('Account created successfully' );
  } catch(err) {
    console.log(err.message);
    res.status(400).json(err.message);
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  try {
    if (!user) {
      return res.status(400).json({message: "Invalid email or password"});
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(400).json({message: "Invalid email or password"});
    }

    const token = createToken(user._id);
    res.status(200).json({message: "Authentication successful", token} );
  } catch(err) {
    console.error(err);
    res.status(401).json(err.message);
  }
});

app.get('/passwords/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const decryptionKey = process.env.ENCRYPTION_KEY;

    const user = await User.findOne({ email });

    const decryptedPasswords = user.storedPasswords.map(password => {
      const { decryptedPassword, decryptedUserName } = decryptPasswordDetails(password.password, password.userName, password.iv, decryptionKey);
      return {
        type: password.type,
        name: password.name,
        websiteOrDevice: password.websiteOrDevice,
        userName: decryptedUserName,
        password: decryptedPassword
      };
    });

    res.status(200).json(decryptedPasswords);
  } catch(err) {
    console.log(err.message);
    res.status(500).json('Internal server error');
  }
});

app.put('/passwords/:email', async (req, res) => {
  const { passwordDetails } = req.body;
  const { email } = req.params;

  try {
    const encryptionKey = process.env.ENCRYPTION_KEY;

    const { encryptedPassword, encryptedUserName, base64iv } = encryptPasswordDetails(passwordDetails, encryptionKey);

    const user = await User.findOne({ email });

    passwordDetails.password = encryptedPassword;
    passwordDetails.userName = encryptedUserName;
    passwordDetails.iv = base64iv;

    await user.storedPasswords.push(passwordDetails);
    await user.save();

    res.status(200).json('Password stored successfully');
  } catch(err) {
    console.log(err.message);
    res.status(500).json('Internal server error');
  }
});

app.delete('/passwords/:email/:passwordId', async (req, res) => {
  const { email, passwordId } = req.params;

  try {
    const user = await User.findOne({ email });

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
});

app.put('/changepassword/:email', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    const auth = await bcrypt.compare(oldPassword, user.password);
    
    if (!auth) {
      return res.status(404).json({message: "Password is incorrect"});
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({message: "New password must be different"});
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPassword)) {
      return res.status(404).json({message: "New password does not meet requirements"});
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(400).json(err.message);
    console.log(err.message);
  }
});

app.post('/deleteaccount/:email', async (req, res) => {
  const { password } = req.body;
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const auth = await bcrypt.compare(password, user.password);
    
    if (!auth) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    await user.deleteOne({ email });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    })
  }).catch((err) => {
    console.log(err);
  });