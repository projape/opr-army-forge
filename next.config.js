const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const { NODE_ENV } = process.env;

module.exports = withPWA({
  pwa: {
    disable: NODE_ENV === "development",
    dest: "public",
    runtimeCaching,
  },
});
