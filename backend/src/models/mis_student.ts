import { DataTypes } from "sequelize";
import sequelize from "../plugins/db.js";

const MISStudent = sequelize.define("MISStudent", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  class: { type: DataTypes.STRING, allowNull: false }, 
  academic_year: { type: DataTypes.STRING, allowNull: false }, 
  student_id: { type: DataTypes.STRING, allowNull: false, unique: true },
  school_code: { type: DataTypes.STRING, allowNull: false },
  created_by: DataTypes.STRING,
}, {
  tableName: "mis_students",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

export default MISStudent;
