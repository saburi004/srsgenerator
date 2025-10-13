
"use client";

import { useEffect, useState } from "react";

export default function DeveloperDashboard() {
  const [srsDocs, setSrsDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [token, setToken] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    // Only run on client side
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/register";
      return;
    }
    
    setToken(token);
    
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRoomId(payload.roomId);
    } catch (error) {
      console.error("Invalid token:", error);
      window.location.href = "/register";
    }
  }, []);

  const fetchSrs = async () => {
    if (!token || !roomId) return;

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

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim() || !token || !roomId) return;

    setIsQuerying(true);
    setAnswer("");
    setSources([]);

    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, roomId }),
      });

      const data = await res.json();
      
      if (data.success) {
        setAnswer(data.answer);
        setSources(data.sources || []);
      } else {
        setAnswer("Error: " + data.message);
      }
    } catch (error) {
      console.error("Query error:", error);
      setAnswer("Error processing your query");
    } finally {
      setIsQuerying(false);
    }
  };

  useEffect(() => {
    if (token && roomId) {
      fetchSrs();
    }
  }, [token, roomId]);

  if (loading || !token || !roomId) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Developer Dashboard</h1>
      
      {/* Query Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ask about your SRS</h2>
        <form onSubmit={handleQuery} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your software requirements..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isQuerying}
            />
            <button
              type="submit"
              disabled={isQuerying || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isQuerying ? "Asking..." : "Ask"}
            </button>
          </div>
        </form>

        {answer && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Answer:</h3>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="whitespace-pre-wrap">{answer}</p>
            </div>
          </div>
        )}

        {sources.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Sources:</h3>
            <div className="space-y-3">
              {sources.map((source, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <p className="text-sm text-gray-600 mb-1">
                    {source.metadata.title} (v{source.metadata.version}) - Score: {source.metadata.score}
                  </p>
                  <p className="text-gray-700">{source.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SRS Documents Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">SRS Documents</h2>
        {srsDocs.length === 0 && <p className="text-gray-500">No SRS documents yet.</p>}
        <div className="space-y-4">
          {srsDocs.map((doc) => {
            const latestVersion = doc.versions[doc.versions.length - 1];
            return (
              <div key={doc._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{doc.title || "Untitled Document"}</h3>
                <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                  {latestVersion.content}
                </p>
                <p className="text-sm text-gray-500">
                  Version {latestVersion.version} • Last updated:{" "}
                  {new Date(latestVersion.createdAt).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";

// export default function DeveloperDashboard() {
//   const [srsDocs, setSrsDocs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [query, setQuery] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [sources, setSources] = useState([]);
//   const [isQuerying, setIsQuerying] = useState(false);
//   const [token, setToken] = useState(null);
//   const [roomId, setRoomId] = useState(null);
//   const [activeSection, setActiveSection] = useState("home");
//   const [userData, setUserData] = useState(null);
//   const [homeLoading, setHomeLoading] = useState(false);

//   useEffect(() => {
//     // Only run on client side
//     const token = localStorage.getItem("token");
//     if (!token) {
//       window.location.href = "/register";
//       return;
//     }
    
//     setToken(token);
    
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const currentRoomId = localStorage.getItem('currentRoomId');
//       if (currentRoomId) {
//         setRoomId(currentRoomId);
//         loadRoomData(currentRoomId);
//       }
      
//       // Fetch user data and rooms
//       fetchUserData();
//       setLoading(false);
//     } catch (error) {
//       console.error("Invalid token:", error);
//       window.location.href = "/register";
//     }
//   }, []);

//   // Fetch user data including rooms
//   const fetchUserData = async () => {
//     if (!token) return;

//     setHomeLoading(true);
//     try {
//       const response = await fetch('/api/users/me', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUserData(data);
//       }
//     } catch (err) {
//       console.error("Fetch user data error:", err);
//     } finally {
//       setHomeLoading(false);
//     }
//   };

//   // Load room-specific data
//   const loadRoomData = async (roomIdToLoad) => {
//     if (!token || !roomIdToLoad) return;

//     try {
//       const srsRes = await fetch(`/api/srs/room/${roomIdToLoad}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       const srsData = await srsRes.json();
//       if (srsData.success) {
//         setSrsDocs(srsData.srsDocuments || []);
//       }
//     } catch (err) {
//       console.error("Load room data error:", err);
//     }
//   };

//   // Join a room
//   // Join a room
// const joinRoom = async (roomIdToJoin) => {
//   if (!token || !roomIdToJoin) return;

//   try {
//     // Use your actual API endpoint structure
//     const response = await fetch(`/api/rooms/${roomIdToJoin}`, {
//       method: 'POST', // or 'GET' depending on what your endpoint supports
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();
    
//     if (data.success) {
//       setRoomId(roomIdToJoin);
//       localStorage.setItem('currentRoomId', roomIdToJoin);
//       await loadRoomData(roomIdToJoin);
//       setActiveSection("query");
//     }
//   } catch (err) {
//     console.error("Join room error:", err);
//     // Fallback: set room locally if API fails
//     setRoomId(roomIdToJoin);
//     localStorage.setItem('currentRoomId', roomIdToJoin);
//     await loadRoomData(roomIdToJoin);
//     setActiveSection("query");
//   }
// };

//   const fetchSrs = async () => {
//     if (!token || !roomId) return;

//     try {
//       const res = await fetch(`/api/srs/room/${roomId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) setSrsDocs(data.srsDocuments || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleQuery = async (e) => {
//     e.preventDefault();
//     if (!query.trim() || !token || !roomId) return;

//     setIsQuerying(true);
//     setAnswer("");
//     setSources([]);

//     try {
//       const res = await fetch("/api/rag", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ query, roomId }),
//       });

//       const data = await res.json();
      
//       if (data.success) {
//         setAnswer(data.answer);
//         setSources(data.sources || []);
//       } else {
//         setAnswer("Error: " + data.message);
//       }
//     } catch (error) {
//       console.error("Query error:", error);
//       setAnswer("Error processing your query");
//     } finally {
//       setIsQuerying(false);
//     }
//   };

//   useEffect(() => {
//     if (token && roomId) {
//       fetchSrs();
//     }
//   }, [token, roomId]);

//   if (loading || !token) return (
//     <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #1a0f2e 100%)'}}>
//       <p className="text-xl font-semibold text-white">Loading...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen flex" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #1a0f2e 100%)'}}>
//       {/* Sidebar Navigation */}
//       <div className="w-64 backdrop-blur-sm bg-white/20 p-6 border-r border-white/30">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-white">Developer Dashboard</h1>
//           {roomId && (
//             <p className="text-sm mt-2 text-purple-200">Room: {roomId}</p>
//           )}
//         </div>
        
//         <nav className="space-y-2">
//           <button
//             onClick={() => setActiveSection("home")}
//             className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
//               activeSection === "home" 
//                 ? "shadow-lg scale-105" 
//                 : "hover:scale-105"
//             }`}
//             style={{
//               background: activeSection === "home" 
//                 ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
//                 : 'rgba(255, 255, 255, 0.3)',
//               color: activeSection === "home" ? '#FFFFFF' : '#3E1E68',
//               backdropFilter: 'blur(10px)'
//             }}
//           >
//             🏠 Home/Profile
//           </button>
          
//           <button
//             onClick={() => setActiveSection("query")}
//             disabled={!roomId}
//             className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
//               activeSection === "query" 
//                 ? "shadow-lg scale-105" 
//                 : "hover:scale-105"
//             } ${!roomId ? 'opacity-50 cursor-not-allowed' : ''}`}
//             style={{
//               background: activeSection === "query" 
//                 ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
//                 : 'rgba(255, 255, 255, 0.3)',
//               color: activeSection === "query" ? '#FFFFFF' : '#3E1E68',
//               backdropFilter: 'blur(10px)'
//             }}
//           >
//             🤖 Query Bot
//           </button>
          
//           <button
//             onClick={() => setActiveSection("srs")}
//             disabled={!roomId}
//             className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
//               activeSection === "srs" 
//                 ? "shadow-lg scale-105" 
//                 : "hover:scale-105"
//             } ${!roomId ? 'opacity-50 cursor-not-allowed' : ''}`}
//             style={{
//               background: activeSection === "srs" 
//                 ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
//                 : 'rgba(255, 255, 255, 0.3)',
//               color: activeSection === "srs" ? '#FFFFFF' : '#3E1E68',
//               backdropFilter: 'blur(10px)'
//             }}
//           >
//             📋 SRS Documents
//           </button>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         <div className="max-w-6xl mx-auto">
          
//           {/* Home/Profile Section */}
//           {activeSection === "home" && (
//             <div className="space-y-6">
//               {/* Room Selection Card */}
//               {!roomId && (
//                 <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//                   <h2 className="text-3xl font-bold mb-6 text-white">Select a Room</h2>
//                   <p className="text-purple-200 mb-6">
//                     Please select a room to access SRS documents and query functionality.
//                   </p>
//                 </div>
//               )}

//               {/* User Profile Card */}
//               <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//                 <div className="flex justify-between items-start mb-6">
//                   <h2 className="text-3xl font-bold text-white">Developer Profile</h2>
//                   <button
//                     onClick={fetchUserData}
//                     disabled={homeLoading}
//                     className="px-6 py-2 rounded-xl font-bold backdrop-blur-sm bg-white/20 transition-all shadow-lg hover:shadow-xl border-2 border-white/30 text-white disabled:opacity-50"
//                   >
//                     {homeLoading ? "Refreshing..." : "Refresh"}
//                   </button>
//                 </div>

//                 {homeLoading ? (
//                   <div className="text-center py-8">
//                     <div className="animate-spin text-4xl mb-3 text-white">⚙️</div>
//                     <p className="text-purple-200">Loading user data...</p>
//                   </div>
//                 ) : userData ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* User Information */}
//                     <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20">
//                       <h3 className="text-xl font-bold mb-4 text-white">Personal Information</h3>
//                       <div className="space-y-3">
//                         <div>
//                           <label className="text-sm font-semibold text-purple-200">Name</label>
//                           <p className="text-white text-lg">{userData.user.name || "Not provided"}</p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-semibold text-purple-200">Email</label>
//                           <p className="text-white text-lg">{userData.user.email}</p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-semibold text-purple-200">Role</label>
//                           <p className="text-white text-lg capitalize">{userData.user.role}</p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-semibold text-purple-200">Member Since</label>
//                           <p className="text-white text-lg">
//                             {new Date(userData.user.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Statistics */}
//                     <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20">
//                       <h3 className="text-xl font-bold mb-4 text-white">Project Statistics</h3>
//                       <div className="space-y-4">
//                         <div className="flex justify-between items-center">
//                           <span className="text-purple-200">Total Rooms</span>
//                           <span className="text-white font-bold text-xl">{userData.rooms.length}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-purple-200">User Role</span>
//                           <span className="text-white font-bold text-xl capitalize">{userData.user.role}</span>
//                         </div>
//                         {roomId && (
//                           <div className="flex justify-between items-center">
//                             <span className="text-purple-200">Current Room</span>
//                             <span className="text-white font-bold text-xl">{roomId}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <p className="text-purple-200 mb-4">No user data loaded yet</p>
//                     <button
//                       onClick={fetchUserData}
//                       className="text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
//                       style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
//                     >
//                       Load My Data
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Joined Rooms Section */}
//               {userData && userData.rooms.length > 0 && (
//                 <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//                   <h3 className="text-2xl font-bold mb-6 text-white">Your Rooms ({userData.rooms.length})</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {userData.rooms.map((room) => (
//                       <div 
//                         key={room.id} 
//                         className={`backdrop-blur-sm bg-white/10 rounded-xl p-6 border transition-transform ${
//                           room.roomId === roomId ? 'border-purple-400 scale-105 shadow-lg' : 'border-white/20 hover:scale-105'
//                         }`}
//                       >
//                         <h4 className="font-bold text-lg mb-3 text-white">Room: {room.roomId}</h4>
//                         {room.roomId === roomId && (
//                           <div className="mb-3">
//                             <span className="bg-purple-500/30 text-purple-200 text-xs font-bold px-2 py-1 rounded-full">
//                               Current Room
//                             </span>
//                           </div>
//                         )}
                        
//                         <div className="space-y-2 text-sm">
//                           <div>
//                             <span className="text-purple-200">Manager:</span>
//                             <p className="text-white font-semibold">{room.manager?.name || room.manager?.email}</p>
//                           </div>
                          
//                           <div>
//                             <span className="text-purple-200">Clients:</span>
//                             <p className="text-white">
//                               {room.clients?.length > 0 
//                                 ? room.clients.map(client => client.name || client.email).join(', ')
//                                 : 'No clients'
//                               }
//                             </p>
//                           </div>
                          
//                           <div>
//                             <span className="text-purple-200">Developers:</span>
//                             <p className="text-white">
//                               {room.developers?.length > 0
//                                 ? room.developers.map(dev => dev.name || dev.email).join(', ')
//                                 : 'No developers'
//                               }
//                             </p>
//                           </div>
//                         </div>

//                         <button
//                           onClick={() => joinRoom(room.roomId)}
//                           className="w-full mt-4 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg"
//                           style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
//                         >
//                           {room.roomId === roomId ? 'Current Room' : 'Switch to this Room'}
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Query Bot Section */}
//           {activeSection === "query" && roomId && (
//             <div className="mb-8">
//               <div className="backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//                 <h2 className="text-xl font-semibold mb-4 text-white">Ask about your SRS</h2>
//                 <form onSubmit={handleQuery} className="mb-4">
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={query}
//                       onChange={(e) => setQuery(e.target.value)}
//                       placeholder="Ask a question about your software requirements..."
//                       className="flex-1 p-3 border-2 rounded-lg focus:outline-none focus:ring-2 backdrop-blur-sm bg-white/10 text-white placeholder-purple-300"
//                       style={{borderColor: '#8B5CF6'}}
//                       disabled={isQuerying}
//                     />
//                     <button
//                       type="submit"
//                       disabled={isQuerying || !query.trim()}
//                       className="px-6 py-3 text-white rounded-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
//                       style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
//                     >
//                       {isQuerying ? "Asking..." : "Ask"}
//                     </button>
//                   </div>
//                 </form>
//               </div>

//               {answer && (
//                 <div className="backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//                   <h3 className="text-lg font-semibold mb-2 text-white">Answer:</h3>
//                   <div className="bg-white/10 p-4 rounded-lg border border-white/20">
//                     <p className="whitespace-pre-wrap text-white">{answer}</p>
//                   </div>
//                 </div>
//               )}

//               {sources.length > 0 && (
//                 <div className="backdrop-blur-sm rounded-2xl shadow-xl p-6" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//                   <h3 className="text-lg font-semibold mb-2 text-white">Sources:</h3>
//                   <div className="space-y-3">
//                     {sources.map((source, index) => (
//                       <div key={index} className="bg-white/10 p-4 rounded-lg border border-white/20">
//                         <p className="text-sm text-purple-200 mb-1">
//                           {source.metadata.title} (v{source.metadata.version}) - Score: {source.metadata.score}
//                         </p>
//                         <p className="text-white">{source.content}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* SRS Documents Section */}
//           {activeSection === "srs" && roomId && (
//             <div className="backdrop-blur-sm rounded-2xl shadow-xl p-6" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//               <h2 className="text-xl font-semibold mb-4 text-white">SRS Documents</h2>
//               {srsDocs.length === 0 && <p className="text-purple-200">No SRS documents yet.</p>}
//               <div className="space-y-4">
//                 {srsDocs.map((doc) => {
//                   const latestVersion = doc.versions[doc.versions.length - 1];
//                   return (
//                     <div key={doc._id} className="border border-white/20 rounded-lg p-4 backdrop-blur-sm bg-white/10 shadow-lg">
//                       <h3 className="font-semibold text-lg mb-2 text-white">{doc.title || "Untitled Document"}</h3>
//                       <p className="text-white mb-2 whitespace-pre-wrap">
//                         {latestVersion.content}
//                       </p>
//                       <p className="text-sm text-purple-200">
//                         Version {latestVersion.version} • Last updated:{" "}
//                         {new Date(latestVersion.createdAt).toLocaleString()}
//                       </p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }