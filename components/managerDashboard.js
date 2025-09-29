"use client";
import { useEffect, useState } from "react";

export default function ManagerDashboard() {
  const [progress, setProgress] = useState(0);
  const [comment, setComment] = useState("");
  const [updates, setUpdates] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) { window.location.href = "/"; return; }
    setToken(t);
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      setRoomId(payload.roomId || "");
      if (payload.roomId) fetchUpdates(payload.roomId, t);
    } catch {}
  }, []);

  const fetchUpdates = async (rid, tkn) => {
    try {
      const res = await fetch(`/api/project-status?roomId=${rid}`);
      const data = await res.json();
      if (data.success) setUpdates(data.statuses || []);
    } catch (e) {}
  };

  const submitUpdate = async () => {
    try {
      setError("");
      const res = await fetch('/api/project-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId, progressPercent: Number(progress), comment })
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || 'Failed'); return; }
      setComment("");
      fetchUpdates(roomId, token);
    } catch (e) {
      setError('Failed to submit');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
      <p className="text-gray-600 mb-4">Room: {roomId}</p>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="border rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Post Progress Update</h2>
        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm">Progress (%)</label>
          <input type="number" min="0" max="100" className="border p-2 w-24" value={progress} onChange={(e)=>setProgress(e.target.value)} />
        </div>
        <textarea className="border p-2 w-full mb-3" rows={3} placeholder="Comment" value={comment} onChange={(e)=>setComment(e.target.value)} />
        <button onClick={submitUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Save Update</button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Recent Updates</h2>
      {updates.length === 0 ? <p className="text-gray-500">No updates yet.</p> : (
        <div className="space-y-3">
          {updates.map(u => (
            <div key={u._id} className="border rounded p-3 bg-white">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>By: {u.updatedBy?.name || u.updatedBy?.email || 'Unknown'}</span>
                <span>{new Date(u.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold">Progress:</span>
                <span>{u.progressPercent}%</span>
              </div>
              {u.comment && <p className="text-gray-800 whitespace-pre-wrap">{u.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


