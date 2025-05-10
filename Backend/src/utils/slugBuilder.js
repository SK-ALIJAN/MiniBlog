module.exports = (value) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove special characters (keep only alphanumeric and spaces)
      .replace(/ /g, "-");
  };