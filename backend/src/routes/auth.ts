import bcrypt from "bcrypt";
import { Admin } from "../models/index.js";
import jwt from "jsonwebtoken";

export default async function authRoutes(fastify) {
  fastify.post("/login", async (request, reply) => {
    try {
      const { username, password } = request.body || {};
      if (!username || !password) {
        return reply.code(400).send({ error: "Username and password required" });
      }

      const admin = await Admin.findOne({ where: { username } });
      if (!admin) {
        return reply.code(401).send({ error: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) return reply.code(401).send({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: admin.role || "admin" },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "4h" }
      );

      return reply.send({ ok: true, token, role: admin.role || "admin" });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: "Login failed" });
    }
  });
}
