import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MISView() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students");

  const fetchData = async (type: "students" | "teachers") => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3001/api/mis/${type}`);
      setData(res.data || []);
    } catch (err) {
      console.error(`Failed to fetch MIS ${type}`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">MIS Data</h1>

      <div className="flex space-x-3 mb-6">
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 rounded-md font-medium transition ${
            activeTab === "students"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Students
        </button>

        <button
          onClick={() => setActiveTab("teachers")}
          className={`px-4 py-2 rounded-md font-medium transition ${
            activeTab === "teachers"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Teachers
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading {activeTab}...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key) => (
                    <th
                      key={key}
                      className="text-left px-4 py-2 border-b text-sm font-medium text-gray-700"
                    >
                      {key.replace(/_/g, " ").toUpperCase()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 transition text-sm text-gray-700"
                  >
                    {Object.values(row).map((val: any, j) => (
                      <td key={j} className="px-4 py-2 border-b">
                        {val ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    No {activeTab} data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
