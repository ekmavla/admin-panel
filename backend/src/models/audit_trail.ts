import { DataTypes } from "sequelize";
import sequelize from "../plugins/db.js";

const AuditTrail = sequelize.define("AuditTrail", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  entity_type: DataTypes.STRING,
  entity_id: DataTypes.INTEGER,
  action: DataTypes.STRING,
  performed_by: DataTypes.STRING,
  details: DataTypes.JSON,
}, {
  tableName: "AuditTrail",
  timestamps: true, 
});

export default AuditTrail;
