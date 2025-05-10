const axios = require('axios');

async function urlToBase64(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data, 'binary');
    const base64 = buffer.toString('base64');
    return base64;
  } catch (error) {
    console.log('=====as===', error.message);
    throw null;
  }
}

module.exports = urlToBase64;