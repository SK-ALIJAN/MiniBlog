// function getImageFormat(base64String) {
//     if (typeof base64String !== 'string') {
//         console.error("Invalid input to getImageFormat:", base64String);
//         return null;
//     }
//     return base64String.match(/^data:image\/(\w+);base64,/)?.[1] || null;
// }


// module.exports = getImageFormat;

function getImageFormat(base64String) {
    if (typeof base64String !== "string") {
        console.error("Invalid input to getImageFormat:", base64String);
        return null;
    }

    const match = base64String.match(/^data:image\/(\w+);base64,/);
    if (!match || !match[1]) {
        console.error("Invalid base64 image format:", base64String);
        return null;
    }

    return match[1];
}

function isBase64Image(string) {
    return /^data:image\/\w+;base64,/.test(string);
}

module.exports = {getImageFormat, isBase64Image};


