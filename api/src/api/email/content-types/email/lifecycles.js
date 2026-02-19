const { Resend } = require("resend");

module.exports = {
  async afterCreate(event) {
    const { result } = event;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      strapi.log.warn("[email] RESEND_API_KEY not set — skipping email send.");
      return;
    }

    const fileText = result.FileName
      ? `\nFile is included, check admin dashboard. FileName: ${result.FileName}`
      : "";

    const toAddress = process.env.EMAIL_NOTIFICATIONS_TO || "fabienbrocklesby@icloud.com";
    const fromAddress = process.env.EMAIL_FROM || "noreply@geosolutions.nz";

    try {
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [toAddress],
        subject: `Contact Form: ${result.Subject}`,
        text: `Name: ${result.Name}\nEmail: ${result.FromEmail}\nSubject: ${result.Subject}\n\nMessage:\n${result.Message}${fileText}`,
      });

      if (error) {
        strapi.log.error(`[email] Resend API error: ${JSON.stringify(error)}`);
        return;
      }

      strapi.log.info(`[email] Contact email sent to ${toAddress} — id: ${data?.id}`);
    } catch (err) {
      strapi.log.error(`[email] Failed to send contact email: ${err.message}`);
    }
  },
};
