import { DataTypes } from "sequelize";
import sequelize from "../plugins/db.js";

const MISTeacher = sequelize.define("MISTeacher", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING,
  teacher_id: DataTypes.STRING,
  academic_year: DataTypes.STRING,
  school_code: DataTypes.STRING,
  designation: DataTypes.STRING,
  created_by: DataTypes.STRING
}, {
  tableName: "mis_teachers",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

export default MISTeacher;
