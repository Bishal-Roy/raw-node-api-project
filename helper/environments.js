const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "dhfhfjdf",
  maxChecks: 5,
  twilio: {
    fromPhone: "+15005550006",
    accountSid: "ACdaae2ec08644b613849b9f3dca590748",
    authToken: "de9fa409a615b102079b5993b168660e",
  },
};
environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "shdjhsdhsdjh",
  maxChecks: 5,
  twilio: {
    fromPhone: "01946398363",
    accountSid: "ACdaae2ec08644b613849b9f3dca590748",
    authToken: "de9fa409a615b102079b5993b168660e",
  },
};

const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
