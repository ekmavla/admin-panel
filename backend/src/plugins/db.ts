import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "admin_panel",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false, 
  }
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error("Unable to connect to MySQL:", err);
    process.exit(1);
  }
}

export default sequelize;
