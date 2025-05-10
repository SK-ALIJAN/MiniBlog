const express = require("express");
const config = require("../src/config");
const db = require("../src/db");
const ejs = require("ejs");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require("helmet");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const session = require("express-session");
const pgSessionStore = require("connect-pg-simple")(session);
const path = require("path");
const basicAuth = require("express-basic-auth");
const { Pool } = require("pg");
const routes = require("./routes/main.route");
const requestIp = require("request-ip");
const accessLogGenerator = require("./middlewares/accessLogGenerator");
const notFoundHandler = require("./middlewares/notFound");
const handleError = require("./middlewares/errorHandler");
const http = require('http');
const { app, server } = require("./config/server.config")

// const app = express();

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json({ limit: "700mb" }));
// parse urlencoded request body
app.use(
  express.urlencoded({
    extended: true,
    limit: "500mb",
    parameterLimit: 100,
  })
);
// compress response
app.use(compression());
// cookie parser
app.use(cookieParser());
// enable cors
app.use(cors());
app.options("*", cors());
app.use(accessLogGenerator);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH, OPTIONS"
  ); // Allow listed methods
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, X-Requested-With, api_key, Authorization, Accept"
  ); // Allow listed headers

  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next(); // Move on to the next middleware
});

const pool = new Pool({
  user: config.dbUser,
  host: config.dbHost,
  database: config.dbName,
  password: config.dbPassword,
  port: config.dbPort,
});

const store = new pgSessionStore({
  pool: pool,
  tableName: "user_sessions",
  createTableIfMissing: true,
});

app.use(
  session({
    key: "direct-to-customer",
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: config.sessionExpirationDays * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: config.env == "production",
    },
    store: store,
  })
);

// flash messaging
app.use(flash());

// ejs setup
app.use(express.static(path.join(__dirname, "./public")));

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Direct to Customer",
      version: "1.0.0",
      description: "Direct to Customer API Documentation.",
      contact: {
        email: "alizaan8695@gmail.com",
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
    },
    components: {
      securitySchemes: {
        Bearer: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
    servers: [
      {
        url: `${config.baseUrl}:${config.port}/api`,
        description: `This url is a ${config.env} server`,
      },
    ],
  },
  apis: ["src/routes/api/*.js", "src/routes/api/portal/routes/*.js", "src/routes/admin/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(
  "/api-docs",
  basicAuth({
    users: { [config.swaggerUser]: config.swaggerPassword },
    challenge: true,
  }),
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs)
);

if (process.env.MODE === "PROD") {
  app.locals.baseurl = config.baseUrl;
} else {
  app.locals.baseurl = `${config.baseUrl}:${config.port}`;
}


app.use(requestIp.mw());
app.use("/", routes);

app.use("*", notFoundHandler);
app.use(handleError);

if (config.env === "production") {
  server.listen(config.port, () => {
    console.log(`Server is running on ${config.baseUrl}:${config.port}`);
  });
} else {
  server.listen(config.port, () => {
    console.log(`Server is running on ${config.baseUrl}:${config.port}`);
  });
}
