module.exports = {
  async afterCreate(event) {
    const { result } = event;

    try {
      await strapi.plugins["email"].services.email.send({
        to: "fabienbrocklesby@icloud.com",
        from: "sendgrid@fabienbrocklesby.com",
        subject: result.Subject,
        text: `From: ${result.FromEmail} Message: ${result.Message}`,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
