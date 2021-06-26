const crypto = require("crypto");

const passwordUtils = function () {
  const pwUtils = {};

  pwUtils.generatePassword = function (password) {
    let salt = crypto.randomBytes(32).toString("hex");
    let genHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");

    return {
      salt: salt,
      hash: genHash,
    };
  };

  pwUtils.validatePassword = function (password, hash, salt) {
    var hashVerify = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    return hash === hashVerify;
  };

  return pwUtils;
};

module.exports = passwordUtils();
