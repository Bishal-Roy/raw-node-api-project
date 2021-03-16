const { sampleHandler } = require("./handelers/routerHandeler/sampleHandeler");
const { userHandler } = require("./handelers/routerHandeler/userHandeler");
const { tokenHandler } = require("./handelers/routerHandeler/tokenHandler");
const { checkHandler } = require("./handelers/routerHandeler/checkHandler");


const routes = {
  user: userHandler,
  sample: sampleHandler,
  token: tokenHandler,
  check: checkHandler
};
module.exports = routes;
