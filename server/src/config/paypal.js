const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

function environment() {
  let clientId = process.env.PAYPAL_CLIENT_ID;
  let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret); // Thay SandboxEnvironment bằng LiveEnvironment trong môi trường sản xuất
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

module.exports = { client };
