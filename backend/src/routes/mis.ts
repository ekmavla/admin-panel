import { FastifyInstance } from "fastify";
import { MISStudent, MISTeacher } from "../models/index.js";

export default async function misRoutes(fastify: FastifyInstance) {
  fastify.get("/students", async (_req, _reply) => {
    try {
      const list = await MISStudent.findAll({
        order: [["created_at", "DESC"]], 
        limit: 1000,
      });
      return list;
    } catch (err) {
      fastify.log.error(err);
      return _reply.code(500).send({ error: "Failed to fetch MIS students" });
    }
  });

  fastify.get("/teachers", async (_req, _reply) => {
    try {
      const list = await MISTeacher.findAll({
        order: [["created_at", "DESC"]], 
        limit: 1000,
      });
      return list;
    } catch (err) {
      fastify.log.error(err);
      return _reply.code(500).send({ error: "Failed to fetch MIS teachers" });
    }
  });
}
