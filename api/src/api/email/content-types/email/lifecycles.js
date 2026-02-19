module.exports = {
  async afterCreate(event) {
    const { result } = event;

    const fileText = result.FileName
      ? `\nFile is included, check admin dashboard. FileName: ${result.FileName}`
      : "";

    const toAddress = process.env.EMAIL_NOTIFICATIONS_TO || "fabienbrocklesby@icloud.com";
    const fromAddress = process.env.EMAIL_FROM || "noreply@geosolutions.nz";

    try {
      await strapi.plugin("email").provider.send({
        to: toAddress,
        from: fromAddress,
        subject: `Contact Form: ${result.Subject}`,
        text: `Name: ${result.Name}\nEmail: ${result.FromEmail}\nSubject: ${result.Subject}\n\nMessage:\n${result.Message}${fileText}`,
      });
      strapi.log.info(`[lifecycle] Contact email sent to ${toAddress}`);
    } catch (err) {
      strapi.log.error(`[lifecycle] Failed to send contact email: ${err.message}`);
    }
  },
};
