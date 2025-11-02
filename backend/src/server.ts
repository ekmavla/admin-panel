import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fastifyCors from "@fastify/cors";
import fastifyJWT from "@fastify/jwt";

import uploadRoutes from "./routes/upload.js";
import approvalsRoutes from "./routes/approvals.js";
import misRoutes from "./routes/mis.js";
import authRoutes from "./routes/auth.js";
import auditRoutes from "./routes/audit.js";
import { connectDB } from "./plugins/db.js";

const fastify = Fastify({ logger: true });

await connectDB();
fastify.log.info("MySQL connected successfully");

await fastify.register(fastifyCors, { origin: "*" });
await fastify.register(fastifyMultipart, {
  attachFieldsToBody: false,
  limits: { fileSize: 5 * 1024 * 1024 },
});

await fastify.register(fastifyJWT, {
  secret: process.env.JWT_SECRET,
});

fastify.decorate(
  "authenticate",
  async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  }
);

await fastify.register(authRoutes, { prefix: "/api/auth" });
await fastify.register(misRoutes, { prefix: "/api/mis" });
await fastify.register(approvalsRoutes, { prefix: "/api" });
await fastify.register(uploadRoutes, { prefix: "/api" });
await fastify.register(auditRoutes, { prefix: "/api" });

try {
  await fastify.listen({ port: 3001, host: "0.0.0.0" });
  console.log("Server running at http://localhost:3001");
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
