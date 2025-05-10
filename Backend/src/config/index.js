require("dotenv").config();
const Joi = require("joi");

const envVarsSchema = Joi.object()
  .keys({
    ENVIRONMENT: Joi.string()
      .valid("production", "development", "test")
      .required(),
    BASE_URL: Joi.string().default("http://localhost"),
    ACTUAL_BASE_URL: Joi.string().default("http://localhost"),
    PORT: Joi.number().default(3001),
    SESSION_SECRET: Joi.string().required().description("Session secret key"),
    SESSION_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which session expire"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which access tokens expire"),
    GOOGLE_CLIENT_ID: Joi.string().required().description("Google authentication"),
    NODEMAILER_EMAIL: Joi.string().required().description("Nodemailer configuration"),
    NODEMAILER_PASSWORD: Joi.string().required().description("Nodemailer configuration"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.ENVIRONMENT,
  port: envVars.PORT,
  sessionSecret: envVars.SESSION_SECRET,
  sessionExpirationDays: envVars.SESSION_EXPIRATION_DAYS,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpirationDays: envVars.JWT_EXPIRATION_DAYS,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  baseUrl: process.env.BASE_URL,
  swaggerUser: process.env.SWAGGER_USER,
  swaggerPassword: process.env.SWAGGER_PASSWORD,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  sendGridApiKey: process.env.SENDGRID_API_KEY,
  mailSenderName: process.env.MAIL_SENDER,
  whatsAppNumber: process.env.WHATS_APP_NUMBER,
  googleClientId: envVars.GOOGLE_CLIENT_ID,
  nodemailerEmail: envVars.NODEMAILER_EMAIL,
  nodemailerPassword: envVars.NODEMAILER_PASSWORD,
};
