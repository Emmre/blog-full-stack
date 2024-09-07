const amqp = require("amqplib");
const { RABBITMQ_URL } = process.env;

let channel, connection;

const connectRabbitMQ = async (queueName, options = { durable: true }) => {
  if (connection && channel) {
    await channel.assertQueue(queueName, options);
    console.log(`Queue ${queueName} ensured with options:`, options);
    return;
  }

  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("RabbitMQ connection established");

    await channel.assertQueue(queueName, options);
    console.log(`Queue ${queueName} created with options:`, options);
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

const sendToQueue = async (queueName, msg, options = { persistent: true }) => {
  await connectRabbitMQ(queueName);

  if (!channel) {
    throw new Error("RabbitMQ channel is not available");
  }

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), options);
  console.log(`Message sent to ${queueName}`);
};

const consumeFromQueue = async (queueName, onMessage) => {
  await connectRabbitMQ(queueName);

  if (!channel) {
    throw new Error("RabbitMQ channel is not available");
  }

  console.log(`Waiting for messages in ${queueName}`);
  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      console.log("Received message:", msg.content.toString());
      const messageContent = JSON.parse(msg.content.toString());
      await onMessage(messageContent);
      channel.ack(msg);
    }
  });
};

module.exports = {
  connectRabbitMQ,
  sendToQueue,
  consumeFromQueue,
};
