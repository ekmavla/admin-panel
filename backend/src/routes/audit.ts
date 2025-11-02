import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AuditTrail } from "../models/index.js";

export default async function auditRoutes(fastify: FastifyInstance) {
  fastify.get("/audit/logs", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const logs = await AuditTrail.findAll({
        order: [["createdAt", "DESC"]],
        limit: 200,
      });
      reply.send(logs);
    } catch (err) {
      const msg = err instanceof Error ? (err.stack ?? err.message) : String(err);
      fastify.log.error(`Error fetching audit logs: ${msg}`);
      reply.code(500).send({ error: "Failed to fetch audit logs" });
    }
  });
}
