// // "use client";
// // import { useEffect, useState } from "react";

// // export default function ManagerDashboard() {
// //   const [progress, setProgress] = useState(0);
// //   const [comment, setComment] = useState("");
// //   const [updates, setUpdates] = useState([]);
// //   const [roomId, setRoomId] = useState("");
// //   const [token, setToken] = useState("");
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     const t = localStorage.getItem("token");
// //     if (!t) { window.location.href = "/"; return; }
// //     setToken(t);
// //     try {
// //       const payload = JSON.parse(atob(t.split('.')[1]));
// //       setRoomId(payload.roomId || "");
// //       if (payload.roomId) fetchUpdates(payload.roomId, t);
// //     } catch {}
// //   }, []);

// //   const fetchUpdates = async (rid, tkn) => {
// //     try {
// //       const res = await fetch(`/api/project-status?roomId=${rid}`);
// //       const data = await res.json();
// //       if (data.success) setUpdates(data.statuses || []);
// //     } catch (e) {}
// //   };

// //   const submitUpdate = async () => {
// //     try {
// //       setError("");
// //       const res = await fetch('/api/project-status', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ roomId, progressPercent: Number(progress), comment })
// //       });
// //       const data = await res.json();
// //       if (!data.success) { setError(data.error || 'Failed'); return; }
// //       setComment("");
// //       fetchUpdates(roomId, token);
// //     } catch (e) {
// //       setError('Failed to submit');
// //     }
// //   };

// //   return (
// //     <div className="p-6 max-w-3xl mx-auto">
// //       <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
// //       <p className="text-gray-600 mb-4">Room: {roomId}</p>
// //       {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

// //       <div className="border rounded p-4 mb-6">
// //         <h2 className="text-xl font-semibold mb-3">Post Progress Update</h2>
// //         <div className="flex items-center gap-3 mb-3">
// //           <label className="text-sm">Progress (%)</label>
// //           <input type="number" min="0" max="100" className="border p-2 w-24" value={progress} onChange={(e)=>setProgress(e.target.value)} />
// //         </div>
// //         <textarea className="border p-2 w-full mb-3" rows={3} placeholder="Comment" value={comment} onChange={(e)=>setComment(e.target.value)} />
// //         <button onClick={submitUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Save Update</button>
// //       </div>

// //       <h2 className="text-xl font-semibold mb-2">Recent Updates</h2>
// //       {updates.length === 0 ? <p className="text-gray-500">No updates yet.</p> : (
// //         <div className="space-y-3">
// //           {updates.map(u => (
// //             <div key={u._id} className="border rounded p-3 bg-white">
// //               <div className="flex justify-between text-sm text-gray-600 mb-1">
// //                 <span>By: {u.updatedBy?.name || u.updatedBy?.email || 'Unknown'}</span>
// //                 <span>{new Date(u.createdAt).toLocaleString()}</span>
// //               </div>
// //               <div className="flex items-center gap-3 mb-1">
// //                 <span className="font-semibold">Progress:</span>
// //                 <span>{u.progressPercent}%</span>
// //               </div>
// //               {u.comment && <p className="text-gray-800 whitespace-pre-wrap">{u.comment}</p>}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


"use client";
import { useEffect, useState } from "react";

function ManagerDashboard() {
  const [activeSection, setActiveSection] = useState("home");
  const [progress, setProgress] = useState(0);
  const [comment, setComment] = useState("");
  const [updates, setUpdates] = useState([]);
  const [srsDocs, setSrsDocs] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [homeLoading, setHomeLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) { window.location.href = "/"; return; }
    setToken(t);
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      const storedCurrent = localStorage.getItem('currentRoomId');
      const initialRoom = (storedCurrent || payload.roomId || '').toUpperCase();
      if (initialRoom) {
        setRoomId(initialRoom);
        localStorage.setItem('currentRoomId', initialRoom);
        loadRoomData(initialRoom, t);
      }
      // load profile for rooms list
      fetchUserData(t);
    } catch {}
  }, []);

  const fetchUserData = async (tkn) => {
    try {
      setHomeLoading(true);
      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${tkn}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (_) {
    } finally {
      setHomeLoading(false);
    }
  };

  const loadRoomData = async (rid, tkn) => {
    if (!rid || !tkn) return;
    try {
      const statusRes = await fetch(`/api/project-status?roomId=${rid}`);
      const statusData = await statusRes.json();
      if (statusData.success) setUpdates(statusData.statuses || []);
    } catch (_) {}
    try {
      const srsRes = await fetch(`/api/srs/room/${rid}`, {
        headers: { Authorization: `Bearer ${tkn}` },
      });
      const srsData = await srsRes.json();
      if (srsData.success) setSrsDocs(srsData.srsDocuments || []);
    } catch (_) {}
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
      loadRoomData(roomId, token);
    } catch (e) {
      setError('Failed to submit');
    }
  };

  const switchRoom = async (rid) => {
    setRoomId(rid);
    localStorage.setItem('currentRoomId', rid);
    await loadRoomData(rid, token);
    setActiveSection('changes');
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #1a0f2e 100%)'}}>
        <p className="text-xl font-semibold text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #1a0f2e 100%)'}}>
      {/* Sidebar */}
      <div className="w-64 backdrop-blur-sm bg-white/20 p-6 border-r border-white/30">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Manager Dashboard</h1>
          {roomId && (
            <p className="text-sm mt-2 text-purple-200">Room: {roomId}</p>
          )}
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveSection("home")}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeSection === "home" ? "shadow-lg scale-105" : "hover:scale-105"
            }`}
            style={{
              background: activeSection === "home" ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' : 'rgba(255, 255, 255, 0.3)',
              color: activeSection === "home" ? '#FFFFFF' : '#3E1E68',
              backdropFilter: 'blur(10px)'
            }}
          >
            🏠 Home/Profile
          </button>

          <button
            onClick={() => setActiveSection("changes")}
            disabled={!roomId}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeSection === "changes" ? "shadow-lg scale-105" : "hover:scale-105"
            } ${!roomId ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              background: activeSection === "changes" ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' : 'rgba(255, 255, 255, 0.3)',
              color: activeSection === "changes" ? '#FFFFFF' : '#3E1E68',
              backdropFilter: 'blur(10px)'
            }}
          >
            ✏️ Project Updates
          </button>

          <button
            onClick={() => setActiveSection("srs")}
            disabled={!roomId}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeSection === "srs" ? "shadow-lg scale-105" : "hover:scale-105"
            } ${!roomId ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              background: activeSection === "srs" ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' : 'rgba(255, 255, 255, 0.3)',
              color: activeSection === "srs" ? '#FFFFFF' : '#3E1E68',
              backdropFilter: 'blur(10px)'
            }}
          >
            📋 View SRS
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {activeSection === 'home' && (
            <div className="space-y-6">
              <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-white">Manager Profile</h2>
                  <button
                    onClick={() => fetchUserData(token)}
                    disabled={homeLoading}
                    className="px-6 py-2 rounded-xl font-bold backdrop-blur-sm bg-white/20 transition-all shadow-lg hover:shadow-xl border-2 border-white/30 text-white disabled:opacity-50"
                  >
                    {homeLoading ? "Refreshing..." : "Refresh"}
                  </button>
                </div>

                {homeLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin text-4xl mb-3 text-white">⚙️</div>
                    <p className="text-purple-200">Loading user data...</p>
                  </div>
                ) : userData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-bold mb-4 text-white">Personal Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-semibold text-purple-200">Name</label>
                          <p className="text-white text-lg">{userData.user.name || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-purple-200">Email</label>
                          <p className="text-white text-lg">{userData.user.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-purple-200">Role</label>
                          <p className="text-white text-lg capitalize">{userData.user.role}</p>
                        </div>
                        {roomId && (
                          <div>
                            <label className="text-sm font-semibold text-purple-200">Current Room</label>
                            <p className="text-white text-lg">{roomId}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20">
                      <h3 className="text-xl font-bold mb-4 text-white">Project Statistics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">Total Rooms</span>
                          <span className="text-white font-bold text-xl">{userData.rooms.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">User Role</span>
                          <span className="text-white font-bold text-xl capitalize">{userData.user.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {userData && userData.rooms.length > 0 && (
                <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
                  <h3 className="text-2xl font-bold mb-6 text-white">Your Rooms ({userData.rooms.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userData.rooms.map((room) => (
                      <div 
                        key={room.id} 
                        className={`backdrop-blur-sm bg-white/10 rounded-xl p-6 border transition-transform ${
                          room.roomId === roomId ? 'border-purple-400 scale-105 shadow-lg' : 'border-white/20 hover:scale-105'
                        }`}
                      >
                        <h4 className="font-bold text-lg mb-3 text-white">Room: {room.roomId}</h4>
                        {room.roomId === roomId && (
                          <div className="mb-3">
                            <span className="bg-purple-500/30 text-purple-200 text-xs font-bold px-2 py-1 rounded-full">
                              Current Room
                            </span>
                          </div>
                        )}
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-purple-200">Manager:</span>
                            <p className="text-white font-semibold">{room.manager?.name || room.manager?.email}</p>
                          </div>
                          <div>
                            <span className="text-purple-200">Clients:</span>
                            <p className="text-white">{room.clients?.length > 0 ? room.clients.map(c => c.name || c.email).join(', ') : 'No clients'}</p>
                          </div>
                          <div>
                            <span className="text-purple-200">Developers:</span>
                            <p className="text-white">{room.developers?.length > 0 ? room.developers.map(d => d.name || d.email).join(', ') : 'No developers'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => switchRoom(room.roomId)}
                          className="w-full mt-4 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg"
                          style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
                        >
                          {room.roomId === roomId ? 'Current Room' : 'Switch to this Room'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'changes' && roomId && (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl shadow-lg">
                  {error}
                </div>
              )}
              <div className="backdrop-blur-sm rounded-2xl shadow-xl p-6" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
                <h2 className="text-xl font-semibold mb-4 text-white">Post Progress Update</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-purple-200 font-medium min-w-fit">Progress (%)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      className="border-2 border-purple-300 rounded-lg p-3 w-32 focus:outline-none focus:ring-2 backdrop-blur-sm bg-white/10 text-white placeholder-purple-300" 
                      value={progress} 
                      onChange={(e)=>setProgress(e.target.value)} 
                    />
                    <div className="flex-1 bg-purple-900/40 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-full transition-all duration-500 rounded-full"
                        style={{width: `${Math.min(progress, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <label className="text-purple-200 font-medium block mb-2">Comment</label>
                    <textarea 
                      className="border-2 border-purple-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 backdrop-blur-sm bg-white/10 text-white placeholder-purple-300 resize-none" 
                      rows={3} 
                      placeholder="Enter your update comment..." 
                      value={comment} 
                      onChange={(e)=>setComment(e.target.value)} 
                    />
                  </div>
                  <button 
                    onClick={submitUpdate} 
                    className="px-6 py-3 text-white rounded-lg hover:shadow-xl transition-all shadow-lg"
                    style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
                  >
                    Save Update
                  </button>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2 text-white">Recent Updates</h2>
                {updates.length === 0 ? (
                  <div className="backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
                    <p className="text-purple-200">No updates yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {updates.map(u => (
                      <div key={u._id} className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-5">
                        <div className="flex justify-between text-sm text-purple-200 mb-2">
                          <span>By: {u.updatedBy?.name || u.updatedBy?.email || 'Unknown'}</span>
                          <span>{new Date(u.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-white">Progress:</span>
                          <div className="flex-1 bg-purple-900/40 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-full rounded-full" style={{width: `${u.progressPercent}%`}}></div>
                          </div>
                          <span className="font-bold text-purple-200 min-w-fit">{u.progressPercent}%</span>
                        </div>
                        {u.comment && (
                          <p className="text-white/90 whitespace-pre-wrap">{u.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'srs' && roomId && (
            <div className="backdrop-blur-sm rounded-2xl shadow-xl p-6" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
              <h2 className="text-xl font-semibold mb-4 text-white">SRS Documents</h2>
              {srsDocs.length === 0 && <p className="text-purple-200">No SRS documents yet.</p>}
              <div className="space-y-4">
                {srsDocs.map((doc) => {
                  const latestVersion = doc.versions[doc.versions.length - 1];
                  return (
                    <div key={doc._id} className="border border-white/20 rounded-lg p-4 backdrop-blur-sm bg-white/10 shadow-lg">
                      <h3 className="font-semibold text-lg mb-2 text-white">{doc.title || "Untitled Document"}</h3>
                      <p className="text-white mb-2 whitespace-pre-wrap">
                        {latestVersion.content}
                      </p>
                      <p className="text-sm text-purple-200">
                        Version {latestVersion.version} • Last updated: {new Date(latestVersion.createdAt).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
