const { NODE_ENV } = process.env;

const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  disable: NODE_ENV === "development",
  dest: "public",
  runtimeCaching,
});


module.exports = withPWA({
  
});
