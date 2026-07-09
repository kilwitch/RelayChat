import {Kafka, logLevel} from "kafkajs"
import fs from "fs"

export const kafka= new Kafka({
    brokers: [process.env.KAFKA_BROKER!],
    ssl:{
        ca: [fs.readFileSync("./certificates/ca.pem", "utf8")],
    },
    sasl:{
        mechanism:'plain',
        username:process.env.KAFKA_USERNAME!,
        password:process.env.KAFKA_PASSWORD!,
    },
    logLevel:logLevel.ERROR,
})

export const producer=kafka.producer()
export const consumer=kafka.consumer({groupId:"chats"})

export const connectKafkaProvider= async()=>{
    await producer.connect();
    console.log('kafka producer connected..');
}