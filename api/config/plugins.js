module.exports = () => ({});
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: "sendgrid@fabienbrocklesby.com",
        defaultReplyTo: "sendgrid@fabienbrocklesby.com",
      },
    },
  },
  "import-export-entries": {
    enabled: true,
    config: {},
  },
});
