module.exports = {
  async afterCreate(event) {
    const { result } = event;

    const fileText = result.FileName
      ? `File is included, check admin dashboard. FileName: ${result.FileName}`
      : "";

    try {
      await strapi.plugins["email"].services.email.send({
        to: "fabienbrocklesby@icloud.com",
        from: "sendgrid@fabienbrocklesby.com",
        subject: result.Subject,
        text: `From: ${result.FromEmail} Message: ${result.Message}.   ${fileText}`,
      });
      console.log("Email sent successfully");
    } catch (err) {
      console.log("Error sending email:", err);
    }
  },
};
