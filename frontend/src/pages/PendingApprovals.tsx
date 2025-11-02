import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface ApprovalItem {
  id: number;
  source_type: "student" | "teacher";
  status: string;
  payload: any;
  requested_by: string;
  requested_at: string;
}

const PendingApprovals: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");
  const { token, isAdmin } = useAuth();

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/approvals/pending");
      setApprovals(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const doAction = async (id: number, action: "approve" | "reject") => {
    if (!isAdmin || !token) {
      alert("Only admin can perform this action. Please login as admin.");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (action === "approve") await axios.post(`http://localhost:3001/api/approvals/${id}/approve`, {}, { headers });
      else await axios.post(`http://localhost:3001/api/approvals/${id}/reject`, { remarks: "Rejected by admin" }, { headers });
      fetchApprovals();
    } catch (err) {
      console.error(`${action} failed`, err);
      alert(`${action} failed: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) return <p>Loading pending approvals...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const filtered = approvals.filter((a) => a.source_type === activeTab);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pending Approvals</h1>

      <div className="flex gap-3 mb-4">
        <button onClick={() => setActiveTab("student")} className={activeTab === "student" ? "bg-blue-600 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}>
          Students
        </button>
        <button onClick={() => setActiveTab("teacher")} className={activeTab === "teacher" ? "bg-blue-600 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}>
          Teachers
        </button>
      </div>

      {filtered.length === 0 ? (
        <p>No pending {activeTab}s found.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">ID</th>
              <th className="border p-2">{activeTab === "student" ? "Class" : "Designation"}</th>
              <th className="border p-2">School</th>
              <th className="border p-2">Requested By</th>
              <th className="border p-2">Requested At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const p = item.payload || {};
              return (
                <tr key={item.id}>
                  <td className="border p-2">{item.id}</td>
                  <td className="border p-2">{p.Name || p.name || "-"}</td>
                  <td className="border p-2">{p.student_id || p.teacher_id || "-"}</td>
                  <td className="border p-2">{p.Class || p.designation || "-"}</td>
                  <td className="border p-2">{p.School_Code || p.school_code || "-"}</td>
                  <td className="border p-2">{item.requested_by}</td>
                  <td className="border p-2">{new Date(item.requested_at).toLocaleString()}</td>
                  <td className="border p-2">
                    <button onClick={() => doAction(item.id, "approve")} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Approve</button>
                    <button onClick={() => doAction(item.id, "reject")} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingApprovals;
