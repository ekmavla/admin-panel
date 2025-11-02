import sequelize from "../plugins/db.js";
import UserModel from "./user.js"; 
import MISStudentModel from "./mis_student.js";
import MISTeacherModel from "./mis_teacher.js";
import ApprovalRequestModel from "./approval_request.js";
import AuditTrailModel from "./audit_trail.js";
import AdminModel from "./admin.js";

const User = UserModel;
const MISStudent = MISStudentModel;
const MISTeacher = MISTeacherModel;
const ApprovalRequest = ApprovalRequestModel;
const AuditTrail = AuditTrailModel;
const Admin = AdminModel;

export { sequelize, User, MISStudent, MISTeacher, ApprovalRequest, AuditTrail, Admin };
export default sequelize;
