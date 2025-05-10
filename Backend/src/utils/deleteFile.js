const fs = require('fs');

exports.deleteFile = async (Directory, fileName) => {
    const pathToFile = `./src/public/${Directory}/${fileName}`
    
    if (fs.existsSync(pathToFile)){
        fs.unlinkSync(pathToFile)
    }
}