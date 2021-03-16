const crypto = require("crypto");
const environments = require("./environments");

const utilities = {};

utilities.parseJSON = (jsonString) => {
  let output = {};
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");

    return hash;
  }
};

utilities.creatRandomString = (strlength) => {
  let length = strlength;
  length = typeof strlength === "number" && strlength > 0 ? strlength : false;
  if (length) {
    let possiblecharacters = "abcdefghijklmnopqrstuvwxyz";
    let output = "";
    for (let i = 1; i <= length; i++) {
      let randomCharacter = possiblecharacters.charAt(
        Math.floor(Math.random() * possiblecharacters.length)
      );
      output += randomCharacter;
    }
    return output;
  } else {
    return false;
  }
};

module.exports = utilities;
