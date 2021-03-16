const data = require("../../lib/data");
const { hash } = require("../../helper/utilities");
const { parseJSON } = require("../../helper/utilities");
const tokenHandler = require("./tokenHandler");

const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement
      ? requestProperties.body.tosAgreement
      : false;
  if (firstName && lastName && phone && password && tosAgreement) {
    data.read("users", phone, (err1) => {
      if (err1) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        data.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "user was created successfully",
            });
          } else {
            callback(500, { error: "could not create user" });
          }
        });
      } else {
        callback(500, {
          error: "there was a problem in server side",
        });
      }
    });
  } else {
    callback(400, {
      error: "you have a problem in your request",
    });
  }
};
handler._users.get = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // verify token
    const token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.read("users", phone, (err, u) => {
          const user = { ...parseJSON(u) };
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, {
              error: "Requested user was not found!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failure!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested user was not found!",
    });
  }
};
handler._users.put = (requestProperties, callback) => {
  //check the phone num is valid
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const firstName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      // verify token
      const token =
        typeof requestProperties.headerObject.token === "string"
          ? requestProperties.headerObject.token
          : false;
      tokenHandler._token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          // lookup the user
          data.read("users", phone, (err, uData) => {
            const userData = { ...parseJSON(uData) };
            if (!err && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = hash(password);
              }

              data.update("users", phone, userData, (err) => {
                if (!err) {
                  callback(200, { message: "user was updated successfully" });
                } else {
                  callback(500, {
                    error: "there was a problem in server side",
                  });
                }
              });
            } else {
              callback(400, {
                error: "you have a problem in your request",
              });
            }
          });
        } else {
          callback(403, {
            error: "Authentication failure!",
          });
        }
      });
    } else {
      callback(400, {
        error: "you have a problem in your request",
      });
    }
  } else {
    callback(400, {
      error: " invalid phone num please try again",
    });
  }
};
handler._users.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
        // verify token
        const token =
        typeof requestProperties.headerObject.token === "string"
          ? requestProperties.headerObject.token
          : false;
  
      tokenHandler._token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          data.read("users", phone, (err1, userData) => {
            console.log(userData);
            if (!err1 && userData) {
              data.delete("users", phone, (err2) => {
                if (!err2) {
                  callback(200, {
                    message: "user was successfully deleted",
                  });
                } else {
                  callback(500, {
                    erroe: "there was a server side error",
                  });
                }
              });
            } else {
              callback(500, {
                error: "there was a server side problem",
              });
            }
          });
        } else {
          callback(403, {
            error: "Authentication failure!",
          });
        }
      });

  } else {
    callback(400, { erroe: "there was a problem in your request" });
  }
};

module.exports = handler;
