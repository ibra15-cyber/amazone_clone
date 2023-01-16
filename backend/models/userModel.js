import mongoose from 'mongoose';
// const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true, //created and updated time will be added which is a plus compared with django
  }
);

const User = mongoose.model('User', userSchema)

export default User

// using node
// module.exports = mongoose.model('User', userSchema);
