import crypto from 'crypto';

// helper functions
const generatePassword = (word, length) => {
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

// controllers
export const passwordGenerator = (req, res) => {
  let { word } = req.body;
  word = word.replace(/\s/g, '');
  let length = word.length >= 8? word.length + 4 : 14

  try {
    const generatedPassword = generatePassword(word, length);

    res.status(200).json(generatedPassword);
  } catch(err) {
    console.log(err);
    res.status(500).json('Internal server error');
  }
}