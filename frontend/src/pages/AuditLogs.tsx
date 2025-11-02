import React, { useEffect, useState } from "react";
import axios from "axios";

interface AuditLog {
  id: number;
  entity_type: string;
  entity_id: number;
  action: string;
  performed_by: string;
  created_at: string;
  details?: any;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/audit/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading audit logs...</p>;
  if (error) return <p className="text-red-600 text-center mt-6">{error}</p>;

  const renderDetails = (details: any, action: string) => {
    if (!details) return <p className="text-gray-500">No details available</p>;

    const payload = details.payload || {};
    const recordName =
      payload.Name || payload.name || payload.student_id || payload.teacher_id;
    const reason = details.reason || details.remarks || "—";

    return (
      <div className="space-y-1 text-xs text-gray-700">
        <p>
          <strong>Record:</strong>{" "}
          {recordName ? recordName : "Unnamed record"}
        </p>
        {details.source_type && (
          <p>
            <strong>Type:</strong> {details.source_type}
          </p>
        )}
        {action === "REJECTED" && (
          <p className="text-red-600">
            <strong>Reason:</strong> {reason}
          </p>
        )}
        <details className="mt-1">
          <summary className="cursor-pointer text-blue-600">Full JSON</summary>
          <pre className="bg-gray-50 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(details, null, 2)}
          </pre>
        </details>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>

      {logs.length === 0 ? (
        <p className="text-gray-600">No audit logs found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-400 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Entity Type</th>
              <th className="border p-2">Entity ID</th>
              <th className="border p-2">Action</th>
              <th className="border p-2">Performed By</th>
              <th className="border p-2">Date / Time</th>
              <th className="border p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="border p-2 text-center">{log.id}</td>
                <td className="border p-2">{log.entity_type}</td>
                <td className="border p-2 text-center">{log.entity_id}</td>
                <td
                  className={`border p-2 font-semibold ${
                    log.action === "APPROVED"
                      ? "text-green-700"
                      : log.action === "REJECTED"
                      ? "text-red-700"
                      : "text-blue-700"
                  }`}
                >
                  {log.action}
                </td>
                <td className="border p-2">{log.performed_by}</td>
                <td className="border p-2">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="border p-2 align-top">
                  {renderDetails(log.details, log.action)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLogs;
