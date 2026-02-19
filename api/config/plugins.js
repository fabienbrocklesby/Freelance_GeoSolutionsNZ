module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "strapi",
      providerOptions: {
        apiKey: env("RESEND_API_KEY"),
      },
      settings: {
        defaultFrom: env("EMAIL_FROM", "noreply@geosolutions.nz"),
        defaultReplyTo: env("EMAIL_REPLY_TO", "info@geosolutions.nz"),
      },
    },
  },
  "import-export-entries": {
    enabled: true,
    config: {},
  },
  "user-guide": {
    enabled: true,
    resolve: "./src/plugins/user-guide",
  },
});
