const { consumeFromQueue, sendToQueue } = require("../config/rabbitmq");

const generateResetToken = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let token = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    token += charset[randomIndex];
  }

  return token;
};

exports.sendMailToQueue = async (msg) => {
  const resetToken = generateResetToken();
  return await sendToQueue("emailQueue", {
    ...msg,
    resetToken,
  });
};

exports.sendResetPasswordEmail = async () => {
  setTimeout(async () => {
    consumeFromQueue("emailQueue", async (messageContent) => {
      console.log(`Simulating email to ${messageContent.email}`);
      console.log(
        `Reset URL: ${process.env.FRONTEND_URL}/reset-password?token=${messageContent.resetToken}`
      );
      console.log("Email sent successfully");
    });
  }, 5000);
};
