import mongoose from 'mongoose';
import validator from 'validator'

const userSchema = mongoose.Schema({
  fullName: {
    encrypted: {
      type: String,
      required: true
    },
    iv: {
      type: String,
      required: true
    }
  },
  email: {
    type: String,
    required: [true, "An email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "A password is required"],
  },
  storedPasswords: [{
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    websiteOrDevice: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },  
    password: {
      type: String,
      required: true
    },
    iv: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true })

const User = mongoose.model('User', userSchema);
export default User;