// "use client";

// import { useEffect, useState } from "react";

// export default function DeveloperDashboard() {
//   const [srsDocs, setSrsDocs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");
//   if (!token) {
//     window.location.href = "/register";
//   }

//   const payload = JSON.parse(atob(token.split(".")[1]));
//   const roomId = payload.roomId;

//   const fetchSrs = async () => {
//     try {
//       const res = await fetch(`/api/srs/room/${roomId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) setSrsDocs(data.srsDocuments || []);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSrs();
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Developer Dashboard</h1>
//       <h2 className="text-xl font-semibold mb-2">SRS Documents</h2>
//       {srsDocs.length === 0 && <p>No SRS documents yet.</p>}
//       {srsDocs.map((doc) => (
//         <div key={doc._id} className="border p-4 rounded mb-2">
//           <p className="text-gray-700">{doc.versions[doc.versions.length - 1].content}</p>
//           <p className="text-sm text-gray-400">
//             Last updated: {new Date(doc.versions[doc.versions.length - 1].createdAt).toLocaleString()}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// components/developerDashboard.js
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