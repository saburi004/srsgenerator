// "use client";
// import { useEffect, useState } from "react";

// export default function ClientDashboard() {
//   const [srsDocs, setSrsDocs] = useState([]);
//   const [newContent, setNewContent] = useState("");
//   const [title, setTitle] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(null);
//   const [roomId, setRoomId] = useState(null);
//   const [mounted, setMounted] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!mounted) return;
    
//     const storedToken = localStorage.getItem("token");
//     if (!storedToken) {
//       window.location.href = "/register";
//       return;
//     }
    
//     setToken(storedToken);
    
//     try {
//       const payload = JSON.parse(atob(storedToken.split(".")[1]));
//       const userRoomId = payload.roomId;
//       setRoomId(userRoomId);

//       const fetchSrs = async () => {
//         try {
//           setError("");
//           // Use the new RESTful endpoint
//           const res = await fetch(`/api/srs/${userRoomId}`, {
//             headers: { Authorization: `Bearer ${storedToken}` },
//           });
          
//           const data = await res.json();
//           console.log("API Response:", data);
          
//           if (data.success) {
//             setSrsDocs(data.srsDocuments || []);
//           } else {
//             setError(`Failed to load SRS: ${data.error}`);
//             console.error("API Error:", data.error);
//           }
//         } catch (err) {
//           setError("Network error loading SRS documents");
//           console.error("Fetch error:", err);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchSrs();
//     } catch (err) {
//       console.error("Error parsing token:", err);
//       localStorage.removeItem("token");
//       window.location.href = "/register";
//     }
//   }, [mounted]);

//   const createSrs = async () => {
//     if (!newContent.trim() || !token || !roomId) {
//       alert("Please enter content and make sure you're authenticated");
//       return;
//     }

//     try {
//       setError("");
//       const res = await fetch("/api/srs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ 
//           roomId, 
//           content: newContent,
//           title: title.trim() || `SRS Document ${new Date().toLocaleDateString()}`
//         }),
//       });
      
//       const data = await res.json();
//       console.log("Create SRS response:", data);
      
//       if (data.success) {
//         // Refresh the SRS documents list
//         const refreshRes = await fetch(`/api/srs/${roomId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const refreshData = await refreshRes.json();
        
//         if (refreshData.success) {
//           setSrsDocs(refreshData.srsDocuments || []);
//         }
        
//         setNewContent("");
//         setTitle("");
//         alert("SRS document created successfully!");
//       } else {
//         setError(`Failed to create SRS: ${data.error}`);
//       }
//     } catch (err) {
//       setError("Error creating SRS document");
//       console.error("Create SRS error:", err);
//     }
//   };

//   if (!mounted || loading) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Client Dashboard - Room: {roomId}</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       {/* Create New SRS Section */}
//       <div className="mb-6 p-4 border rounded-lg bg-gray-50">
//         <h2 className="text-lg font-semibold mb-3">Create New SRS Document</h2>
        
//         <div className="mb-3">
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Document Title (optional)"
//             className="w-full border p-2 rounded mb-2"
//           />
//         </div>
        
//         <textarea
//           value={newContent}
//           onChange={(e) => setNewContent(e.target.value)}
//           placeholder="Write your SRS content here..."
//           className="w-full border p-2 rounded h-32"
//         />
        
//         <button
//           onClick={createSrs}
//           disabled={!newContent.trim()}
//           className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//         >
//           Create SRS Document
//         </button>
//       </div>

//       {/* Existing SRS Documents */}
//       <h2 className="text-xl font-semibold mb-2">SRS Documents ({srsDocs.length})</h2>
//       {srsDocs.length === 0 ? (
//         <p className="text-gray-500">No SRS documents created yet.</p>
//       ) : (
//         srsDocs.map((doc) => (
//           <div key={doc._id} className="border p-4 rounded mb-4 bg-white shadow">
//             <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>
//             <p className="text-gray-700 mb-2 whitespace-pre-wrap">
//               {doc.versions[doc.versions.length - 1].content}
//             </p>
//             <div className="text-sm text-gray-500 flex justify-between">
//               <span>
//                 Version: {doc.versions[doc.versions.length - 1].version}
//               </span>
//               <span>
//                 Author: {doc.versions[doc.versions.length - 1].author?.name || 'Unknown'}
//               </span>
//               <span>
//                 Last updated: {new Date(
//                   doc.versions[doc.versions.length - 1].createdAt
//                 ).toLocaleString()}
//               </span>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";

export default function ClientDashboard() {
  const [srsDocs, setSrsDocs] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  
  // AI Generation states
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("blue");
  const [generatedSRS, setGeneratedSRS] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [optionalRequirements, setOptionalRequirements] = useState([]);
  const [selectedOptional, setSelectedOptional] = useState([]);

  const colorThemes = [
    { name: "blue", primary: "#3B82F6", secondary: "#DBEAFE", text: "Blue Ocean" },
    { name: "green", primary: "#10B981", secondary: "#D1FAE5", text: "Fresh Green" },
    { name: "purple", primary: "#8B5CF6", secondary: "#EDE9FE", text: "Royal Purple" },
    { name: "orange", primary: "#F97316", secondary: "#FFEDD5", text: "Sunset Orange" },
    { name: "pink", primary: "#EC4899", secondary: "#FCE7F3", text: "Vibrant Pink" },
    { name: "teal", primary: "#14B8A6", secondary: "#CCFBF1", text: "Tropical Teal" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      window.location.href = "/register";
      return;
    }
    
    setToken(storedToken);
    
    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      const userRoomId = payload.roomId;
      setRoomId(userRoomId);

      const fetchSrs = async () => {
        try {
          setError("");
          const res = await fetch(`/api/srs/room/${userRoomId}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          
          const data = await res.json();
          console.log("API Response:", data);
          
          if (data.success) {
            setSrsDocs(data.srsDocuments || []);
          } else {
            setError(`Failed to load SRS: ${data.error}`);
            console.error("API Error:", data.error);
          }
          // Fetch manager status updates
          try {
            const stRes = await fetch(`/api/project-status?roomId=${userRoomId}`);
            const stData = await stRes.json();
            if (stData.success) setStatusUpdates(stData.statuses || []);
          } catch (_) {}
        } catch (err) {
          setError("Network error loading SRS documents");
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchSrs();
    } catch (err) {
      console.error("Error parsing token:", err);
      localStorage.removeItem("token");
      window.location.href = "/register";
    }
  }, [mounted]);

  const generateSRSWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a description for your project");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/groq/generate-srs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          theme: selectedTheme,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setGeneratedSRS(data.srs);
        setOptionalRequirements(data.optionalRequirements || []);
        setSelectedOptional([]);
      } else {
        setError(`AI Generation failed: ${data.error}`);
      }
    } catch (err) {
      setError("Error generating SRS with AI");
      console.error("AI Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleOptionalRequirement = (index) => {
    setSelectedOptional(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const createSrsFromAI = async () => {
    if (!generatedSRS || !token || !roomId) {
      alert("No generated SRS available");
      return;
    }

    // Combine core requirements with selected optional ones
    const finalRequirements = {
      ...generatedSRS,
      functionalRequirements: [
        ...generatedSRS.functionalRequirements,
        ...selectedOptional
          .filter(i => optionalRequirements[i].type === 'functional')
          .map(i => optionalRequirements[i].description)
      ],
      nonFunctionalRequirements: [
        ...generatedSRS.nonFunctionalRequirements,
        ...selectedOptional
          .filter(i => optionalRequirements[i].type === 'non-functional')
          .map(i => optionalRequirements[i].description)
      ]
    };

    // Format the SRS content
    const formattedContent = `
# ${generatedSRS.title}

## Project Overview
${generatedSRS.overview}

## Functional Requirements
${finalRequirements.functionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

## Non-Functional Requirements
${finalRequirements.nonFunctionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

## Technical Stack
${generatedSRS.technicalStack ? generatedSRS.technicalStack.join(', ') : 'To be determined'}

## Color Theme
Primary: ${colorThemes.find(t => t.name === selectedTheme)?.text}
    `.trim();

    try {
      setError("");
      const res = await fetch("/api/srs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId,
          content: formattedContent,
          title: generatedSRS.title
        }),
      });

      const data = await res.json();

      if (data.success) {
        const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refreshData = await refreshRes.json();

        if (refreshData.success) {
          setSrsDocs(refreshData.srsDocuments || []);
        }

        // Reset AI generator
        setShowAIGenerator(false);
        setAiPrompt("");
        setGeneratedSRS(null);
        setOptionalRequirements([]);
        setSelectedOptional([]);
        alert("AI-generated SRS document created successfully!");
      } else {
        setError(`Failed to create SRS: ${data.error}`);
      }
    } catch (err) {
      setError("Error creating SRS document");
      console.error("Create SRS error:", err);
    }
  };

  const createSrs = async () => {
    if (!newContent.trim() || !token || !roomId) {
      alert("Please enter content and make sure you're authenticated");
      return;
    }

    try {
      setError("");
      const res = await fetch("/api/srs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId,
          content: newContent,
          title: title.trim() || `SRS Document ${new Date().toLocaleDateString()}`
        }),
      });

      const data = await res.json();
      console.log("Create SRS response:", data);

      if (data.success) {
        const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refreshData = await refreshRes.json();

        if (refreshData.success) {
          setSrsDocs(refreshData.srsDocuments || []);
        }
        // Refresh status updates
        try {
          const stRes = await fetch(`/api/project-status?roomId=${roomId}`);
          const stData = await stRes.json();
          if (stData.success) setStatusUpdates(stData.statuses || []);
        } catch (_) {}

        setNewContent("");
        setTitle("");
        alert("SRS document created successfully!");
      } else {
        setError(`Failed to create SRS: ${data.error}`);
      }
    } catch (err) {
      setError("Error creating SRS document");
      console.error("Create SRS error:", err);
    }
  };

  const startEdit = (doc) => {
    setEditingDocId(doc._id);
    const latest = doc.versions[doc.versions.length - 1];
    setEditingContent(latest.content || "");
  };

  const cancelEdit = () => {
    setEditingDocId(null);
    setEditingContent("");
  };

  const saveEdit = async () => {
    if (!editingDocId || !editingContent.trim()) return;
    try {
      setError("");
      const res = await fetch(`/api/srs/${editingDocId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editingContent, changes: "Updated content" })
      });
      const data = await res.json();
      if (!data.success) {
        setError(`Failed to update SRS: ${data.error}`);
        return;
      }
      const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const refreshData = await refreshRes.json();
      if (refreshData.success) {
        setSrsDocs(refreshData.srsDocuments || []);
      }
      // Refresh status updates
      try {
        const stRes = await fetch(`/api/project-status?roomId=${roomId}`);
        const stData = await stRes.json();
        if (stData.success) setStatusUpdates(stData.statuses || []);
      } catch (_) {}
      cancelEdit();
    } catch (err) {
      setError("Error updating SRS document");
      console.error("Update SRS error:", err);
    }
  };

  if (!mounted || loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Client Dashboard - Room: {roomId}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Manager Progress Updates */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Project Progress</h2>
      {statusUpdates.length === 0 ? (
        <p className="text-gray-500">No progress updates yet.</p>
      ) : (
        <div className="space-y-3">
          {statusUpdates.map((u) => (
            <div key={u._id} className="border rounded p-3 bg-white">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>By: {u.updatedBy?.name || u.updatedBy?.email || 'Unknown'}</span>
                <span>{new Date(u.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold">Progress:</span>
                <span>{u.progressPercent}%</span>
              </div>
              {u.comment && (
                <p className="text-gray-800 whitespace-pre-wrap">{u.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toggle Between Manual and AI */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowAIGenerator(false)}
          className={`px-6 py-2 rounded-lg font-semibold transition ${!showAIGenerator ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Manual Creation
        </button>
        <button
          onClick={() => setShowAIGenerator(true)}
          className={`px-6 py-2 rounded-lg font-semibold transition ${showAIGenerator ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          🤖 AI-Powered Generation
        </button>
      </div>

      {showAIGenerator ? (
        /* AI Generation Section */
        <div className="mb-8 space-y-6">
          {!generatedSRS ? (
            <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-blue-50">
              <h2 className="text-2xl font-bold mb-4 text-purple-900">AI SRS Generator</h2>

              {/* Color Theme Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                  Choose Color Theme
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => setSelectedTheme(theme.name)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedTheme === theme.name
                          ? 'border-gray-800 shadow-lg scale-105'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: theme.secondary }}
                    >
                      <div
                        className="w-full h-8 rounded mb-2"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <p className="text-xs font-medium text-center">{theme.text}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Describe Your Project
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Example: Create an e-commerce platform for selling handmade crafts with user authentication, shopping cart, payment integration, and admin dashboard..."
                  className="w-full border-2 border-purple-300 p-4 rounded-lg h-32 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={generateSRSWithAI}
                disabled={!aiPrompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin">⚙️</span> Generating SRS...
                  </>
                ) : (
                  <>✨ Generate SRS with AI</>
                )}
              </button>
            </div>
          ) : (
            /* Generated SRS Review */
            <div className="space-y-6">
              {/* Core SRS */}
              <div className="border rounded-lg p-6 bg-white shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{generatedSRS.title}</h2>
                  <div
                    className="px-4 py-2 rounded-full text-white font-semibold"
                    style={{ backgroundColor: colorThemes.find(t => t.name === selectedTheme)?.primary }}
                  >
                    {colorThemes.find(t => t.name === selectedTheme)?.text}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Overview</h3>
                  <textarea
                    value={generatedSRS.overview}
                    onChange={(e) => setGeneratedSRS({...generatedSRS, overview: e.target.value})}
                    className="w-full border p-3 rounded-lg"
                    rows="3"
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Functional Requirements</h3>
                  {generatedSRS.functionalRequirements.map((req, index) => (
                    <div key={index} className="mb-2">
                      <textarea
                        value={req}
                        onChange={(e) => {
                          const updated = [...generatedSRS.functionalRequirements];
                          updated[index] = e.target.value;
                          setGeneratedSRS({...generatedSRS, functionalRequirements: updated});
                        }}
                        className="w-full border p-2 rounded"
                        rows="2"
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Non-Functional Requirements</h3>
                  {generatedSRS.nonFunctionalRequirements.map((req, index) => (
                    <div key={index} className="mb-2">
                      <textarea
                        value={req}
                        onChange={(e) => {
                          const updated = [...generatedSRS.nonFunctionalRequirements];
                          updated[index] = e.target.value;
                          setGeneratedSRS({...generatedSRS, nonFunctionalRequirements: updated});
                        }}
                        className="w-full border p-2 rounded"
                        rows="2"
                      />
                    </div>
                  ))}
                </div>

                {generatedSRS.technicalStack && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Suggested Technical Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {generatedSRS.technicalStack.map((tech, index) => (
                        <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Requirements */}
              {optionalRequirements.length > 0 && (
                <div className="border-2 border-dashed border-yellow-400 rounded-lg p-6 bg-yellow-50">
                  <h3 className="text-xl font-bold mb-3 text-yellow-900 flex items-center gap-2">
                    ⭐ Optional Requirements
                    <span className="text-sm font-normal text-yellow-700">
                      (Select any you'd like to include)
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {optionalRequirements.map((req, index) => (
                      <div
                        key={index}
                        onClick={() => toggleOptionalRequirement(index)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedOptional.includes(index)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 bg-white hover:border-yellow-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedOptional.includes(index)}
                            onChange={() => toggleOptionalRequirement(index)}
                            className="mt-1 w-5 h-5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                req.type === 'functional' ? 'bg-blue-200 text-blue-800' : 'bg-purple-200 text-purple-800'
                              }`}>
                                {req.type === 'functional' ? 'Functional' : 'Non-Functional'}
                              </span>
                            </div>
                            <p className="text-gray-700">{req.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-yellow-700 mt-3">
                    {selectedOptional.length} optional requirement(s) selected
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={createSrsFromAI}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  ✓ Create SRS Document
                </button>
                <button
                  onClick={() => {
                    setGeneratedSRS(null);
                    setOptionalRequirements([]);
                    setSelectedOptional([]);
                  }}
                  className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-100 transition"
                >
                  ← Back to Generator
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Manual Creation Section */
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">Create New SRS Document</h2>

          <div className="mb-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document Title (optional)"
              className="w-full border p-2 rounded mb-2"
            />
          </div>

          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your SRS content here..."
            className="w-full border p-2 rounded h-32"
          />

          <button
            onClick={createSrs}
            disabled={!newContent.trim()}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create SRS Document
          </button>
        </div>
      )}

      {/* Existing SRS Documents */}
      <h2 className="text-xl font-semibold mb-4">SRS Documents ({srsDocs.length})</h2>
      {srsDocs.length === 0 ? (
        <p className="text-gray-500">No SRS documents created yet.</p>
      ) : (
        srsDocs.map((doc) => (
          <div key={doc._id} className="border p-4 rounded mb-4 bg-white shadow">
            <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>
            {editingDocId === doc._id ? (
              <>
                <textarea
                  className="w-full border p-2 rounded h-40 mb-2"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
                  <button onClick={cancelEdit} className="border px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                  {doc.versions[doc.versions.length - 1].content}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 flex gap-4">
                    <span>
                      Version: {doc.versions[doc.versions.length - 1].version}
                    </span>
                    <span>
                      Author: {doc.versions[doc.versions.length - 1].author?.name || 'Unknown'}
                    </span>
                    <span>
                      Last updated: {new Date(
                        doc.versions[doc.versions.length - 1].createdAt
                      ).toLocaleString()}
                    </span>
                  </div>
                  <button onClick={() => startEdit(doc)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}