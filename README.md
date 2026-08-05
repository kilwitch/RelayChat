# <img src="frontend/public/images/logo.png" width="36" height="36" alt="RelayChat Logo" align="center"/> RelayChat

> **High-Throughput, Event-Driven Real-Time Chat Platform**  
> Built with **Next.js**, **Node.js (TypeScript)**, **Apache Kafka**, **Redis Streams**, **Socket.IO**, and **PostgreSQL**.

---

## 📌 Overview

**RelayChat** is a scalable, real-time messaging application designed for high-concurrency environments. It utilizes an event-driven architecture powered by **Apache Kafka** for asynchronous message persistence and **Redis Streams** for scaling WebSocket connections across multi-node server clusters.

---

## 🔥 Key Features

- **⚡ Sub-Second Messaging**: Low-latency bidirectional WebSocket communication via **Socket.IO**.
- **🔄 Event-Driven Pipeline**: High-throughput message ingestion decoupled via **Apache Kafka** producer/consumer pipelines.
- **🌐 Distributed WebSockets**: **Redis Stream Adapter** enables horizontal scaling of Socket.IO instances.
- **🔒 Passcode-Protected Rooms**: Secure chat room creation, user joining, and dynamic authentication.
- **📁 Media & File Attachments**: Cloudinary & Multer integration for uploading images and document attachments.
- **🔑 OAuth Authentication**: NextAuth.js integration for social logins (Google, GitHub).
- **🎨 Modern & Responsive UI**: Built with **Next.js**, **Tailwind CSS**, and **Radix UI / Shadcn**.

---

## 📦 Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | Next.js (App Router), React 19, TypeScript, Tailwind CSS, Radix UI / Shadcn, Socket.io-Client, NextAuth.js |
| **Backend** | Node.js, Express.js, TypeScript, Socket.IO, Prisma ORM |
| **Messaging & Caching** | Apache Kafka (KafkaJS), Redis (ioredis & `@socket.io/redis-streams-adapter`) |
| **Database & Storage** | PostgreSQL, Cloudinary (Media Storage), Multer |

---

## 🚀 Quick Start

```bash
# 1. Clone & setup backend
git clone https://github.com/your-username/relay-chat.git
cd relay-chat/backend && npm install
npx prisma db push && npm run dev

# 2. Open new terminal & setup frontend
cd relay-chat/frontend && npm install
npm run dev