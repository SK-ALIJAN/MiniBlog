const fs = require('fs');
const path = require('path');
const createError = require('http-errors');
const httpStatus = require('http-status');


const updateFileName = (directory, oldName, newName) => {



  try {
    const oldFilePath = `./src/public/${directory}/${oldName}`
    const newFilePath = `./src/public/${directory}/${newName}` 

    //console.log(`Old file path: ${oldFilePath}`);
   // console.log(`New file path: ${newFilePath}`);

    // Ensure paths are normalized to handle spaces and special characters
    const normalizedOldFilePath = path.normalize(oldFilePath);
    const normalizedNewFilePath = path.normalize(newFilePath);

    //console.log(`Normalized old file path: ${normalizedOldFilePath}`);
    //console.log(`Normalized new file path: ${normalizedNewFilePath}`);

    try {
      fs.statSync(normalizedOldFilePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error(`File ${normalizedOldFilePath} does not exist`);
        throw createError(httpStatus.NOT_FOUND, `File ${oldName} does not exist`);
      } else {
        console.error(`Error checking file ${normalizedOldFilePath}: ${err.message}`);
        throw createError(httpStatus.INTERNAL_SERVER_ERROR, 'Error checking file: ' + err.message);
      }
    }

    fs.renameSync(normalizedOldFilePath, normalizedNewFilePath);
    console.log(`File renamed from ${normalizedOldFilePath} to ${normalizedNewFilePath}`);
    return newName;
  } catch (error) {
    console.error(`Error renaming file: ${error.message}`);
    createError(httpStatus.INTERNAL_SERVER_ERROR, 'Rename file error: ' + error.message);
  }
};

module.exports = updateFileName;
