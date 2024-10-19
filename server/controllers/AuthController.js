import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from 'fs'

const maxAge = 3 * 24 * 60 * 60;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge, // Use the predefined maxAge constant
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password is Required");
    }

    const user = await User.create({ email, password });

    res.cookie('jwt', createToken(email, user.id), {
      maxAge: maxAge * 1000,
      secure: true,
      sameSite: "None",

    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        profileSetup: user.profileSetup,

      }
    })

  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password is Required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("User with the given email not found .")
    }

    const auth = await compare(password, user.password)

    if (!auth) {
      return res.status(401).send("Password is Incorrect");
    }


    res.cookie('jwt', createToken(email, user.id), {
      maxAge: maxAge * 1000,
      secure: true,
      sameSite: "None",

    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color
      }
    })

  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};


export const getUserInfo = async (req, res, next) => {
  try {

    // console.log("userId : ",res.userId);
    const userdata = await User.findById(req.userId);
    if (!userdata) {
      return res.status(401).send("User with the given Id not found .")
    }

    return res.status(200).json({

      id: userdata.id,
      email: userdata.email,
      profileSetup: userdata.profileSetup,
      firstName: userdata.firstName,
      lastName: userdata.lastName,
      image: userdata.image,
      color: userdata.color
    })

  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};


export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    // console.log("Received data:", { firstName, lastName, color });
    if (!firstName || !lastName) {
      return res.status(400).send("firstName lastname is required.")
    }

    const userdata = await User.findById(userId);
    // console.log("User ID:", userId); 
    if (!userdata) {
      return res.status(404).send("User not found.");
    }

    const updatedUserData = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      color,
      profileSetup: true
    }, { new: true, runValidators: true });

    return res.status(200).json({
      id: updatedUserData.id,
      email: updatedUserData.email,
      profileSetup: updatedUserData.profileSetup,
      firstName: updatedUserData.firstName,
      lastName: updatedUserData.lastName,
      image: updatedUserData.image,
      color: updatedUserData.color
    })

  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (req, res, next) => {
  try {

    if (!req.file) {
      return res.status(400).send("File is required.")
    }

    const date = Date.now();
    const fileName = `uploads/profiles/${Date.now()}-${req.file.originalname}`
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(req.userId,
      { image: fileName },
      { new: true },
      { runValidators: true }
    );

    return res.status(200).json({
      image: updatedUser.image,
    })

  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};



export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }
    if (user.image) {
      unlinkSync(user.image)
    }
    user.image = null;
    await user.save();

    return res.status(200).send("Profile image removed successfully.")

  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
