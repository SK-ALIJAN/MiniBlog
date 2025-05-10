const Joi = require("joi");

exports.createAccount = {
  body: Joi.object().keys({
    first_name: Joi.string().trim().required().label("First Name"),
    last_name: Joi.string().trim().required().label("Last Name"),
    email: Joi.string().trim().required().label("Email"),
    password: Joi.string().trim().required().min(6).label("Password"),
  })
};
