// generate random password with equalsstring and number
async function generateRandomPassword(length = 8) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  let result = "";
  const halfLength = Math.floor(length / 2);
  const remainingLength = length - halfLength;

  // Add halfLength random letters
  for (let i = 0; i < halfLength; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    result += letters[randomIndex];
  }

  // Add remainingLength random numbers
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result += numbers[randomIndex];
  }

  return result;
}

module.exports = generateRandomPassword;
