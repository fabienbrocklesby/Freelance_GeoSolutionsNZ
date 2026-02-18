module.exports = {
  async afterCreate(event) {
    const { result } = event;

    const fileText = result.FileName
      ? `File is included, check admin dashboard. FileName: ${result.FileName}`
      : "";

    const toAddress = process.env.EMAIL_NOTIFICATIONS_TO || "fabienbrocklesby@icloud.com";
    const fromAddress = process.env.EMAIL_FROM || "noreply@geosolutions.nz";

    try {
      await strapi.plugins["email"].services.email.send({
        to: toAddress,
        from: fromAddress,
        subject: result.Subject,
        text: `From: ${result.FromEmail} Message: ${result.Message}.   ${fileText}`,
      });
      console.log("Email sent successfully");
    } catch (err) {
      console.log("Error sending email:", err);
    }
  },
};
