// middleware/validation.js

const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Custom method to validate URL using validator
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// 1. Validate clothing item body when creating an item
const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.empty": 'The "weather" field must be filled in',
      "any.only": 'The "weather" field must be one of: hot, warm, cold',
    }),
  }),
});

// 2. Validate user info body when creating a user
const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 3. Validate authentication when user logs in
const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 4. Validate general ID parameter (can be used for both userId and itemId)
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": 'The "id" field must be a valid hexadecimal value',
      "string.length": 'The "id" field must be exactly 24 characters long',
    }),
  }),
});

// 5. Validate user ID parameter
const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.hex": 'The "userId" field must be a valid hexadecimal value',
      "string.length": 'The "userId" field must be exactly 24 characters long',
    }),
  }),
});

// 6. Validate clothing item ID parameter
const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.hex": 'The "itemId" field must be a valid hexadecimal value',
      "string.length": 'The "itemId" field must be exactly 24 characters long',
    }),
  }),
});

// 7. Validate user profile update
const validateUserInfoBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

// For routes like /items/:id or /users/:id
app.get("/items/:id", validateId, getItemById);
app.delete("/items/:id", validateId, deleteItem);
app.get("/users/:id", validateId, getUserById);

module.exports = {
  validateCardBody,
  validateUserBody,
  validateAuthentication,
  validateId,
  validateUserId,
  validateItemId,
  validateUserInfoBody,
};
