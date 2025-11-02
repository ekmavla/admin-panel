import { FastifyInstance } from "fastify";
import {
  ApprovalRequest,
  MISTeacher,
  MISStudent,
  AuditTrail,
} from "../models/index.js";
import {
  parseCSVBuffer,
  parseXLSXBuffer,
  validateStudentRow,
  validateTeacherRow,
} from "../utils/csv.js";

export default async function uploadRoutes(fastify: FastifyInstance) {
  fastify.post("/upload/direct", { preHandler: [] }, async (req: any, reply) => {
    try {
      const file = await req.file();
      if (!file) {
        fastify.log.error("No file received in request");
        return reply.code(400).send({ error: "No file uploaded" });
      }

      const buffer = await file.toBuffer();
      const filename = file.filename.toLowerCase();

      let data: any[] = [];
      if (filename.endsWith(".csv")) {
        data = parseCSVBuffer(buffer);
      } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
        data = parseXLSXBuffer(buffer);
      } else {
        return reply.code(400).send({
          error: "Unsupported file format. Please upload CSV or XLSX.",
        });
      }

      if (!data.length) {
        return reply.code(400).send({ error: "No valid rows found in uploaded file" });
      }

      const cleanData = data.map((row) => {
        const cleanRow: Record<string, string> = {};
        for (const key in row) {
          const cleanKey = key.replace(/^\uFEFF/, "").trim().replace(/\s+/g, "_"); 
          cleanRow[cleanKey] = (row[key] || "").toString().trim();
        }
        return cleanRow;
      });

      // fastify.log.info({ sampleRow: cleanData[0] }, "First parsed row");

      const { type } = req.query;
      const entityType = (type || "").toString().toLowerCase();
      if (!["student", "teacher"].includes(entityType)) {
        return reply
          .code(400)
          .send({ error: "Invalid type (expected student or teacher)" });
      }

      const validRows = cleanData.filter((row) => {
        const validation =
          entityType === "student"
            ? validateStudentRow(row)
            : validateTeacherRow(row);
        return validation.ok;
      });

      if (!validRows.length) {
        return reply.code(400).send({
          error:
            "No valid records found. Please check required fields and remove empty rows.",
        });
      }

      fastify.log.info({
        totalRows: cleanData.length,
        validRows: validRows.length,
      });

      const { username, role } = req.user || {
        username: "guest",
        role: "teacher",
      };


      if (role === "admin") {
        let duplicatesFound: string[] = [];
        let newRecords: any[] = [];

        if (entityType === "student") {
          const ids = validRows.map((r) => r.student_id || r.Student_ID).filter(Boolean);
          const existing = await MISStudent.findAll({
            where: { student_id: ids },
            attributes: ["student_id"],
          });
          const existingIds = new Set(existing.map((e: any) => e.student_id));

          for (const row of validRows) {
            const sid = row.student_id || row.Student_ID;
            if (!sid || existingIds.has(sid)) {
              duplicatesFound.push(sid);
              continue;
            }
            newRecords.push({
              name: row.Name || row.name,
              class: row.Class || row.class,
              academic_year: row.Academic_Year || row.academic_year,
              student_id: sid,
              school_code: row.School_Code || row.school_code,
              status: "Approved",
            });
          }

          if (newRecords.length) await MISStudent.bulkCreate(newRecords);
        } else {
          const ids = validRows.map((r) => r.teacher_id || r.Teacher_ID).filter(Boolean);
          const existing = await MISTeacher.findAll({
            where: { teacher_id: ids },
            attributes: ["teacher_id"],
          });
          const existingIds = new Set(existing.map((e: any) => e.teacher_id));

          for (const row of validRows) {
            const tid = row.teacher_id || row.Teacher_ID;
            if (!tid || existingIds.has(tid)) {
              duplicatesFound.push(tid);
              continue;
            }
            newRecords.push({
              name: row.Name || row.name,
              teacher_id: tid,
              academic_year: row.Academic_Year || row.academic_year,
              school_code: row.School_Code || row.school_code,
              designation: row.Designation || row.designation,
              status: "Approved",
            });
          }

          if (newRecords.length) await MISTeacher.bulkCreate(newRecords);
        }

        await AuditTrail.create({
          user: username,
          action: "Approved Upload",
          details: {
            message: `Admin uploaded ${newRecords.length} ${entityType} records.`,
            duplicatesSkipped: duplicatesFound.length,
          },
        });

        return reply.send({
          success: true,
          uploaded: newRecords.length,
          duplicatesSkipped: duplicatesFound.length,
          message: `${newRecords.length} ${entityType} records approved. ${duplicatesFound.length} skipped (duplicates).`,
        });
      }

      const requests = validRows.map((r) => ({
        source_type: entityType,
        payload: r,
        status: "Pending",
        requested_by: username,
      }));

      await ApprovalRequest.bulkCreate(requests);

      await AuditTrail.create({
        user: username,
        action: "Pending Upload Request",
        details: {
          message: `Uploaded ${requests.length} ${entityType} records for approval.`,
        },
      });

      return reply.send({
        success: true,
        message: `${requests.length} ${entityType} records pending approval.`,
      });
    } catch (err: any) {
      fastify.log.error(err);
      return reply
        .code(500)
        .send({ error: "Upload failed", details: err.message });
    }
  });
}
