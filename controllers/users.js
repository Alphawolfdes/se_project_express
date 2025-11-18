const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { OK, CREATED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../utils/BadRequestError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const NotFoundError = require("../utils/NotFoundError");
const ConflictError = require("../utils/ConflictError");

const createUser = (req, res, next) => {
  const { name, email, password, avatar } = req.body; // Include avatar

  // Validate required fields
  if (!name || !email || !password) {
    return next(new BadRequestError("Name, email, and password are required."));
  }

  // Hash password before saving
  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ name, email, password: hash, avatar }) // Pass avatar to User.create
        .then((user) => {
          const userData = user.toObject();
          delete userData.password; // This removes password from response
          res.status(CREATED).send(userData);
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError("Email already exists."));
          }
          if (err.name === "ValidationError") {
            return next(
              new BadRequestError("Invalid data passed to create user.")
            );
          }
          return next(err);
        })
    )
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required."));
  }

  // Use custom mongoose method to authenticate user
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password."));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data for update"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
