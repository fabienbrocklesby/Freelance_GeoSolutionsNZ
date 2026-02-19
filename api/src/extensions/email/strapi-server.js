/**
 * Custom Resend email provider using the official SDK.
 * Completely replaces the built-in email provider at bootstrap.
 */
const { Resend } = require("resend");

module.exports = (plugin) => {
  plugin.bootstrap = async ({ strapi }) => {
    const apiKey = strapi.config.get("plugin.email.config.providerOptions.apiKey");
    const settings = strapi.config.get("plugin.email.config.settings", {});

    if (!apiKey) {
      strapi.log.warn("[email] RESEND_API_KEY is not set — emails will not be sent.");
      // Set a no-op provider so Strapi doesn't crash
      strapi.plugin("email").provider = {
        send: async () => {
          strapi.log.warn("[email] Skipped — no API key configured.");
        },
      };
      return;
    }

    const resend = new Resend(apiKey);

    strapi.plugin("email").provider = {
      send: async (options) => {
        const { from, to, subject, text, html, replyTo, cc, bcc } = options;

        const payload = {
          from: from || settings.defaultFrom,
          to: Array.isArray(to) ? to : [to],
          subject,
          ...(html ? { html } : { text }),
          ...(replyTo && { reply_to: replyTo }),
          ...(cc && { cc: Array.isArray(cc) ? cc : [cc] }),
          ...(bcc && { bcc: Array.isArray(bcc) ? bcc : [bcc] }),
        };

        strapi.log.info(`[email] Sending to ${payload.to.join(", ")} — subject: "${subject}"`);

        const { data, error } = await resend.emails.send(payload);

        if (error) {
          strapi.log.error(`[email] Resend API error: ${JSON.stringify(error)}`);
          throw new Error(`Resend error: ${error.message || JSON.stringify(error)}`);
        }

        strapi.log.info(`[email] Sent successfully — id: ${data?.id}`);
        return data;
      },
    };

    strapi.log.info("[email] Resend provider initialized.");
  };

  return plugin;
};
