import prisma from "./config/db.config.js";
import { producer, consumer } from "./config/kafka.config.js";

export const produceMessage = async (topic: string, message: any) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

export const consumeMessages = async (topic: string) => {
  await consumer.connect();
  await consumer.subscribe({ topic: topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value!.toString());
        console.log({
          partition,
          offset: message.offset,
          value: data,
        });

        const { fileName, file, ...chatData } = data;
        await prisma.chats.create({
          data: {
            ...chatData,
            fileUrl: chatData.fileUrl || file || null,
          },
        });
      } catch (err: any) {
        console.error(`[Kafka Consumer] Skip message offset ${message.offset} (group deleted or invalid):`, err?.message || err);
      }
    },
  });
};