import { DataTypes } from "sequelize";
import sequelize from "../plugins/db.js";

const ApprovalRequest = sequelize.define(
  "ApprovalRequest",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    source_type: { type: DataTypes.STRING, allowNull: false },

    payload: { type: DataTypes.JSON },

    status: { type: DataTypes.STRING, defaultValue: "Pending" },

    requested_by: { type: DataTypes.STRING },

    approved_by: { type: DataTypes.STRING },

    approved_at: { type: DataTypes.DATE },

    remarks: { type: DataTypes.TEXT },

    requested_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: { type: DataTypes.DATE },
  },
  {
    tableName: "approval_requests",
    timestamps: false,
  }
);

export default ApprovalRequest;
