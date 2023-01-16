// import express from 'express';
// import User from '../models/userModel.js';
// import bcrypt from 'bcrypt';
// import expressAsyncHandler from 'express-async-handler';
// import { generateToken, isAuth } from '../util.js';

// const userRouter = express.Router();

// // install expressAsyncHandler : npm install express-async-handler
// // also install npm install jsonwebtoken to help with generating a token
// userRouter.post(
//   '/signin',
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findOne({ email: req.body.email }); //if the email making the request exist in the db

//     if (user) {
//       if (bcrypt.compareSync(req.body.password, user.password)) {
//         //compare the password in db with the one coming from post request body
//         res.send({
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           isAdmin: user.isAdmin,
//           token: generateToken(user),
//         }); //if it succeed, send me the id, name email and is admin status for debugging purposes to make sure before connecting to thefront end
//       }
//       return;
//     }
//   })
// );

// userRouter.post(
//   '/signup',
//   expressAsyncHandler(async (req, res) => {
//     const { name, email, password } = req.body;
//     const newUser = new User({
//       name,
//       email,
//       password: bcrypt.hashSync(password, 8),
//     });

//     const user = await newUser.save(); //save user in db
//     res.send({
//       //give us this back to the front end; for use to save in localstorage
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       token: generateToken(user),
//     });
//   })
// );

// userRouter.put(
//   '/profile',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     //find use in db by id making the request
//     const user = await User.findById(req.user.i_id);

//     //if there's a user in db
//     if (user) {
//       // change name and email from the useState initial values else keep the default in db
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;

//       //if the user changes the password?
//       if (req.body.password) {
//         //changed the password to the new password in the request, salt it at 8
//         user.passowrd = bcrypt.hashSync(req.body.passowrd, 8);
//       }

//       const updatedUser = await user.save(); //save the user in db and keep it in a variable we will pass back to the front end

//       res.status(201).send({
//         //give us this back; we could have just returned only the updatedUser user and destructure it inthe frontend
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         isAdmin: updatedUser.isAdmin,
//         token: generateToken(updatedUser), //generate a token for the update and send it too
//       });
//     } else {
//       res.send({ message: ' User not found ' });
//     }
//   })
// );

// export default userRouter;

import express from 'express';
import bcrypt from 'bcrypt';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth, isAdmin, generateToken } from '../util.js';

const userRouter = express.Router();

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

export default userRouter;
