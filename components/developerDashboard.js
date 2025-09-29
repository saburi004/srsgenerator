"use client";

import { useEffect, useState } from "react";

export default function DeveloperDashboard() {
  const [srsDocs, setSrsDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/register";
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  const roomId = payload.roomId;

  const fetchSrs = async () => {
    try {
      const res = await fetch(`/api/srs/room/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSrsDocs(data.srsDocuments || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSrs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Developer Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">SRS Documents</h2>
      {srsDocs.length === 0 && <p>No SRS documents yet.</p>}
      {srsDocs.map((doc) => (
        <div key={doc._id} className="border p-4 rounded mb-2">
          <p className="text-gray-700">{doc.versions[doc.versions.length - 1].content}</p>
          <p className="text-sm text-gray-400">
            Last updated: {new Date(doc.versions[doc.versions.length - 1].createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
