module.exports = function capitalizeText(text) {
  // Split the text into words based on spaces
  let words = text.split(" ");

  // Capitalize the first letter of each word
  let capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back into a single string
  let capitalizedText = capitalizedWords.join(" ");

  return capitalizedText;
};
