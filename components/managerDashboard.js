// "use client";
// import { useEffect, useState } from "react";

// export default function ManagerDashboard() {
//   const [progress, setProgress] = useState(0);
//   const [comment, setComment] = useState("");
//   const [updates, setUpdates] = useState([]);
//   const [roomId, setRoomId] = useState("");
//   const [token, setToken] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const t = localStorage.getItem("token");
//     if (!t) { window.location.href = "/"; return; }
//     setToken(t);
//     try {
//       const payload = JSON.parse(atob(t.split('.')[1]));
//       setRoomId(payload.roomId || "");
//       if (payload.roomId) fetchUpdates(payload.roomId, t);
//     } catch {}
//   }, []);

//   const fetchUpdates = async (rid, tkn) => {
//     try {
//       const res = await fetch(`/api/project-status?roomId=${rid}`);
//       const data = await res.json();
//       if (data.success) setUpdates(data.statuses || []);
//     } catch (e) {}
//   };

//   const submitUpdate = async () => {
//     try {
//       setError("");
//       const res = await fetch('/api/project-status', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ roomId, progressPercent: Number(progress), comment })
//       });
//       const data = await res.json();
//       if (!data.success) { setError(data.error || 'Failed'); return; }
//       setComment("");
//       fetchUpdates(roomId, token);
//     } catch (e) {
//       setError('Failed to submit');
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
//       <p className="text-gray-600 mb-4">Room: {roomId}</p>
//       {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

//       <div className="border rounded p-4 mb-6">
//         <h2 className="text-xl font-semibold mb-3">Post Progress Update</h2>
//         <div className="flex items-center gap-3 mb-3">
//           <label className="text-sm">Progress (%)</label>
//           <input type="number" min="0" max="100" className="border p-2 w-24" value={progress} onChange={(e)=>setProgress(e.target.value)} />
//         </div>
//         <textarea className="border p-2 w-full mb-3" rows={3} placeholder="Comment" value={comment} onChange={(e)=>setComment(e.target.value)} />
//         <button onClick={submitUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Save Update</button>
//       </div>

//       <h2 className="text-xl font-semibold mb-2">Recent Updates</h2>
//       {updates.length === 0 ? <p className="text-gray-500">No updates yet.</p> : (
//         <div className="space-y-3">
//           {updates.map(u => (
//             <div key={u._id} className="border rounded p-3 bg-white">
//               <div className="flex justify-between text-sm text-gray-600 mb-1">
//                 <span>By: {u.updatedBy?.name || u.updatedBy?.email || 'Unknown'}</span>
//                 <span>{new Date(u.createdAt).toLocaleString()}</span>
//               </div>
//               <div className="flex items-center gap-3 mb-1">
//                 <span className="font-semibold">Progress:</span>
//                 <span>{u.progressPercent}%</span>
//               </div>
//               {u.comment && <p className="text-gray-800 whitespace-pre-wrap">{u.comment}</p>}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";

function ManagerDashboard() {
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-purple-100/20 via-transparent to-purple-200/20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative p-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent mb-2">Manager Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-purple-700 font-medium">Room:</span>
            <span className="px-3 py-1 bg-purple-900 text-white rounded-lg font-mono text-sm">{roomId}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6 shadow-lg">
            {error}
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/50 to-transparent rounded-bl-full"></div>
          <h2 className="text-2xl font-bold text-purple-900 mb-4 relative">Post Progress Update</h2>
          
          <div className="space-y-4 relative">
            <div className="flex items-center gap-4">
              <label className="text-purple-800 font-medium min-w-fit">Progress (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="border-2 border-purple-200 rounded-lg p-3 w-32 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50" 
                value={progress} 
                onChange={(e)=>setProgress(e.target.value)} 
              />
              <div className="flex-1 bg-purple-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-purple-800 h-full transition-all duration-500 rounded-full"
                  style={{width: `${Math.min(progress, 100)}%`}}
                ></div>
              </div>
            </div>
            
            <div>
              <label className="text-purple-800 font-medium block mb-2">Comment</label>
              <textarea 
                className="border-2 border-purple-200 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 resize-none" 
                rows={3} 
                placeholder="Enter your update comment..." 
                value={comment} 
                onChange={(e)=>setComment(e.target.value)} 
              />
            </div>
            
            <button 
              onClick={submitUpdate} 
              className="relative group w-full sm:w-auto"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-purple-800 to-purple-900 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-xl transition-all">
                Save Update
              </div>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-purple-900">Recent Updates</h2>
        </div>
        
        {updates.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200 p-8 text-center">
            <svg className="mx-auto h-16 w-16 text-purple-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-purple-600 font-medium">No updates yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map(u => (
              <div key={u._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200 p-5 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-600 to-purple-900"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start text-sm text-purple-700 mb-3 relative">
                  <span className="font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {u.updatedBy?.name || u.updatedBy?.email || 'Unknown'}
                  </span>
                  <span className="text-purple-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(u.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-3 relative">
                  <span className="font-semibold text-purple-900">Progress:</span>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex-1 bg-purple-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-purple-800 h-full rounded-full"
                        style={{width: `${u.progressPercent}%`}}
                      ></div>
                    </div>
                    <span className="font-bold text-purple-800 min-w-fit">{u.progressPercent}%</span>
                  </div>
                </div>
                
                {u.comment && (
                  <p className="text-gray-800 whitespace-pre-wrap bg-purple-50/50 rounded-lg p-3 border-l-2 border-purple-300 relative">
                    {u.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;