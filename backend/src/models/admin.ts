import { DataTypes } from "sequelize";
import sequelize from "../plugins/db.js";

const Admin = sequelize.define(
  "Admin",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false }, // bcrypt hash
    role: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "admin" },
  },
  {
    tableName: "Admins",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default Admin;
