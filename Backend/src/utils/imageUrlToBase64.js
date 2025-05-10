async function imageUrlToBase64({ url }) {
  const returnObject = { imageType: null, imageBase64: null };
  try {
    const response = await fetch(url);
    if (response.ok) {
      returnObject.imageType = response.headers.get("content-type"); // Fix key name

      const arrayBuffer = await response.arrayBuffer();
      returnObject.imageBase64 = Buffer.from(arrayBuffer).toString("base64");
    }
  } catch (error) {
    console.error("Error fetching image:", error);
  }

  return returnObject;
}

module.exports = imageUrlToBase64;
