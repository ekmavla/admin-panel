import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<"student" | "teacher">("student");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      const ok = f.name.endsWith(".csv") || f.name.endsWith(".xlsx");
      if (!ok) {
        setError("Please upload CSV or XLSX file.");
        setFile(null);
        return;
      }
      setFile(f);
      setError(null);
    }
  };

  const doUpload = async (confirmDuplicates = false) => {
    if (!file) {
      setError("Select a file first");
      return;
    }
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const params = new URLSearchParams();
      params.set("type", type);
      if (confirmDuplicates) params.set("confirmDuplicates", "true");

      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await axios.post(`http://localhost:3001/api/upload/direct?${params.toString()}`, formData, {
        headers,
      });

      if (res.data?.duplicatesFound && !confirmDuplicates) {
        const proceed = window.confirm(
          `${res.data.message}\nOnly ${res.data.nonDuplicatesCount} non-duplicate records will be added.\nDo you want to continue?`
        );
        if (proceed) {
          return doUpload(true);
        } else {
          setResult({ message: "Upload cancelled by user." });
          return;
        }
      }

      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Upload failed (network/server).");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload MIS Data</h1>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block font-semibold">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="border p-2 rounded">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">File</label>
          <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} />
        </div>

        <div>
          <button onClick={() => doUpload(false)} disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        {result && (
          <div className="mt-4 p-3 border rounded bg-gray-50">
            <h3 className="font-semibold">Upload result</h3>
            {result.message && <div>{result.message}</div>}
            <div>Uploaded: {result.uploaded ?? 0}</div>
            <div>Duplicates Skipped: {result.duplicatesSkipped ?? 0}</div>
            <div>Failed (validation): {result.failed ?? 0}</div>

            {result.errors?.length > 0 && (
              <details className="mt-2">
                <summary>Errors ({result.errors.length})</summary>
                <ul className="pl-4 text-sm">
                  {result.errors.map((e: any, i: number) => (
                    <li key={i}>
                      {JSON.stringify(e.row)} — {e.reason}
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {result.insertedRecords?.length > 0 && (
              <details className="mt-2">
                <summary>Inserted records ({result.insertedRecords.length})</summary>
                <ul className="pl-4 text-sm">
                  {result.insertedRecords.map((r: any) => (
                    <li key={r.id}>id: {r.id} — {JSON.stringify(r.payload)}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
