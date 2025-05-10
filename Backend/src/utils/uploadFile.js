const fs = require("fs");
const { consoleLogger } = require("../config/log.config");
const createError = require("http-errors");
const httpStatus = require("http-status");
const generateRandomAlphabets = require("./generateRandomAlphabets");

const uploadFile = async (dir, data, originalName) => {
  let fileName = "";

  try {
    if (dir && data && originalName) {
      if (!fs.existsSync(`./src/public/${dir}`)) {
        fs.mkdirSync(`./src/public/${dir}`, { recursive: true });
      }

      const imageType = originalName.split(".").pop();
      // generate random uppercase alphabet generator
      const randomAlphabets = generateRandomAlphabets().toLowerCase();
      fileName = Date.now() + "_" + randomAlphabets + "." + imageType;
      const path = `./src/public/${dir}/${fileName}`;
      data = data.split("base64,").reverse()[0];

      fs.writeFileSync(path, data, { encoding: "base64" });
    }
    
    return fileName;
  } catch (error) {
    createError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Upload file error: " + error.message
    );
  }
};
module.exports = uploadFile;
