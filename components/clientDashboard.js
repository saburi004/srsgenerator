// // // "use client";
// // // import { useEffect, useState } from "react";

// // // export default function ClientDashboard() {
// // //   const [srsDocs, setSrsDocs] = useState([]);
// // //   const [newContent, setNewContent] = useState("");
// // //   const [title, setTitle] = useState("");
// // //   const [loading, setLoading] = useState(true);
// // //   const [token, setToken] = useState(null);
// // //   const [roomId, setRoomId] = useState(null);
// // //   const [mounted, setMounted] = useState(false);
// // //   const [error, setError] = useState("");

// // //   useEffect(() => {
// // //     setMounted(true);
// // //   }, []);

// // //   useEffect(() => {
// // //     if (!mounted) return;
    
// // //     const storedToken = localStorage.getItem("token");
// // //     if (!storedToken) {
// // //       window.location.href = "/register";
// // //       return;
// // //     }
    
// // //     setToken(storedToken);
    
// // //     try {
// // //       const payload = JSON.parse(atob(storedToken.split(".")[1]));
// // //       const userRoomId = payload.roomId;
// // //       setRoomId(userRoomId);

// // //       const fetchSrs = async () => {
// // //         try {
// // //           setError("");
// // //           // Use the new RESTful endpoint
// // //           const res = await fetch(`/api/srs/${userRoomId}`, {
// // //             headers: { Authorization: `Bearer ${storedToken}` },
// // //           });
          
// // //           const data = await res.json();
// // //           console.log("API Response:", data);
          
// // //           if (data.success) {
// // //             setSrsDocs(data.srsDocuments || []);
// // //           } else {
// // //             setError(`Failed to load SRS: ${data.error}`);
// // //             console.error("API Error:", data.error);
// // //           }
// // //         } catch (err) {
// // //           setError("Network error loading SRS documents");
// // //           console.error("Fetch error:", err);
// // //         } finally {
// // //           setLoading(false);
// // //         }
// // //       };

// // //       fetchSrs();
// // //     } catch (err) {
// // //       console.error("Error parsing token:", err);
// // //       localStorage.removeItem("token");
// // //       window.location.href = "/register";
// // //     }
// // //   }, [mounted]);

// // //   const createSrs = async () => {
// // //     if (!newContent.trim() || !token || !roomId) {
// // //       alert("Please enter content and make sure you're authenticated");
// // //       return;
// // //     }

// // //     try {
// // //       setError("");
// // //       const res = await fetch("/api/srs", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         body: JSON.stringify({ 
// // //           roomId, 
// // //           content: newContent,
// // //           title: title.trim() || `SRS Document ${new Date().toLocaleDateString()}`
// // //         }),
// // //       });
      
// // //       const data = await res.json();
// // //       console.log("Create SRS response:", data);
      
// // //       if (data.success) {
// // //         // Refresh the SRS documents list
// // //         const refreshRes = await fetch(`/api/srs/${roomId}`, {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         });
// // //         const refreshData = await refreshRes.json();
        
// // //         if (refreshData.success) {
// // //           setSrsDocs(refreshData.srsDocuments || []);
// // //         }
        
// // //         setNewContent("");
// // //         setTitle("");
// // //         alert("SRS document created successfully!");
// // //       } else {
// // //         setError(`Failed to create SRS: ${data.error}`);
// // //       }
// // //     } catch (err) {
// // //       setError("Error creating SRS document");
// // //       console.error("Create SRS error:", err);
// // //     }
// // //   };

// // //   if (!mounted || loading) return <p>Loading...</p>;

// // //   return (
// // //     <div className="p-6">
// // //       <h1 className="text-2xl font-bold mb-4">Client Dashboard - Room: {roomId}</h1>
      
// // //       {error && (
// // //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
// // //           {error}
// // //         </div>
// // //       )}
      
// // //       {/* Create New SRS Section */}
// // //       <div className="mb-6 p-4 border rounded-lg bg-gray-50">
// // //         <h2 className="text-lg font-semibold mb-3">Create New SRS Document</h2>
        
// // //         <div className="mb-3">
// // //           <input
// // //             type="text"
// // //             value={title}
// // //             onChange={(e) => setTitle(e.target.value)}
// // //             placeholder="Document Title (optional)"
// // //             className="w-full border p-2 rounded mb-2"
// // //           />
// // //         </div>
        
// // //         <textarea
// // //           value={newContent}
// // //           onChange={(e) => setNewContent(e.target.value)}
// // //           placeholder="Write your SRS content here..."
// // //           className="w-full border p-2 rounded h-32"
// // //         />
        
// // //         <button
// // //           onClick={createSrs}
// // //           disabled={!newContent.trim()}
// // //           className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
// // //         >
// // //           Create SRS Document
// // //         </button>
// // //       </div>

// // //       {/* Existing SRS Documents */}
// // //       <h2 className="text-xl font-semibold mb-2">SRS Documents ({srsDocs.length})</h2>
// // //       {srsDocs.length === 0 ? (
// // //         <p className="text-gray-500">No SRS documents created yet.</p>
// // //       ) : (
// // //         srsDocs.map((doc) => (
// // //           <div key={doc._id} className="border p-4 rounded mb-4 bg-white shadow">
// // //             <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>
// // //             <p className="text-gray-700 mb-2 whitespace-pre-wrap">
// // //               {doc.versions[doc.versions.length - 1].content}
// // //             </p>
// // //             <div className="text-sm text-gray-500 flex justify-between">
// // //               <span>
// // //                 Version: {doc.versions[doc.versions.length - 1].version}
// // //               </span>
// // //               <span>
// // //                 Author: {doc.versions[doc.versions.length - 1].author?.name || 'Unknown'}
// // //               </span>
// // //               <span>
// // //                 Last updated: {new Date(
// // //                   doc.versions[doc.versions.length - 1].createdAt
// // //                 ).toLocaleString()}
// // //               </span>
// // //             </div>
// // //           </div>
// // //         ))
// // //       )}
// // //     </div>
// // //   );
// // // }
// // "use client";
// // import { useEffect, useState } from "react";

// // export default function ClientDashboard() {
// //   const [srsDocs, setSrsDocs] = useState([]);
// //   const [newContent, setNewContent] = useState("");
// //   const [title, setTitle] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [token, setToken] = useState(null);
// //   const [roomId, setRoomId] = useState(null);
// //   const [mounted, setMounted] = useState(false);
// //   const [error, setError] = useState("");
// //   const [statusUpdates, setStatusUpdates] = useState([]);
// //   const [editingDocId, setEditingDocId] = useState(null);
// //   const [editingContent, setEditingContent] = useState("");
  
// //   // AI Generation states
// //   const [showAIGenerator, setShowAIGenerator] = useState(false);
// //   const [aiPrompt, setAiPrompt] = useState("");
// //   const [selectedTheme, setSelectedTheme] = useState("blue");
// //   const [generatedSRS, setGeneratedSRS] = useState(null);
// //   const [isGenerating, setIsGenerating] = useState(false);
// //   const [optionalRequirements, setOptionalRequirements] = useState([]);
// //   const [selectedOptional, setSelectedOptional] = useState([]);

// //   // Clarification chat states
// //   const [isClarifyOpen, setIsClarifyOpen] = useState(false);
// //   const [clarifyQuestions, setClarifyQuestions] = useState([]);
// //   const [clarifyAnswers, setClarifyAnswers] = useState({});
// //   const [isClarifying, setIsClarifying] = useState(false);
// //   const [isSavingWithClarifications, setIsSavingWithClarifications] = useState(false);

// //   const handleClarifyAnswerChange = (index, value) => {
// //     setClarifyAnswers((prev) => ({ ...prev, [index]: value }));
// //   };

// //   const buildFinalContentWithClarifications = () => {
// //     // Build base content as before
// //     const base = `
// // # ${generatedSRS.title}

// // ## Project Overview
// // ${generatedSRS.overview}

// // ## Functional Requirements
// // ${generatedSRS.functionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// // ## Non-Functional Requirements
// // ${generatedSRS.nonFunctionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// // ## Technical Stack
// // ${generatedSRS.technicalStack ? generatedSRS.technicalStack.join(', ') : 'To be determined'}

// // ## Color Theme
// // Primary: ${colorThemes.find(t => t.name === selectedTheme)?.text}
// // `.trim();

// //     const answeredPairs = clarifyQuestions
// //       .map((q, i) => ({ q, a: (clarifyAnswers[i] || '').trim() }))
// //       .filter((p) => p.a.length > 0);

// //     if (answeredPairs.length === 0) return base;

// //     const qaSection = `
// // \n## Client Clarifications\n${answeredPairs
// //       .map((p, i) => `${i + 1}. Q: ${p.q}\n   A: ${p.a}`)
// //       .join('\n')}`;
// //     return `${base}${qaSection}`;
// //   };

// //   const saveSrsAfterClarifications = async () => {
// //     if (!generatedSRS || !token || !roomId) {
// //       alert("Missing data to save SRS");
// //       return;
// //     }
// //     setIsSavingWithClarifications(true);
// //     setError("");
// //     try {
// //       const finalContent = buildFinalContentWithClarifications();
// //       const res = await fetch("/api/srs", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({
// //           roomId,
// //           content: finalContent,
// //           title: generatedSRS.title
// //         }),
// //       });

// //       const data = await res.json();
// //       if (!data.success) {
// //         setError(`Failed to create SRS: ${data.error}`);
// //         setIsSavingWithClarifications(false);
// //         return;
// //       }

// //       const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       const refreshData = await refreshRes.json();
// //       if (refreshData.success) {
// //         setSrsDocs(refreshData.srsDocuments || []);
// //       }

// //       // Reset AI generator and clarification states
// //       setShowAIGenerator(false);
// //       setAiPrompt("");
// //       setGeneratedSRS(null);
// //       setOptionalRequirements([]);
// //       setSelectedOptional([]);
// //       setIsClarifyOpen(false);
// //       setClarifyQuestions([]);
// //       setClarifyAnswers({});
// //       alert("SRS saved with clarifications!");
// //     } catch (err) {
// //       setError("Error saving SRS with clarifications");
// //       console.error("Save SRS clarifications error:", err);
// //     } finally {
// //       setIsSavingWithClarifications(false);
// //     }
// //   };

// //   const colorThemes = [
// //     { name: "blue", primary: "#3B82F6", secondary: "#DBEAFE", text: "Blue Ocean" },
// //     { name: "green", primary: "#10B981", secondary: "#D1FAE5", text: "Fresh Green" },
// //     { name: "purple", primary: "#8B5CF6", secondary: "#EDE9FE", text: "Royal Purple" },
// //     { name: "orange", primary: "#F97316", secondary: "#FFEDD5", text: "Sunset Orange" },
// //     { name: "pink", primary: "#EC4899", secondary: "#FCE7F3", text: "Vibrant Pink" },
// //     { name: "teal", primary: "#14B8A6", secondary: "#CCFBF1", text: "Tropical Teal" },
// //   ];

// //   useEffect(() => {
// //     setMounted(true);
// //   }, []);

// //   useEffect(() => {
// //     if (!mounted) return;
    
// //     const storedToken = localStorage.getItem("token");
// //     if (!storedToken) {
// //       window.location.href = "/register";
// //       return;
// //     }
    
// //     setToken(storedToken);
    
// //     try {
// //       const payload = JSON.parse(atob(storedToken.split(".")[1]));
// //       const userRoomId = payload.roomId;
// //       setRoomId(userRoomId);

// //       const fetchSrs = async () => {
// //         try {
// //           setError("");
// //           const res = await fetch(`/api/srs/room/${userRoomId}`, {
// //             headers: { Authorization: `Bearer ${storedToken}` },
// //           });
          
// //           const data = await res.json();
// //           console.log("API Response:", data);
          
// //           if (data.success) {
// //             setSrsDocs(data.srsDocuments || []);
// //           } else {
// //             setError(`Failed to load SRS: ${data.error}`);
// //             console.error("API Error:", data.error);
// //           }
// //           // Fetch manager status updates
// //           try {
// //             const stRes = await fetch(`/api/project-status?roomId=${userRoomId}`);
// //             const stData = await stRes.json();
// //             if (stData.success) setStatusUpdates(stData.statuses || []);
// //           } catch (_) {}
// //         } catch (err) {
// //           setError("Network error loading SRS documents");
// //           console.error("Fetch error:", err);
// //         } finally {
// //           setLoading(false);
// //         }
// //       };

// //       fetchSrs();
// //     } catch (err) {
// //       console.error("Error parsing token:", err);
// //       localStorage.removeItem("token");
// //       window.location.href = "/register";
// //     }
// //   }, [mounted]);

// //   const generateSRSWithAI = async () => {
// //     if (!aiPrompt.trim()) {
// //       alert("Please enter a description for your project");
// //       return;
// //     }

// //     setIsGenerating(true);
// //     setError("");

// //     try {
// //       const res = await fetch("/api/groq/generate-srs", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({
// //           prompt: aiPrompt,
// //           theme: selectedTheme,
// //         }),
// //       });

// //       const data = await res.json();

// //       if (data.success) {
// //         setGeneratedSRS(data.srs);
// //         setOptionalRequirements(data.optionalRequirements || []);
// //         setSelectedOptional([]);
// //       } else {
// //         setError(`AI Generation failed: ${data.error}`);
// //       }
// //     } catch (err) {
// //       setError("Error generating SRS with AI");
// //       console.error("AI Generation error:", err);
// //     } finally {
// //       setIsGenerating(false);
// //     }
// //   };

// //   const toggleOptionalRequirement = (index) => {
// //     setSelectedOptional(prev => {
// //       if (prev.includes(index)) {
// //         return prev.filter(i => i !== index);
// //       } else {
// //         return [...prev, index];
// //       }
// //     });
// //   };

// //   const createSrsFromAI = async () => {
// //     if (!generatedSRS || !token || !roomId) {
// //       alert("No generated SRS available");
// //       return;
// //     }

// //     // Combine core requirements with selected optional ones
// //     const finalRequirements = {
// //       ...generatedSRS,
// //       functionalRequirements: [
// //         ...generatedSRS.functionalRequirements,
// //         ...selectedOptional
// //           .filter(i => optionalRequirements[i].type === 'functional')
// //           .map(i => optionalRequirements[i].description)
// //       ],
// //       nonFunctionalRequirements: [
// //         ...generatedSRS.nonFunctionalRequirements,
// //         ...selectedOptional
// //           .filter(i => optionalRequirements[i].type === 'non-functional')
// //           .map(i => optionalRequirements[i].description)
// //       ]
// //     };

// //     // Format the SRS content
// //     const formattedContent = `
// // # ${generatedSRS.title}

// // ## Project Overview
// // ${generatedSRS.overview}

// // ## Functional Requirements
// // ${finalRequirements.functionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// // ## Non-Functional Requirements
// // ${finalRequirements.nonFunctionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// // ## Technical Stack
// // ${generatedSRS.technicalStack ? generatedSRS.technicalStack.join(', ') : 'To be determined'}

// // ## Color Theme
// // Primary: ${colorThemes.find(t => t.name === selectedTheme)?.text}
// //     `.trim();

// //     try {
// //       setError("");

// //       // First, open clarification panel and fetch questions from GROQ
// //       setIsClarifyOpen(true);
// //       setIsClarifying(true);
// //       setClarifyQuestions([]);
// //       setClarifyAnswers({});

// //       // Ask GROQ for clarification questions
// //       const clarifyRes = await fetch("/api/groq/clarify", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           srs: {
// //             title: generatedSRS.title,
// //             overview: generatedSRS.overview,
// //             functionalRequirements: finalRequirements.functionalRequirements,
// //             nonFunctionalRequirements: finalRequirements.nonFunctionalRequirements,
// //             technicalStack: generatedSRS.technicalStack || []
// //           }
// //         })
// //       });
// //       const clarifyData = await clarifyRes.json();
// //       if (!clarifyData.success) {
// //         setError(`Failed to get clarification questions: ${clarifyData.error || 'Unknown error'}`);
// //         setIsClarifying(false);
// //         return;
// //       }
// //       setClarifyQuestions(clarifyData.questions || []);
// //       setIsClarifying(false);

// //       // Defer saving SRS until client answers clarifications. A separate handler will compile and save.
// //     } catch (err) {
// //       setError("Error starting clarification phase");
// //       console.error("Clarification start error:", err);
// //       setIsClarifying(false);
// //     }
// //   };

// //   const createSrs = async () => {
// //     if (!newContent.trim() || !token || !roomId) {
// //       alert("Please enter content and make sure you're authenticated");
// //       return;
// //     }

// //     try {
// //       setError("");
// //       const res = await fetch("/api/srs", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({
// //           roomId,
// //           content: newContent,
// //           title: title.trim() || `SRS Document ${new Date().toLocaleDateString()}`
// //         }),
// //       });

// //       const data = await res.json();
// //       console.log("Create SRS response:", data);

// //       if (data.success) {
// //         const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         const refreshData = await refreshRes.json();

// //         if (refreshData.success) {
// //           setSrsDocs(refreshData.srsDocuments || []);
// //         }
// //         // Refresh status updates
// //         try {
// //           const stRes = await fetch(`/api/project-status?roomId=${roomId}`);
// //           const stData = await stRes.json();
// //           if (stData.success) setStatusUpdates(stData.statuses || []);
// //         } catch (_) {}

// //         setNewContent("");
// //         setTitle("");
// //         alert("SRS document created successfully!");
// //       } else {
// //         setError(`Failed to create SRS: ${data.error}`);
// //       }
// //     } catch (err) {
// //       setError("Error creating SRS document");
// //       console.error("Create SRS error:", err);
// //     }
// //   };

// //   const startEdit = (doc) => {
// //     setEditingDocId(doc._id);
// //     const latest = doc.versions[doc.versions.length - 1];
// //     setEditingContent(latest.content || "");
// //   };

// //   const cancelEdit = () => {
// //     setEditingDocId(null);
// //     setEditingContent("");
// //   };

// //   const saveEdit = async () => {
// //     if (!editingDocId || !editingContent.trim()) return;
// //     try {
// //       setError("");
// //       const res = await fetch(`/api/srs/${editingDocId}`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ content: editingContent, changes: "Updated content" })
// //       });
// //       const data = await res.json();
// //       if (!data.success) {
// //         setError(`Failed to update SRS: ${data.error}`);
// //         return;
// //       }
// //       const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       const refreshData = await refreshRes.json();
// //       if (refreshData.success) {
// //         setSrsDocs(refreshData.srsDocuments || []);
// //       }
// //       // Refresh status updates
// //       try {
// //         const stRes = await fetch(`/api/project-status?roomId=${roomId}`);
// //         const stData = await stRes.json();
// //         if (stData.success) setStatusUpdates(stData.statuses || []);
// //       } catch (_) {}
// //       cancelEdit();
// //     } catch (err) {
// //       setError("Error updating SRS document");
// //       console.error("Update SRS error:", err);
// //     }
// //   };

// //   if (!mounted || loading) return <p>Loading...</p>;

// //   return (
// //     <div className="p-6 max-w-7xl mx-auto relative">
// //       <h1 className="text-3xl font-bold mb-6">Client Dashboard - Room: {roomId}</h1>

// //       {error && (
// //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
// //           {error}
// //         </div>
// //       )}

// //       {/* Manager Progress Updates */}
// //       <h2 className="text-xl font-semibold mt-8 mb-2">Project Progress</h2>
// //       {statusUpdates.length === 0 ? (
// //         <p className="text-gray-500">No progress updates yet.</p>
// //       ) : (
// //         <div className="space-y-3">
// //           {statusUpdates.map((u) => (
// //             <div key={u._id} className="border rounded p-3 bg-white">
// //               <div className="flex justify-between text-sm text-gray-600 mb-1">
// //                 <span>By: {u.updatedBy?.name || u.updatedBy?.email || 'Unknown'}</span>
// //                 <span>{new Date(u.createdAt).toLocaleString()}</span>
// //               </div>
// //               <div className="flex items-center gap-3 mb-1">
// //                 <span className="font-semibold">Progress:</span>
// //                 <span>{u.progressPercent}%</span>
// //               </div>
// //               {u.comment && (
// //                 <p className="text-gray-800 whitespace-pre-wrap">{u.comment}</p>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* Toggle Between Manual and AI */}
// //       <div className="mb-6 flex gap-4">
// //         <button
// //           onClick={() => setShowAIGenerator(false)}
// //           className={`px-6 py-2 rounded-lg font-semibold transition ${!showAIGenerator ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
// //         >
// //           Manual Creation
// //         </button>
// //         <button
// //           onClick={() => setShowAIGenerator(true)}
// //           className={`px-6 py-2 rounded-lg font-semibold transition ${showAIGenerator ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
// //         >
// //           🤖 AI-Powered Generation
// //         </button>
// //       </div>

// //       {showAIGenerator ? (
// //         /* AI Generation Section */
// //         <div className="mb-8 space-y-6">
// //           {!generatedSRS ? (
// //             <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-blue-50">
// //               <h2 className="text-2xl font-bold mb-4 text-purple-900">AI SRS Generator</h2>

// //               {/* Color Theme Selection */}
// //               <div className="mb-6">
// //                 <label className="block text-sm font-semibold mb-3 text-gray-700">
// //                   Choose Color Theme
// //                 </label>
// //                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
// //                   {colorThemes.map((theme) => (
// //                     <button
// //                       key={theme.name}
// //                       onClick={() => setSelectedTheme(theme.name)}
// //                       className={`p-4 rounded-lg border-2 transition-all ${
// //                         selectedTheme === theme.name
// //                           ? 'border-gray-800 shadow-lg scale-105'
// //                           : 'border-gray-300 hover:border-gray-400'
// //                       }`}
// //                       style={{ backgroundColor: theme.secondary }}
// //                     >
// //                       <div
// //                         className="w-full h-8 rounded mb-2"
// //                         style={{ backgroundColor: theme.primary }}
// //                       />
// //                       <p className="text-xs font-medium text-center">{theme.text}</p>
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Prompt Input */}
// //               <div className="mb-4">
// //                 <label className="block text-sm font-semibold mb-2 text-gray-700">
// //                   Describe Your Project
// //                 </label>
// //                 <textarea
// //                   value={aiPrompt}
// //                   onChange={(e) => setAiPrompt(e.target.value)}
// //                   placeholder="Example: Create an e-commerce platform for selling handmade crafts with user authentication, shopping cart, payment integration, and admin dashboard..."
// //                   className="w-full border-2 border-purple-300 p-4 rounded-lg h-32 focus:outline-none focus:border-purple-500"
// //                 />
// //               </div>

// //               <button
// //                 onClick={generateSRSWithAI}
// //                 disabled={!aiPrompt.trim() || isGenerating}
// //                 className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
// //               >
// //                 {isGenerating ? (
// //                   <>
// //                     <span className="animate-spin">⚙️</span> Generating SRS...
// //                   </>
// //                 ) : (
// //                   <>✨ Generate SRS with AI</>
// //                 )}
// //               </button>
// //             </div>
// //           ) : (
// //             /* Generated SRS Review */
// //             <div className="space-y-6">
// //               {/* Core SRS */}
// //               <div className="border rounded-lg p-6 bg-white shadow-lg">
// //                 <div className="flex justify-between items-start mb-4">
// //                   <h2 className="text-2xl font-bold text-gray-900">{generatedSRS.title}</h2>
// //                   <div
// //                     className="px-4 py-2 rounded-full text-white font-semibold"
// //                     style={{ backgroundColor: colorThemes.find(t => t.name === selectedTheme)?.primary }}
// //                   >
// //                     {colorThemes.find(t => t.name === selectedTheme)?.text}
// //                   </div>
// //                 </div>

// //                 <div className="mb-6">
// //                   <h3 className="text-lg font-semibold mb-2 text-gray-800">Overview</h3>
// //                   <textarea
// //                     value={generatedSRS.overview}
// //                     onChange={(e) => setGeneratedSRS({...generatedSRS, overview: e.target.value})}
// //                     className="w-full border p-3 rounded-lg"
// //                     rows="3"
// //                   />
// //                 </div>

// //                 <div className="mb-6">
// //                   <h3 className="text-lg font-semibold mb-2 text-gray-800">Functional Requirements</h3>
// //                   {generatedSRS.functionalRequirements.map((req, index) => (
// //                     <div key={index} className="mb-2">
// //                       <textarea
// //                         value={req}
// //                         onChange={(e) => {
// //                           const updated = [...generatedSRS.functionalRequirements];
// //                           updated[index] = e.target.value;
// //                           setGeneratedSRS({...generatedSRS, functionalRequirements: updated});
// //                         }}
// //                         className="w-full border p-2 rounded"
// //                         rows="2"
// //                       />
// //                     </div>
// //                   ))}
// //                 </div>

// //                 <div className="mb-6">
// //                   <h3 className="text-lg font-semibold mb-2 text-gray-800">Non-Functional Requirements</h3>
// //                   {generatedSRS.nonFunctionalRequirements.map((req, index) => (
// //                     <div key={index} className="mb-2">
// //                       <textarea
// //                         value={req}
// //                         onChange={(e) => {
// //                           const updated = [...generatedSRS.nonFunctionalRequirements];
// //                           updated[index] = e.target.value;
// //                           setGeneratedSRS({...generatedSRS, nonFunctionalRequirements: updated});
// //                         }}
// //                         className="w-full border p-2 rounded"
// //                         rows="2"
// //                       />
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {generatedSRS.technicalStack && (
// //                   <div>
// //                     <h3 className="text-lg font-semibold mb-2 text-gray-800">Suggested Technical Stack</h3>
// //                     <div className="flex flex-wrap gap-2">
// //                       {generatedSRS.technicalStack.map((tech, index) => (
// //                         <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
// //                           {tech}
// //                         </span>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Optional Requirements */}
// //               {optionalRequirements.length > 0 && (
// //                 <div className="border-2 border-dashed border-yellow-400 rounded-lg p-6 bg-yellow-50">
// //                   <h3 className="text-xl font-bold mb-3 text-yellow-900 flex items-center gap-2">
// //                     ⭐ Optional Requirements
// //                     <span className="text-sm font-normal text-yellow-700">
// //                       (Select any you'd like to include)
// //                     </span>
// //                   </h3>
// //                   <div className="space-y-3">
// //                     {optionalRequirements.map((req, index) => (
// //                       <div
// //                         key={index}
// //                         onClick={() => toggleOptionalRequirement(index)}
// //                         className={`p-4 rounded-lg border-2 cursor-pointer transition ${
// //                           selectedOptional.includes(index)
// //                             ? 'border-green-500 bg-green-50'
// //                             : 'border-gray-300 bg-white hover:border-yellow-500'
// //                         }`}
// //                       >
// //                         <div className="flex items-start gap-3">
// //                           <input
// //                             type="checkbox"
// //                             checked={selectedOptional.includes(index)}
// //                             onChange={() => toggleOptionalRequirement(index)}
// //                             className="mt-1 w-5 h-5"
// //                           />
// //                           <div className="flex-1">
// //                             <div className="flex items-center gap-2 mb-1">
// //                               <span className={`text-xs font-semibold px-2 py-1 rounded ${
// //                                 req.type === 'functional' ? 'bg-blue-200 text-blue-800' : 'bg-purple-200 text-purple-800'
// //                               }`}>
// //                                 {req.type === 'functional' ? 'Functional' : 'Non-Functional'}
// //                               </span>
// //                             </div>
// //                             <p className="text-gray-700">{req.description}</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                   <p className="text-sm text-yellow-700 mt-3">
// //                     {selectedOptional.length} optional requirement(s) selected
// //                   </p>
// //                 </div>
// //               )}

// //               {/* Action Buttons */}
// //               <div className="flex gap-4">
// //                 <button
// //                   onClick={createSrsFromAI}
// //                   className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
// //                 >
// //                   ✓ Continue to Clarifications
// //                 </button>
// //                 <button
// //                   onClick={() => {
// //                     setGeneratedSRS(null);
// //                     setOptionalRequirements([]);
// //                     setSelectedOptional([]);
// //                   }}
// //                   className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-100 transition"
// //                 >
// //                   ← Back to Generator
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       ) : (
// //         /* Manual Creation Section */
// //         <div className="mb-6 p-4 border rounded-lg bg-gray-50">
// //           <h2 className="text-lg font-semibold mb-3">Create New SRS Document</h2>

// //           <div className="mb-3">
// //             <input
// //               type="text"
// //               value={title}
// //               onChange={(e) => setTitle(e.target.value)}
// //               placeholder="Document Title (optional)"
// //               className="w-full border p-2 rounded mb-2"
// //             />
// //           </div>

// //           <textarea
// //             value={newContent}
// //             onChange={(e) => setNewContent(e.target.value)}
// //             placeholder="Write your SRS content here..."
// //             className="w-full border p-2 rounded h-32"
// //           />

// //           <button
// //             onClick={createSrs}
// //             disabled={!newContent.trim()}
// //             className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
// //           >
// //             Create SRS Document
// //           </button>
// //         </div>
// //       )}

// //       {/* Existing SRS Documents */}
// //       <h2 className="text-xl font-semibold mb-4">SRS Documents ({srsDocs.length})</h2>
// //       {srsDocs.length === 0 ? (
// //         <p className="text-gray-500">No SRS documents created yet.</p>
// //       ) : (
// //         srsDocs.map((doc) => (
// //           <div key={doc._id} className="border p-4 rounded mb-4 bg-white shadow">
// //             <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>
// //             {editingDocId === doc._id ? (
// //               <>
// //                 <textarea
// //                   className="w-full border p-2 rounded h-40 mb-2"
// //                   value={editingContent}
// //                   onChange={(e) => setEditingContent(e.target.value)}
// //                 />
// //                 <div className="flex gap-2">
// //                   <button onClick={saveEdit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
// //                   <button onClick={cancelEdit} className="border px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
// //                 </div>
// //               </>
// //             ) : (
// //               <>
// //                 <p className="text-gray-700 mb-2 whitespace-pre-wrap">
// //                   {doc.versions[doc.versions.length - 1].content}
// //                 </p>
// //                 <div className="flex justify-between items-center">
// //                   <div className="text-sm text-gray-500 flex gap-4">
// //                     <span>
// //                       Version: {doc.versions[doc.versions.length - 1].version}
// //                     </span>
// //                     <span>
// //                       Author: {doc.versions[doc.versions.length - 1].author?.name || 'Unknown'}
// //                     </span>
// //                     <span>
// //                       Last updated: {new Date(
// //                         doc.versions[doc.versions.length - 1].createdAt
// //                       ).toLocaleString()}
// //                     </span>
// //                   </div>
// //                   <button onClick={() => startEdit(doc)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //         ))
// //       )}
// //       {/* Clarification Drawer */}
// //       {isClarifyOpen && (
// //         <div className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-white shadow-2xl border-l overflow-y-auto z-40">
// //           <div className="p-4 border-b flex items-center justify-between">
// //             <h3 className="text-lg font-semibold">Clarifications</h3>
// //             <button
// //               onClick={() => setIsClarifyOpen(false)}
// //               className="text-gray-600 hover:text-gray-900 border px-3 py-1 rounded"
// //             >
// //               Close
// //             </button>
// //           </div>
// //           <div className="p-4 space-y-4">
// //             {isClarifying ? (
// //               <div className="text-sm text-gray-600">Generating questions...</div>
// //             ) : clarifyQuestions.length === 0 ? (
// //               <div className="text-sm text-gray-600">No questions generated.</div>
// //             ) : (
// //               <div className="space-y-5">
// //                 {clarifyQuestions.map((q, idx) => (
// //                   <div key={idx} className="border rounded p-3 bg-gray-50">
// //                     <p className="text-sm font-medium mb-2">{q}</p>
// //                     <textarea
// //                       value={clarifyAnswers[idx] || ""}
// //                       onChange={(e) => handleClarifyAnswerChange(idx, e.target.value)}
// //                       className="w-full border rounded p-2 h-20"
// //                       placeholder="Your answer..."
// //                     />
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             <div className="pt-2 flex gap-2">
// //               <button
// //                 onClick={saveSrsAfterClarifications}
// //                 disabled={isSavingWithClarifications}
// //                 className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
// //               >
// //                 {isSavingWithClarifications ? 'Saving...' : 'Save SRS with Clarifications'}
// //               </button>
// //               <button
// //                 onClick={() => {
// //                   // Allow saving without answers by keeping questions empty
// //                   saveSrsAfterClarifications();
// //                 }}
// //                 disabled={isSavingWithClarifications}
// //                 className="px-4 py-2 rounded border hover:bg-gray-100"
// //               >
// //                 Skip & Save
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //     </div>
// //   );
// // }
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
//   const [statusUpdates, setStatusUpdates] = useState([]);
//   const [editingDocId, setEditingDocId] = useState(null);
//   const [editingContent, setEditingContent] = useState("");
  
//   // AI Generation states
//   const [showAIGenerator, setShowAIGenerator] = useState(false);
//   const [aiPrompt, setAiPrompt] = useState("");
//   const [selectedTheme, setSelectedTheme] = useState("blue");
//   const [generatedSRS, setGeneratedSRS] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [optionalRequirements, setOptionalRequirements] = useState([]);
//   const [selectedOptional, setSelectedOptional] = useState([]);

//   // Clarification chat states
//   const [isClarifyOpen, setIsClarifyOpen] = useState(false);
//   const [clarifyQuestions, setClarifyQuestions] = useState([]);
//   const [clarifyAnswers, setClarifyAnswers] = useState({});
//   const [isClarifying, setIsClarifying] = useState(false);
//   const [isSavingWithClarifications, setIsSavingWithClarifications] = useState(false);

//   const handleClarifyAnswerChange = (index, value) => {
//     setClarifyAnswers((prev) => ({ ...prev, [index]: value }));
//   };

//   const buildFinalContentWithClarifications = () => {
//     const base = `
// # ${generatedSRS.title}

// ## Project Overview
// ${generatedSRS.overview}

// ## Functional Requirements
// ${generatedSRS.functionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// ## Non-Functional Requirements
// ${generatedSRS.nonFunctionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// ## Technical Stack
// ${generatedSRS.technicalStack ? generatedSRS.technicalStack.join(', ') : 'To be determined'}

// ## Color Theme
// Primary: ${colorThemes.find(t => t.name === selectedTheme)?.text}
// `.trim();

//     const answeredPairs = clarifyQuestions
//       .map((q, i) => ({ q, a: (clarifyAnswers[i] || '').trim() }))
//       .filter((p) => p.a.length > 0);

//     if (answeredPairs.length === 0) return base;

//     const qaSection = `
// \n## Client Clarifications\n${answeredPairs
//       .map((p, i) => `${i + 1}. Q: ${p.q}\n   A: ${p.a}`)
//       .join('\n')}`;
//     return `${base}${qaSection}`;
//   };

//   const saveSrsAfterClarifications = async () => {
//     if (!generatedSRS || !token || !roomId) {
//       alert("Missing data to save SRS");
//       return;
//     }
//     setIsSavingWithClarifications(true);
//     setError("");
//     try {
//       const finalContent = buildFinalContentWithClarifications();
//       const res = await fetch("/api/srs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           roomId,
//           content: finalContent,
//           title: generatedSRS.title
//         }),
//       });

//       const data = await res.json();
//       if (!data.success) {
//         setError(`Failed to create SRS: ${data.error}`);
//         setIsSavingWithClarifications(false);
//         return;
//       }

//       const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const refreshData = await refreshRes.json();
//       if (refreshData.success) {
//         setSrsDocs(refreshData.srsDocuments || []);
//       }

//       setShowAIGenerator(false);
//       setAiPrompt("");
//       setGeneratedSRS(null);
//       setOptionalRequirements([]);
//       setSelectedOptional([]);
//       setIsClarifyOpen(false);
//       setClarifyQuestions([]);
//       setClarifyAnswers({});
//       alert("SRS saved with clarifications!");
//     } catch (err) {
//       setError("Error saving SRS with clarifications");
//       console.error("Save SRS clarifications error:", err);
//     } finally {
//       setIsSavingWithClarifications(false);
//     }
//   };

//   const colorThemes = [
//     { name: "blue", primary: "#3B82F6", secondary: "#DBEAFE", text: "Blue Ocean" },
//     { name: "green", primary: "#10B981", secondary: "#D1FAE5", text: "Fresh Green" },
//     { name: "purple", primary: "#8B5CF6", secondary: "#EDE9FE", text: "Royal Purple" },
//     { name: "orange", primary: "#F97316", secondary: "#FFEDD5", text: "Sunset Orange" },
//     { name: "pink", primary: "#EC4899", secondary: "#FCE7F3", text: "Vibrant Pink" },
//     { name: "teal", primary: "#14B8A6", secondary: "#CCFBF1", text: "Tropical Teal" },
//   ];

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
//           const res = await fetch(`/api/srs/room/${userRoomId}`, {
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
//           try {
//             const stRes = await fetch(`/api/project-status?roomId=${userRoomId}`);
//             const stData = await stRes.json();
//             if (stData.success) setStatusUpdates(stData.statuses || []);
//           } catch (_) {}
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

//   const generateSRSWithAI = async () => {
//     if (!aiPrompt.trim()) {
//       alert("Please enter a description for your project");
//       return;
//     }

//     setIsGenerating(true);
//     setError("");

//     try {
//       const res = await fetch("/api/groq/generate-srs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           prompt: aiPrompt,
//           theme: selectedTheme,
//         }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setGeneratedSRS(data.srs);
//         setOptionalRequirements(data.optionalRequirements || []);
//         setSelectedOptional([]);
//       } else {
//         setError(`AI Generation failed: ${data.error}`);
//       }
//     } catch (err) {
//       setError("Error generating SRS with AI");
//       console.error("AI Generation error:", err);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const toggleOptionalRequirement = (index) => {
//     setSelectedOptional(prev => {
//       if (prev.includes(index)) {
//         return prev.filter(i => i !== index);
//       } else {
//         return [...prev, index];
//       }
//     });
//   };

//   const createSrsFromAI = async () => {
//     if (!generatedSRS || !token || !roomId) {
//       alert("No generated SRS available");
//       return;
//     }

//     const finalRequirements = {
//       ...generatedSRS,
//       functionalRequirements: [
//         ...generatedSRS.functionalRequirements,
//         ...selectedOptional
//           .filter(i => optionalRequirements[i].type === 'functional')
//           .map(i => optionalRequirements[i].description)
//       ],
//       nonFunctionalRequirements: [
//         ...generatedSRS.nonFunctionalRequirements,
//         ...selectedOptional
//           .filter(i => optionalRequirements[i].type === 'non-functional')
//           .map(i => optionalRequirements[i].description)
//       ]
//     };

//     const formattedContent = `
// # ${generatedSRS.title}

// ## Project Overview
// ${generatedSRS.overview}

// ## Functional Requirements
// ${finalRequirements.functionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// ## Non-Functional Requirements
// ${finalRequirements.nonFunctionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// ## Technical Stack
// ${generatedSRS.technicalStack ? generatedSRS.technicalStack.join(', ') : 'To be determined'}

// ## Color Theme
// Primary: ${colorThemes.find(t => t.name === selectedTheme)?.text}
//     `.trim();

//     try {
//       setError("");

//       setIsClarifyOpen(true);
//       setIsClarifying(true);
//       setClarifyQuestions([]);
//       setClarifyAnswers({});

//       const clarifyRes = await fetch("/api/groq/clarify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           srs: {
//             title: generatedSRS.title,
//             overview: generatedSRS.overview,
//             functionalRequirements: finalRequirements.functionalRequirements,
//             nonFunctionalRequirements: finalRequirements.nonFunctionalRequirements,
//             technicalStack: generatedSRS.technicalStack || []
//           }
//         })
//       });
//       const clarifyData = await clarifyRes.json();
//       if (!clarifyData.success) {
//         setError(`Failed to get clarification questions: ${clarifyData.error || 'Unknown error'}`);
//         setIsClarifying(false);
//         return;
//       }
//       setClarifyQuestions(clarifyData.questions || []);
//       setIsClarifying(false);

//     } catch (err) {
//       setError("Error starting clarification phase");
//       console.error("Clarification start error:", err);
//       setIsClarifying(false);
//     }
//   };

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
//         const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const refreshData = await refreshRes.json();

//         if (refreshData.success) {
//           setSrsDocs(refreshData.srsDocuments || []);
//         }
//         try {
//           const stRes = await fetch(`/api/project-status?roomId=${roomId}`);
//           const stData = await stRes.json();
//           if (stData.success) setStatusUpdates(stData.statuses || []);
//         } catch (_) {}

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

//   const startEdit = (doc) => {
//     setEditingDocId(doc._id);
//     const latest = doc.versions[doc.versions.length - 1];
//     setEditingContent(latest.content || "");
//   };

//   const cancelEdit = () => {
//     setEditingDocId(null);
//     setEditingContent("");
//   };

//   const saveEdit = async () => {
//     if (!editingDocId || !editingContent.trim()) return;
//     try {
//       setError("");
//       const res = await fetch(`/api/srs/${editingDocId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ content: editingContent, changes: "Updated content" })
//       });
//       const data = await res.json();
//       if (!data.success) {
//         setError(`Failed to update SRS: ${data.error}`);
//         return;
//       }
//       const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const refreshData = await refreshRes.json();
//       if (refreshData.success) {
//         setSrsDocs(refreshData.srsDocuments || []);
//       }
//       try {
//         const stRes = await fetch(`/api/project-status?roomId=${roomId}`);
//         const stData = await stRes.json();
//         if (stData.success) setStatusUpdates(stData.statuses || []);
//       } catch (_) {}
//       cancelEdit();
//     } catch (err) {
//       setError("Error updating SRS document");
//       console.error("Update SRS error:", err);
//     }
//   };

//   if (!mounted || loading) return (
//     <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FFD5D5 0%, #FFC1C1 100%)'}}>
//       <p style={{color: '#3E1E68'}} className="text-xl font-semibold">Loading...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #FFD5D5 0%, #FFC1C1 50%, #FFB5B5 100%)'}}>
//       <div className="p-6 max-w-7xl mx-auto relative">
//         <div className="backdrop-blur-sm bg-white/30 rounded-2xl shadow-2xl p-8 mb-6">
//           <h1 className="text-4xl font-bold mb-2" style={{color: '#3E1E68'}}>Client Dashboard</h1>
//           <p className="text-lg" style={{color: '#5D2E8C'}}>Room: {roomId}</p>
//         </div>

//         {error && (
//           <div className="bg-red-100/90 backdrop-blur-sm border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-lg">
//             {error}
//           </div>
//         )}

//         {/* Manager Progress Updates */}
//         <div className="backdrop-blur-sm bg-white/40 rounded-2xl shadow-xl p-6 mb-8">
//           <h2 className="text-2xl font-bold mb-4" style={{color: '#3E1E68'}}>Project Progress</h2>
//           {statusUpdates.length === 0 ? (
//             <p style={{color: '#5D2E8C'}}>No progress updates yet.</p>
//           ) : (
//             <div className="space-y-4">
//               {statusUpdates.map((u) => (
//                 <div key={u._id} className="backdrop-blur-sm bg-white/60 rounded-xl p-4 shadow-md border border-white/50">
//                   <div className="flex justify-between text-sm mb-2" style={{color: '#5D2E8C'}}>
//                     <span className="font-semibold">By: {u.updatedBy?.name || u.updatedBy?.email || 'Unknown'}</span>
//                     <span>{new Date(u.createdAt).toLocaleString()}</span>
//                   </div>
//                   <div className="flex items-center gap-3 mb-2">
//                     <span className="font-bold" style={{color: '#3E1E68'}}>Progress:</span>
//                     <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden">
//                       <div 
//                         className="h-full rounded-full transition-all duration-500" 
//                         style={{width: `${u.progressPercent}%`, background: 'linear-gradient(90deg, #3E1E68 0%, #5D2E8C 100%)'}}
//                       />
//                     </div>
//                     <span className="font-bold" style={{color: '#3E1E68'}}>{u.progressPercent}%</span>
//                   </div>
//                   {u.comment && (
//                     <p style={{color: '#3E1E68'}} className="whitespace-pre-wrap mt-2">{u.comment}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Toggle Between Manual and AI */}
//         <div className="mb-8 flex gap-4">
//           <button
//             onClick={() => setShowAIGenerator(false)}
//             className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${!showAIGenerator ? 'shadow-xl scale-105' : 'hover:scale-105'}`}
//             style={{
//               background: !showAIGenerator ? 'linear-gradient(135deg, #3E1E68 0%, #5D2E8C 100%)' : 'rgba(255, 255, 255, 0.5)',
//               color: !showAIGenerator ? '#FFFFFF' : '#3E1E68',
//               backdropFilter: showAIGenerator ? 'blur(10px)' : 'none'
//             }}
//           >
//             Manual Creation
//           </button>
//           <button
//             onClick={() => setShowAIGenerator(true)}
//             className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${showAIGenerator ? 'shadow-xl scale-105' : 'hover:scale-105'}`}
//             style={{
//               background: showAIGenerator ? 'linear-gradient(135deg, #3E1E68 0%, #5D2E8C 100%)' : 'rgba(255, 255, 255, 0.5)',
//               color: showAIGenerator ? '#FFFFFF' : '#3E1E68',
//               backdropFilter: !showAIGenerator ? 'blur(10px)' : 'none'
//             }}
//           >
//             🤖 AI-Powered Generation
//           </button>
//         </div>

//         {showAIGenerator ? (
//           /* AI Generation Section */
//           <div className="mb-8 space-y-6">
//             {!generatedSRS ? (
//               <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-8 shadow-xl border border-white/50">
//                 <h2 className="text-3xl font-bold mb-6" style={{color: '#3E1E68'}}>AI SRS Generator</h2>

//                 {/* Color Theme Selection */}
//                 <div className="mb-8">
//                   <label className="block text-lg font-bold mb-4" style={{color: '#3E1E68'}}>
//                     Choose Color Theme
//                   </label>
//                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                     {colorThemes.map((theme) => (
//                       <button
//                         key={theme.name}
//                         onClick={() => setSelectedTheme(theme.name)}
//                         className={`p-4 rounded-xl border-2 transition-all backdrop-blur-sm ${
//                           selectedTheme === theme.name
//                             ? 'border-purple-900 shadow-2xl scale-105'
//                             : 'border-white/50 hover:border-purple-400 shadow-lg'
//                         }`}
//                         style={{ backgroundColor: theme.secondary }}
//                       >
//                         <div
//                           className="w-full h-10 rounded-lg mb-2 shadow-md"
//                           style={{ backgroundColor: theme.primary }}
//                         />
//                         <p className="text-xs font-bold text-center" style={{color: '#3E1E68'}}>{theme.text}</p>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Prompt Input */}
//                 <div className="mb-6">
//                   <label className="block text-lg font-bold mb-3" style={{color: '#3E1E68'}}>
//                     Describe Your Project
//                   </label>
//                   <textarea
//                     value={aiPrompt}
//                     onChange={(e) => setAiPrompt(e.target.value)}
//                     placeholder="Example: Create an e-commerce platform for selling handmade crafts with user authentication, shopping cart, payment integration, and admin dashboard..."
//                     className="w-full border-2 p-5 rounded-xl h-40 focus:outline-none shadow-lg backdrop-blur-sm bg-white/60"
//                     style={{borderColor: '#3E1E68', color: '#3E1E68'}}
//                   />
//                 </div>

//                 <button
//                   onClick={generateSRSWithAI}
//                   disabled={!aiPrompt.trim() || isGenerating}
//                   className="w-full text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
//                   style={{background: 'linear-gradient(135deg, #3E1E68 0%, #5D2E8C 100%)'}}
//                 >
//                   {isGenerating ? (
//                     <>
//                       <span className="animate-spin inline-block">⚙️</span> Generating SRS...
//                     </>
//                   ) : (
//                     <>✨ Generate SRS with AI</>
//                   )}
//                 </button>
//               </div>
//             ) : (
//               /* Generated SRS Review */
//               <div className="space-y-6">
//                 {/* Core SRS */}
//                 <div className="backdrop-blur-sm bg-white/50 rounded-2xl p-8 shadow-2xl border border-white/50">
//                   <div className="flex justify-between items-start mb-6">
//                     <h2 className="text-3xl font-bold" style={{color: '#3E1E68'}}>{generatedSRS.title}</h2>
//                     <div
//                       className="px-6 py-2 rounded-full text-white font-bold shadow-lg"
//                       style={{ backgroundColor: colorThemes.find(t => t.name === selectedTheme)?.primary }}
//                     >
//                       {colorThemes.find(t => t.name === selectedTheme)?.text}
//                     </div>
//                   </div>

//                   <div className="mb-6">
//                     <h3 className="text-xl font-bold mb-3" style={{color: '#3E1E68'}}>Overview</h3>
//                     <textarea
//                       value={generatedSRS.overview}
//                       onChange={(e) => setGeneratedSRS({...generatedSRS, overview: e.target.value})}
//                       className="w-full border-2 p-4 rounded-xl backdrop-blur-sm bg-white/70 shadow-md"
//                       style={{borderColor: '#3E1E68', color: '#3E1E68'}}
//                       rows="3"
//                     />
//                   </div>

//                   <div className="mb-6">
//                     <h3 className="text-xl font-bold mb-3" style={{color: '#3E1E68'}}>Functional Requirements</h3>
//                     {generatedSRS.functionalRequirements.map((req, index) => (
//                       <div key={index} className="mb-3">
//                         <textarea
//                           value={req}
//                           onChange={(e) => {
//                             const updated = [...generatedSRS.functionalRequirements];
//                             updated[index] = e.target.value;
//                             setGeneratedSRS({...generatedSRS, functionalRequirements: updated});
//                           }}
//                           className="w-full border-2 p-3 rounded-xl backdrop-blur-sm bg-white/70 shadow-md"
//                           style={{borderColor: '#3E1E68', color: '#3E1E68'}}
//                           rows="2"
//                         />
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mb-6">
//                     <h3 className="text-xl font-bold mb-3" style={{color: '#3E1E68'}}>Non-Functional Requirements</h3>
//                     {generatedSRS.nonFunctionalRequirements.map((req, index) => (
//                       <div key={index} className="mb-3">
//                         <textarea
//                           value={req}
//                           onChange={(e) => {
//                             const updated = [...generatedSRS.nonFunctionalRequirements];
//                             updated[index] = e.target.value;
//                             setGeneratedSRS({...generatedSRS, nonFunctionalRequirements: updated});
//                           }}
//                           className="w-full border-2 p-3 rounded-xl backdrop-blur-sm bg-white/70 shadow-md"
//                           style={{borderColor: '#3E1E68', color: '#3E1E68'}}
//                           rows="2"
//                         />
//                       </div>
//                     ))}
//                   </div>

//                   {generatedSRS.technicalStack && (
//                     <div>
//                       <h3 className="text-xl font-bold mb-3" style={{color: '#3E1E68'}}>Suggested Technical Stack</h3>
//                       <div className="flex flex-wrap gap-3">
//                         {generatedSRS.technicalStack.map((tech, index) => (
//                           <span key={index} className="backdrop-blur-sm bg-white/70 px-4 py-2 rounded-full text-sm font-semibold shadow-md" style={{color: '#3E1E68'}}>
//                             {tech}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Optional Requirements */}
//                 {optionalRequirements.length > 0 && (
//                   <div className="backdrop-blur-sm bg-yellow-100/60 border-2 border-yellow-400 rounded-2xl p-8 shadow-xl">
//                     <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{color: '#3E1E68'}}>
//                       ⭐ Optional Requirements
//                       <span className="text-sm font-normal" style={{color: '#5D2E8C'}}>
//                         (Select any you'd like to include)
//                       </span>
//                     </h3>
//                     <div className="space-y-4">
//                       {optionalRequirements.map((req, index) => (
//                         <div
//                           key={index}
//                           onClick={() => toggleOptionalRequirement(index)}
//                           className={`p-5 rounded-xl border-2 cursor-pointer transition-all shadow-lg ${
//                             selectedOptional.includes(index)
//                               ? 'border-green-600 bg-green-100/80 scale-105'
//                               : 'border-white/50 bg-white/50 hover:border-yellow-500'
//                           }`}
//                         >
//                           <div className="flex items-start gap-4">
//                             <input
//                               type="checkbox"
//                               checked={selectedOptional.includes(index)}
//                               onChange={() => toggleOptionalRequirement(index)}
//                               className="mt-1 w-6 h-6"
//                             />
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-2">
//                                 <span className={`text-xs font-bold px-3 py-1 rounded-full ${
//                                   req.type === 'functional' ? 'bg-blue-200 text-blue-800' : 'bg-purple-200 text-purple-800'
//                                 }`}>
//                                   {req.type === 'functional' ? 'Functional' : 'Non-Functional'}
//                                 </span>
//                               </div>
//                               <p style={{color: '#3E1E68'}} className="font-medium">{req.description}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <p className="text-sm mt-4 font-semibold" style={{color: '#3E1E68'}}>
//                       {selectedOptional.length} optional requirement(s) selected
//                     </p>
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex gap-4">
//                   <button
//                     onClick={createSrsFromAI}
//                     className="flex-1 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl"
//                     style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}
//                   >
//                     ✓ Continue to Clarifications
//                   </button>
//                   <button
//                     onClick={() => {
//                       setGeneratedSRS(null);
//                       setOptionalRequirements([]);
//                       setSelectedOptional([]);
//                     }}
//                     className="px-8 py-4 rounded-xl font-bold backdrop-blur-sm bg-white/60 transition-all shadow-lg hover:shadow-xl border-2 border-white/50"
//                     style={{color: '#3E1E68'}}
//                   >
//                     ← Back to Generator
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           /* Manual Creation Section */
//           <div className="mb-8 backdrop-blur-sm bg-white/40 rounded-2xl p-6 shadow-xl border border-white/50">
//             <h2 className="text-2xl font-bold mb-4" style={{color: '#3E1E68'}}>Create New SRS Document</h2>

//             <div className="mb-4">
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Document Title (optional)"
//                 className="w-full border-2 p-3 rounded-xl mb-3 backdrop-blur-sm bg-white/70 shadow-md"
//                 style={{borderColor: '#3E1E68', color: '#3E1E68'}}
//               />
//             </div>

//             <textarea
//               value={newContent}
//               onChange={(e) => setNewContent(e.target.value)}
//               placeholder="Write your SRS content here..."
//               className="w-full border-2 p-4 rounded-xl h-40 backdrop-blur-sm bg-white/70 shadow-md"
//               style={{borderColor: '#3E1E68', color: '#3E1E68'}}
//             />

//             <button
//               onClick={createSrs}
//               disabled={!newContent.trim()}
//               className="mt-4 text-white px-8 py-3 rounded-xl font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
//               style={{background: 'linear-gradient(135deg, #3E1E68 0%, #5D2E8C 100%)'}}
//             >
//               Create SRS Document
//             </button>
//           </div>
//         )}

//         {/* Existing SRS Documents */}
//         <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-6 shadow-xl border border-white/50">
//           <h2 className="text-2xl font-bold mb-6" style={{color: '#3E1E68'}}>SRS Documents ({srsDocs.length})</h2>
//           {srsDocs.length === 0 ? (
//             <p style={{color: '#5D2E8C'}}>No SRS documents created yet.</p>
//           ) : (
//             <div className="space-y-4">
//               {srsDocs.map((doc) => (
//                 <div key={doc._id} className="backdrop-blur-sm bg-white/60 rounded-xl p-6 shadow-lg border border-white/50">
//                   <h3 className="font-bold text-xl mb-4" style={{color: '#3E1E68'}}>{doc.title}</h3>
//                   {editingDocId === doc._id ? (
//                     <>
//                       <textarea
//                         className="w-full border-2 p-4 rounded-xl h-48 mb-4 backdrop-blur-sm bg-white/70 shadow-md"
//                         style={{borderColor: '#3E1E68', color: '#3E1E68'}}
//                         value={editingContent}
//                         onChange={(e) => setEditingContent(e.target.value)}
//                       />
//                       <div className="flex gap-3">
//                         <button 
//                           onClick={saveEdit} 
//                           className="text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
//                           style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}
//                         >
//                           Save
//                         </button>
//                         <button 
//                           onClick={cancelEdit} 
//                           className="backdrop-blur-sm bg-white/60 px-6 py-2 rounded-xl font-bold border-2 border-white/50 shadow-lg hover:shadow-xl transition-all"
//                           style={{color: '#3E1E68'}}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <p className="mb-4 whitespace-pre-wrap backdrop-blur-sm bg-white/40 p-4 rounded-lg" style={{color: '#3E1E68'}}>
//                         {doc.versions[doc.versions.length - 1].content}
//                       </p>
//                       <div className="flex justify-between items-center">
//                         <div className="text-sm flex gap-4" style={{color: '#5D2E8C'}}>
//                           <span className="font-semibold">
//                             Version: {doc.versions[doc.versions.length - 1].version}
//                           </span>
//                           <span className="font-semibold">
//                             Author: {doc.versions[doc.versions.length - 1].author?.name || 'Unknown'}
//                           </span>
//                           <span className="font-semibold">
//                             Last updated: {new Date(
//                               doc.versions[doc.versions.length - 1].createdAt
//                             ).toLocaleString()}
//                           </span>
//                         </div>
//                         <button 
//                           onClick={() => startEdit(doc)} 
//                           className="text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
//                           style={{background: 'linear-gradient(135deg, #3E1E68 0%, #5D2E8C 100%)'}}
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Clarification Drawer - Dark Theme */}
//         {isClarifyOpen && (
//           <div className="fixed top-0 right-0 h-full w-full md:w-[420px] shadow-2xl border-l overflow-y-auto z-40"
//                style={{background: 'linear-gradient(180deg, #2D1B4E 0%, #1A0F2E 100%)'}}>
//             <div className="p-5 border-b flex items-center justify-between" style={{borderColor: '#4A3068'}}>
//               <h3 className="text-xl font-bold" style={{color: '#FFD5D5'}}>Clarifications</h3>
//               <button
//                 onClick={() => setIsClarifyOpen(false)}
//                 className="px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg backdrop-blur-sm"
//                 style={{background: 'rgba(255, 213, 213, 0.2)', color: '#FFD5D5', border: '1px solid rgba(255, 213, 213, 0.3)'}}
//               >
//                 Close
//               </button>
//             </div>
//             <div className="p-5 space-y-5">
//               {isClarifying ? (
//                 <div className="text-center py-8">
//                   <div className="animate-spin text-4xl mb-3">⚙️</div>
//                   <div className="text-sm font-medium" style={{color: '#FFD5D5'}}>Generating questions...</div>
//                 </div>
//               ) : clarifyQuestions.length === 0 ? (
//                 <div className="text-sm text-center py-8" style={{color: '#FFD5D5'}}>No questions generated.</div>
//               ) : (
//                 <div className="space-y-5">
//                   {clarifyQuestions.map((q, idx) => (
//                     <div key={idx} className="rounded-xl p-5 backdrop-blur-sm shadow-lg" style={{background: 'rgba(255, 213, 213, 0.1)', border: '1px solid rgba(255, 213, 213, 0.2)'}}>
//                       <div className="flex items-start gap-3 mb-3">
//                         <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{background: '#FFD5D5', color: '#3E1E68'}}>
//                           {idx + 1}
//                         </span>
//                         <p className="text-sm font-semibold leading-relaxed" style={{color: '#FFD5D5'}}>{q}</p>
//                       </div>
//                       <textarea
//                         value={clarifyAnswers[idx] || ""}
//                         onChange={(e) => handleClarifyAnswerChange(idx, e.target.value)}
//                         className="w-full rounded-lg p-4 h-24 backdrop-blur-sm shadow-inner"
//                         style={{background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 213, 213, 0.3)', color: '#FFD5D5'}}
//                         placeholder="Your answer..."
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="pt-4 space-y-3">
//                 <button
//                   onClick={saveSrsAfterClarifications}
//                   disabled={isSavingWithClarifications}
//                   className="w-full text-white px-6 py-4 rounded-xl fdbont-bold transition-all shadow-xl hover:shadow-2xl disabled:opacity-50"
//                   style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}
//                 >
//                   {isSavingWithClarifications ? (
//                     <>
//                       <span className="animate-spin inline-block">⚙️</span> Saving...
//                     </>
//                   ) : (
//                     'Save SRS with Clarifications'
//                   )}
//                 </button>
//                 <button
//                   onClick={() => {
//                     saveSrsAfterClarifications();
//                   }}
//                   disabled={isSavingWithClarifications}
//                   className="w-full px-6 py-3 rounded-xl font-semibold backdrop-blur-sm transition-all hover:shadow-lg"
//                   style={{background: 'rgba(255, 213, 213, 0.2)', color: '#FFD5D5', border: '1px solid rgba(255, 213, 213, 0.3)'}}
//                 >
//                   Skip & Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
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
//   const [statusUpdates, setStatusUpdates] = useState([]);
//   const [editingDocId, setEditingDocId] = useState(null);
//   const [editingContent, setEditingContent] = useState("");
  
//   // AI Generation states
//   const [showAIGenerator, setShowAIGenerator] = useState(false);
//   const [aiPrompt, setAiPrompt] = useState("");
//   const [selectedTheme, setSelectedTheme] = useState("blue");
//   const [generatedSRS, setGeneratedSRS] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [optionalRequirements, setOptionalRequirements] = useState([]);
//   const [selectedOptional, setSelectedOptional] = useState([]);

//   // Clarification chat states
//   const [isClarifyOpen, setIsClarifyOpen] = useState(false);
//   const [clarifyQuestions, setClarifyQuestions] = useState([]);
//   const [clarifyAnswers, setClarifyAnswers] = useState({});
//   const [isClarifying, setIsClarifying] = useState(false);
//   const [isSavingWithClarifications, setIsSavingWithClarifications] = useState(false);

//   // Navigation state
//   const [activeSection, setActiveSection] = useState("progress");

//   const handleClarifyAnswerChange = (index, value) => {
//     setClarifyAnswers((prev) => ({ ...prev, [index]: value }));
//   };

//   const buildFinalContentWithClarifications = () => {
//     const base = `
// # ${generatedSRS.title}

// ## Project Overview
// ${generatedSRS.overview}

// ## Functional Requirements
// ${generatedSRS.functionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// ## Non-Functional Requirements
// ${generatedSRS.nonFunctionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// ## Technical Stack
// ${generatedSRS.technicalStack ? generatedSRS.technicalStack.join(', ') : 'To be determined'}

// ## Color Theme
// Primary: ${colorThemes.find(t => t.name === selectedTheme)?.text}
// `.trim();

//     const answeredPairs = clarifyQuestions
//       .map((q, i) => ({ q, a: (clarifyAnswers[i] || '').trim() }))
//       .filter((p) => p.a.length > 0);

//     if (answeredPairs.length === 0) return base;

//     const qaSection = `
// \n## Client Clarifications\n${answeredPairs
//       .map((p, i) => `${i + 1}. Q: ${p.q}\n   A: ${p.a}`)
//       .join('\n')}`;
//     return `${base}${qaSection}`;
//   };

//   const saveSrsAfterClarifications = async () => {
//     if (!generatedSRS || !token || !roomId) {
//       alert("Missing data to save SRS");
//       return;
//     }
//     setIsSavingWithClarifications(true);
//     setError("");
//     try {
//       const finalContent = buildFinalContentWithClarifications();
//       const res = await fetch("/api/srs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           roomId,
//           content: finalContent,
//           title: generatedSRS.title
//         }),
//       });

//       const data = await res.json();
//       if (!data.success) {
//         setError(`Failed to create SRS: ${data.error}`);
//         setIsSavingWithClarifications(false);
//         return;
//       }

//       const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const refreshData = await refreshRes.json();
//       if (refreshData.success) {
//         setSrsDocs(refreshData.srsDocuments || []);
//       }

//       setShowAIGenerator(false);
//       setAiPrompt("");
//       setGeneratedSRS(null);
//       setOptionalRequirements([]);
//       setSelectedOptional([]);
//       setIsClarifyOpen(false);
//       setClarifyQuestions([]);
//       setClarifyAnswers({});
//       alert("SRS saved with clarifications!");
//     } catch (err) {
//       setError("Error saving SRS with clarifications");
//       console.error("Save SRS clarifications error:", err);
//     } finally {
//       setIsSavingWithClarifications(false);
//     }
//   };

//   const colorThemes = [
//     { name: "blue", primary: "#3B82F6", secondary: "#DBEAFE", text: "Blue Ocean" },
//     { name: "green", primary: "#10B981", secondary: "#D1FAE5", text: "Fresh Green" },
//     { name: "purple", primary: "#8B5CF6", secondary: "#EDE9FE", text: "Royal Purple" },
//     { name: "orange", primary: "#F97316", secondary: "#FFEDD5", text: "Sunset Orange" },
//     { name: "pink", primary: "#EC4899", secondary: "#FCE7F3", text: "Vibrant Pink" },
//     { name: "teal", primary: "#14B8A6", secondary: "#CCFBF1", text: "Tropical Teal" },
//   ];

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
//           const res = await fetch(`/api/srs/room/${userRoomId}`, {
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
//           try {
//             const stRes = await fetch(`/api/project-status?roomId=${userRoomId}`);
//             const stData = await stRes.json();
//             if (stData.success) setStatusUpdates(stData.statuses || []);
//           } catch (_) {}
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

//   const generateSRSWithAI = async () => {
//     if (!aiPrompt.trim()) {
//       alert("Please enter a description for your project");
//       return;
//     }

//     setIsGenerating(true);
//     setError("");

//     try {
//       const res = await fetch("/api/groq/generate-srs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           prompt: aiPrompt,
//           theme: selectedTheme,
//         }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setGeneratedSRS(data.srs);
//         setOptionalRequirements(data.optionalRequirements || []);
//         setSelectedOptional([]);
//       } else {
//         setError(`AI Generation failed: ${data.error}`);
//       }
//     } catch (err) {
//       setError("Error generating SRS with AI");
//       console.error("AI Generation error:", err);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const toggleOptionalRequirement = (index) => {
//     setSelectedOptional(prev => {
//       if (prev.includes(index)) {
//         return prev.filter(i => i !== index);
//       } else {
//         return [...prev, index];
//       }
//     });
//   };

//   const createSrsFromAI = async () => {
//     if (!generatedSRS || !token || !roomId) {
//       alert("No generated SRS available");
//       return;
//     }

//     const finalRequirements = {
//       ...generatedSRS,
//       functionalRequirements: [
//         ...generatedSRS.functionalRequirements,
//         ...selectedOptional
//           .filter(i => optionalRequirements[i].type === 'functional')
//           .map(i => optionalRequirements[i].description)
//       ],
//       nonFunctionalRequirements: [
//         ...generatedSRS.nonFunctionalRequirements,
//         ...selectedOptional
//           .filter(i => optionalRequirements[i].type === 'non-functional')
//           .map(i => optionalRequirements[i].description)
//       ]
//     };

//     const formattedContent = `
// # ${generatedSRS.title}

// ## Project Overview
// ${generatedSRS.overview}

// ## Functional Requirements
// ${finalRequirements.functionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// ## Non-Functional Requirements
// ${finalRequirements.nonFunctionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

// ## Technical Stack
// ${generatedSRS.technicalStack ? generatedSRS.technicalStack.join(', ') : 'To be determined'}

// ## Color Theme
// Primary: ${colorThemes.find(t => t.name === selectedTheme)?.text}
//     `.trim();

//     try {
//       setError("");

//       setIsClarifyOpen(true);
//       setIsClarifying(true);
//       setClarifyQuestions([]);
//       setClarifyAnswers({});

//       const clarifyRes = await fetch("/api/groq/clarify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           srs: {
//             title: generatedSRS.title,
//             overview: generatedSRS.overview,
//             functionalRequirements: finalRequirements.functionalRequirements,
//             nonFunctionalRequirements: finalRequirements.nonFunctionalRequirements,
//             technicalStack: generatedSRS.technicalStack || []
//           }
//         })
//       });
//       const clarifyData = await clarifyRes.json();
//       if (!clarifyData.success) {
//         setError(`Failed to get clarification questions: ${clarifyData.error || 'Unknown error'}`);
//         setIsClarifying(false);
//         return;
//       }
//       setClarifyQuestions(clarifyData.questions || []);
//       setIsClarifying(false);

//     } catch (err) {
//       setError("Error starting clarification phase");
//       console.error("Clarification start error:", err);
//       setIsClarifying(false);
//     }
//   };

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
//         const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const refreshData = await refreshRes.json();

//         if (refreshData.success) {
//           setSrsDocs(refreshData.srsDocuments || []);
//         }
//         try {
//           const stRes = await fetch(`/api/project-status?roomId=${roomId}`);
//           const stData = await stRes.json();
//           if (stData.success) setStatusUpdates(stData.statuses || []);
//         } catch (_) {}

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

//   const startEdit = (doc) => {
//     setEditingDocId(doc._id);
//     const latest = doc.versions[doc.versions.length - 1];
//     setEditingContent(latest.content || "");
//   };

//   const cancelEdit = () => {
//     setEditingDocId(null);
//     setEditingContent("");
//   };

//   const saveEdit = async () => {
//     if (!editingDocId || !editingContent.trim()) return;
//     try {
//       setError("");
//       const res = await fetch(`/api/srs/${editingDocId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ content: editingContent, changes: "Updated content" })
//       });
//       const data = await res.json();
//       if (!data.success) {
//         setError(`Failed to update SRS: ${data.error}`);
//         return;
//       }
//       const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const refreshData = await refreshRes.json();
//       if (refreshData.success) {
//         setSrsDocs(refreshData.srsDocuments || []);
//       }
//       try {
//         const stRes = await fetch(`/api/project-status?roomId=${roomId}`);
//         const stData = await stRes.json();
//         if (stData.success) setStatusUpdates(stData.statuses || []);
//       } catch (_) {}
//       cancelEdit();
//     } catch (err) {
//       setError("Error updating SRS document");
//       console.error("Update SRS error:", err);
//     }
//   };

//   if (!mounted || loading) return (
//     <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FFD5D5 0%, #FFC1C1 100%)'}}>
//       <p style={{color: '#3E1E68'}} className="text-xl font-semibold">Loading...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen flex" style={{background: 'linear-gradient(135deg, #d182ffff 0%, #410073ff 50%, #ca98f6ff 100%)'}}>
//       {/* Sidebar Navigation */}
//       <div className="w-64 backdrop-blur-sm bg-white/20 p-6 border-r border-white/30">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold" style={{color: '#3E1E68'}}>Client Dashboard</h1>
//           <p className="text-sm mt-2" style={{color: '#5D2E8C'}}>Room: {roomId}</p>
//         </div>
        
//         <nav className="space-y-2">
//           <button
//             onClick={() => setActiveSection("progress")}
//             className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
//               activeSection === "progress" 
//                 ? "shadow-lg scale-105" 
//                 : "hover:scale-105"
//             }`}
//             style={{
//               background: activeSection === "progress" 
//                 ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
//                 : 'rgba(255, 255, 255, 0.3)',
//               color: activeSection === "progress" ? '#FFFFFF' : '#3E1E68',
//               backdropFilter: 'blur(10px)'
//             }}
//           >
//             View Progress
//           </button>
          
//           <button
//             onClick={() => {
//               setActiveSection("manual");
//               setShowAIGenerator(false);
//             }}
//             className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
//               activeSection === "manual" 
//                 ? "shadow-lg scale-105" 
//                 : "hover:scale-105"
//             }`}
//             style={{
//               background: activeSection === "manual" 
//                 ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
//                 : 'rgba(255, 255, 255, 0.3)',
//               color: activeSection === "manual" ? '#FFFFFF' : '#3E1E68',
//               backdropFilter: 'blur(10px)'
//             }}
//           >
//              Manual Creation of SRS
//           </button>
          
//           <button
//             onClick={() => {
//               setActiveSection("ai");
//               setShowAIGenerator(true);
//             }}
//             className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
//               activeSection === "ai" 
//                 ? "shadow-lg scale-105" 
//                 : "hover:scale-105"
//             }`}
//             style={{
//               background: activeSection === "ai" 
//                 ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
//                 : 'rgba(255, 255, 255, 0.3)',
//               color: activeSection === "ai" ? '#FFFFFF' : '#3E1E68',
//               backdropFilter: 'blur(10px)'
//             }}
//           >
//              AI Creation of SRS
//           </button>
          
//           <button
//             onClick={() => setActiveSection("documents")}
//             className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
//               activeSection === "documents" 
//                 ? "shadow-lg scale-105" 
//                 : "hover:scale-105"
//             }`}
//             style={{
//               background: activeSection === "documents" 
//                 ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
//                 : 'rgba(255, 255, 255, 0.3)',
//               color: activeSection === "documents" ? '#FFFFFF' : '#3E1E68',
//               backdropFilter: 'blur(10px)'
//             }}
//           >
//              SRS Documents
//           </button>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         <div className="max-w-6xl mx-auto">
//           {error && (
//             <div className="bg-red-100/90 backdrop-blur-sm border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-lg">
//               {error}
//             </div>
//           )}

//           {/* Progress Section */}
//           {activeSection === "progress" && (
//             <div className="backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//               <h2 className="text-2xl font-bold mb-4 text-white">Project Progress</h2>
//               {statusUpdates.length === 0 ? (
//                 <p className="text-purple-200">No progress updates yet.</p>
//               ) : (
//                 <div className="space-y-4">
//                   {statusUpdates.map((u) => (
//                     <div key={u._id} className="backdrop-blur-sm bg-white/10 rounded-xl p-4 shadow-md border border-white/20">
//                       <div className="flex justify-between text-sm mb-2 text-purple-200">
//                         <span className="font-semibold">By: {u.updatedBy?.name || u.updatedBy?.email || 'Unknown'}</span>
//                         <span>{new Date(u.createdAt).toLocaleString()}</span>
//                       </div>
//                       <div className="flex items-center gap-3 mb-2">
//                         <span className="font-bold text-white">Progress:</span>
//                         <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
//                           <div 
//                             className="h-full rounded-full transition-all duration-500" 
//                             style={{width: `${u.progressPercent}%`, background: 'linear-gradient(90deg, #FFD5D5 0%, #FFB5B5 100%)'}}
//                           />
//                         </div>
//                         <span className="font-bold text-white">{u.progressPercent}%</span>
//                       </div>
//                       {u.comment && (
//                         <p className="text-white whitespace-pre-wrap mt-2">{u.comment}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Manual Creation Section */}
//           {activeSection === "manual" && (
//             <div className="backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-8" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//               <h2 className="text-2xl font-bold mb-4 text-white">Create New SRS Document</h2>

//               <div className="mb-4">
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Document Title (optional)"
//                   className="w-full border-2 p-3 rounded-xl mb-3 backdrop-blur-sm bg-white/10 shadow-md text-white placeholder-purple-300"
//                   style={{borderColor: '#8B5CF6'}}
//                 />
//               </div>

//               <textarea
//                 value={newContent}
//                 onChange={(e) => setNewContent(e.target.value)}
//                 placeholder="Write your SRS content here..."
//                 className="w-full border-2 p-4 rounded-xl h-40 backdrop-blur-sm bg-white/10 shadow-md text-white placeholder-purple-300"
//                 style={{borderColor: '#8B5CF6'}}
//               />

//               <button
//                 onClick={createSrs}
//                 disabled={!newContent.trim()}
//                 className="mt-4 text-white px-8 py-3 rounded-xl font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
//                 style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
//               >
//                 Create SRS Document
//               </button>
//             </div>
//           )}

//           {/* AI Generation Section */}
//           {activeSection === "ai" && (
//             <div className="mb-8 space-y-6">
//               {!generatedSRS ? (
//                 <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//                   <h2 className="text-3xl font-bold mb-6 text-white">AI SRS Generator</h2>

//                   {/* Color Theme Selection */}
//                   <div className="mb-8">
//                     <label className="block text-lg font-bold mb-4 text-white">
//                       Choose Color Theme
//                     </label>
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                       {colorThemes.map((theme) => (
//                         <button
//                           key={theme.name}
//                           onClick={() => setSelectedTheme(theme.name)}
//                           className={`p-4 rounded-xl border-2 transition-all backdrop-blur-sm ${
//                             selectedTheme === theme.name
//                               ? 'border-purple-400 shadow-2xl scale-105'
//                               : 'border-white/30 hover:border-purple-400 shadow-lg'
//                           }`}
//                           style={{ backgroundColor: theme.secondary + '20' }}
//                         >
//                           <div
//                             className="w-full h-10 rounded-lg mb-2 shadow-md"
//                             style={{ backgroundColor: theme.primary }}
//                           />
//                           <p className="text-xs font-bold text-center text-white">{theme.text}</p>
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Prompt Input */}
//                   <div className="mb-6">
//                     <label className="block text-lg font-bold mb-3 text-white">
//                       Describe Your Project
//                     </label>
//                     <textarea
//                       value={aiPrompt}
//                       onChange={(e) => setAiPrompt(e.target.value)}
//                       placeholder="Example: Create an e-commerce platform for selling handmade crafts with user authentication, shopping cart, payment integration, and admin dashboard..."
//                       className="w-full border-2 p-5 rounded-xl h-40 focus:outline-none shadow-lg backdrop-blur-sm bg-white/10 text-white placeholder-purple-300"
//                       style={{borderColor: '#8B5CF6'}}
//                     />
//                   </div>

//                   <button
//                     onClick={generateSRSWithAI}
//                     disabled={!aiPrompt.trim() || isGenerating}
//                     className="w-full text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
//                     style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
//                   >
//                     {isGenerating ? (
//                       <>
//                         <span className="animate-spin inline-block">⚙️</span> Generating SRS...
//                       </>
//                     ) : (
//                       <>✨ Generate SRS with AI</>
//                     )}
//                   </button>
//                 </div>
//               ) : (
//                 /* Generated SRS Review */
//                 <div className="space-y-6">
//                   {/* Core SRS */}
//                   <div className="backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//                     <div className="flex justify-between items-start mb-6">
//                       <h2 className="text-3xl font-bold text-white">{generatedSRS.title}</h2>
//                       <div
//                         className="px-6 py-2 rounded-full text-white font-bold shadow-lg"
//                         style={{ backgroundColor: colorThemes.find(t => t.name === selectedTheme)?.primary }}
//                       >
//                         {colorThemes.find(t => t.name === selectedTheme)?.text}
//                       </div>
//                     </div>

//                     <div className="mb-6">
//                       <h3 className="text-xl font-bold mb-3 text-white">Overview</h3>
//                       <textarea
//                         value={generatedSRS.overview}
//                         onChange={(e) => setGeneratedSRS({...generatedSRS, overview: e.target.value})}
//                         className="w-full border-2 p-4 rounded-xl backdrop-blur-sm bg-white/10 shadow-md text-white"
//                         style={{borderColor: '#8B5CF6'}}
//                         rows="3"
//                       />
//                     </div>

//                     <div className="mb-6">
//                       <h3 className="text-xl font-bold mb-3 text-white">Functional Requirements</h3>
//                       {generatedSRS.functionalRequirements.map((req, index) => (
//                         <div key={index} className="mb-3">
//                           <textarea
//                             value={req}
//                             onChange={(e) => {
//                               const updated = [...generatedSRS.functionalRequirements];
//                               updated[index] = e.target.value;
//                               setGeneratedSRS({...generatedSRS, functionalRequirements: updated});
//                             }}
//                             className="w-full border-2 p-3 rounded-xl backdrop-blur-sm bg-white/10 shadow-md text-white"
//                             style={{borderColor: '#8B5CF6'}}
//                             rows="2"
//                           />
//                         </div>
//                       ))}
//                     </div>

//                     <div className="mb-6">
//                       <h3 className="text-xl font-bold mb-3 text-white">Non-Functional Requirements</h3>
//                       {generatedSRS.nonFunctionalRequirements.map((req, index) => (
//                         <div key={index} className="mb-3">
//                           <textarea
//                             value={req}
//                             onChange={(e) => {
//                               const updated = [...generatedSRS.nonFunctionalRequirements];
//                               updated[index] = e.target.value;
//                               setGeneratedSRS({...generatedSRS, nonFunctionalRequirements: updated});
//                             }}
//                             className="w-full border-2 p-3 rounded-xl backdrop-blur-sm bg-white/10 shadow-md text-white"
//                             style={{borderColor: '#8B5CF6'}}
//                             rows="2"
//                           />
//                         </div>
//                       ))}
//                     </div>

//                     {generatedSRS.technicalStack && (
//                       <div>
//                         <h3 className="text-xl font-bold mb-3 text-white">Suggested Technical Stack</h3>
//                         <div className="flex flex-wrap gap-3">
//                           {generatedSRS.technicalStack.map((tech, index) => (
//                             <span key={index} className="backdrop-blur-sm bg-white/20 px-4 py-2 rounded-full text-sm font-semibold shadow-md text-white">
//                               {tech}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Optional Requirements */}
//                   {optionalRequirements.length > 0 && (
//                     <div className="backdrop-blur-sm bg-yellow-500/20 border-2 border-yellow-400/50 rounded-2xl p-8 shadow-xl">
//                       <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
//                         ⭐ Optional Requirements
//                         <span className="text-sm font-normal text-yellow-200">
//                           (Select any you'd like to include)
//                         </span>
//                       </h3>
//                       <div className="space-y-4">
//                         {optionalRequirements.map((req, index) => (
//                           <div
//                             key={index}
//                             onClick={() => toggleOptionalRequirement(index)}
//                             className={`p-5 rounded-xl border-2 cursor-pointer transition-all shadow-lg ${
//                               selectedOptional.includes(index)
//                                 ? 'border-green-400 bg-green-500/20 scale-105'
//                                 : 'border-white/30 bg-white/10 hover:border-yellow-400'
//                             }`}
//                           >
//                             <div className="flex items-start gap-4">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedOptional.includes(index)}
//                                 onChange={() => toggleOptionalRequirement(index)}
//                                 className="mt-1 w-6 h-6"
//                               />
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2 mb-2">
//                                   <span className={`text-xs font-bold px-3 py-1 rounded-full ${
//                                     req.type === 'functional' ? 'bg-blue-500/30 text-blue-200' : 'bg-purple-500/30 text-purple-200'
//                                   }`}>
//                                     {req.type === 'functional' ? 'Functional' : 'Non-Functional'}
//                                   </span>
//                                 </div>
//                                 <p className="font-medium text-white">{req.description}</p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                       <p className="text-sm mt-4 font-semibold text-yellow-200">
//                         {selectedOptional.length} optional requirement(s) selected
//                       </p>
//                     </div>
//                   )}

//                   {/* Action Buttons */}
//                   <div className="flex gap-4">
//                     <button
//                       onClick={createSrsFromAI}
//                       className="flex-1 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl"
//                       style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}
//                     >
//                       ✓ Continue to Clarifications
//                     </button>
//                     <button
//                       onClick={() => {
//                         setGeneratedSRS(null);
//                         setOptionalRequirements([]);
//                         setSelectedOptional([]);
//                       }}
//                       className="px-8 py-4 rounded-xl font-bold backdrop-blur-sm bg-white/20 transition-all shadow-lg hover:shadow-xl border-2 border-white/30 text-white"
//                     >
//                       ← Back to Generator
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* SRS Documents Section */}
//           {activeSection === "documents" && (
//             <div className="backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
//               <h2 className="text-2xl font-bold mb-6 text-white">SRS Documents ({srsDocs.length})</h2>
//               {srsDocs.length === 0 ? (
//                 <p className="text-purple-200">No SRS documents created yet.</p>
//               ) : (
//                 <div className="space-y-4">
//                   {srsDocs.map((doc) => (
//                     <div key={doc._id} className="backdrop-blur-sm bg-white/10 rounded-xl p-6 shadow-lg border border-white/20">
//                       <h3 className="font-bold text-xl mb-4 text-white">{doc.title}</h3>
//                       {editingDocId === doc._id ? (
//                         <>
//                           <textarea
//                             className="w-full border-2 p-4 rounded-xl h-48 mb-4 backdrop-blur-sm bg-white/10 shadow-md text-white"
//                             style={{borderColor: '#8B5CF6'}}
//                             value={editingContent}
//                             onChange={(e) => setEditingContent(e.target.value)}
//                           />
//                           <div className="flex gap-3">
//                             <button 
//                               onClick={saveEdit} 
//                               className="text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
//                               style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}
//                             >
//                               Save
//                             </button>
//                             <button 
//                               onClick={cancelEdit} 
//                               className="backdrop-blur-sm bg-white/20 px-6 py-2 rounded-xl font-bold border-2 border-white/30 shadow-lg hover:shadow-xl transition-all text-white"
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </>
//                       ) : (
//                         <>
//                           <p className="mb-4 whitespace-pre-wrap backdrop-blur-sm bg-white/10 p-4 rounded-lg text-white">
//                             {doc.versions[doc.versions.length - 1].content}
//                           </p>
//                           <div className="flex justify-between items-center">
//                             <div className="text-sm flex gap-4 text-purple-200">
//                               <span className="font-semibold">
//                                 Version: {doc.versions[doc.versions.length - 1].version}
//                               </span>
//                               <span className="font-semibold">
//                                 Author: {doc.versions[doc.versions.length - 1].author?.name || 'Unknown'}
//                               </span>
//                               <span className="font-semibold">
//                                 Last updated: {new Date(
//                                   doc.versions[doc.versions.length - 1].createdAt
//                                 ).toLocaleString()}
//                               </span>
//                             </div>
//                             <button 
//                               onClick={() => startEdit(doc)} 
//                               className="text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
//                               style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
//                             >
//                               Edit
//                             </button>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Clarification Drawer - Dark Theme */}
//         {isClarifyOpen && (
//           <div className="fixed top-0 right-0 h-full w-full md:w-[420px] shadow-2xl border-l overflow-y-auto z-40"
//                style={{background: 'linear-gradient(180deg, #2D1B4E 0%, #1A0F2E 100%)'}}>
//             <div className="p-5 border-b flex items-center justify-between" style={{borderColor: '#4A3068'}}>
//               <h3 className="text-xl font-bold" style={{color: '#FFD5D5'}}>Clarifications</h3>
//               <button
//                 onClick={() => setIsClarifyOpen(false)}
//                 className="px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg backdrop-blur-sm"
//                 style={{background: 'rgba(255, 213, 213, 0.2)', color: '#FFD5D5', border: '1px solid rgba(255, 213, 213, 0.3)'}}
//               >
//                 Close
//               </button>
//             </div>
//             <div className="p-5 space-y-5">
//               {isClarifying ? (
//                 <div className="text-center py-8">
//                   <div className="animate-spin text-4xl mb-3">⚙️</div>
//                   <div className="text-sm font-medium" style={{color: '#FFD5D5'}}>Generating questions...</div>
//                 </div>
//               ) : clarifyQuestions.length === 0 ? (
//                 <div className="text-sm text-center py-8" style={{color: '#FFD5D5'}}>No questions generated.</div>
//               ) : (
//                 <div className="space-y-5">
//                   {clarifyQuestions.map((q, idx) => (
//                     <div key={idx} className="rounded-xl p-5 backdrop-blur-sm shadow-lg" style={{background: 'rgba(255, 213, 213, 0.1)', border: '1px solid rgba(255, 213, 213, 0.2)'}}>
//                       <div className="flex items-start gap-3 mb-3">
//                         <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{background: '#FFD5D5', color: '#3E1E68'}}>
//                           {idx + 1}
//                         </span>
//                         <p className="text-sm font-semibold leading-relaxed" style={{color: '#FFD5D5'}}>{q}</p>
//                       </div>
//                       <textarea
//                         value={clarifyAnswers[idx] || ""}
//                         onChange={(e) => handleClarifyAnswerChange(idx, e.target.value)}
//                         className="w-full rounded-lg p-4 h-24 backdrop-blur-sm shadow-inner"
//                         style={{background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 213, 213, 0.3)', color: '#FFD5D5'}}
//                         placeholder="Your answer..."
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="pt-4 space-y-3">
//                 <button
//                   onClick={saveSrsAfterClarifications}
//                   disabled={isSavingWithClarifications}
//                   className="w-full text-white px-6 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl disabled:opacity-50"
//                   style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}
//                 >
//                   {isSavingWithClarifications ? (
//                     <>
//                       <span className="animate-spin inline-block">⚙️</span> Saving...
//                     </>
//                   ) : (
//                     'Save SRS with Clarifications'
//                   )}
//                 </button>
//                 <button
//                   onClick={() => {
//                     saveSrsAfterClarifications();
//                   }}
//                   disabled={isSavingWithClarifications}
//                   className="w-full px-6 py-3 rounded-xl font-semibold backdrop-blur-sm transition-all hover:shadow-lg"
//                   style={{background: 'rgba(255, 213, 213, 0.2)', color: '#000000ff', border: '1px solid rgba(255, 213, 213, 0.3)'}}
//                 >
//                   Skip & Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
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

  // Clarification chat states
  const [isClarifyOpen, setIsClarifyOpen] = useState(false);
  const [clarifyQuestions, setClarifyQuestions] = useState([]);
  const [clarifyAnswers, setClarifyAnswers] = useState({});
  const [isClarifying, setIsClarifying] = useState(false);
  const [isSavingWithClarifications, setIsSavingWithClarifications] = useState(false);

  // Navigation state
  const [activeSection, setActiveSection] = useState("progress");
// Add this with your other state declarations
const [userData, setUserData] = useState(null);
const [homeLoading, setHomeLoading] = useState(false);
  const handleClarifyAnswerChange = (index, value) => {
    setClarifyAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const fetchUserData = async () => {
  if (!token) {
    setError("No authentication token found");
    return;
  }

  setHomeLoading(true);
  setError("");

  try {
    const response = await fetch('/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setUserData(data);
    
  } catch (err) {
    setError(`Error loading user data: ${err.message}`);
    console.error("Fetch user data error:", err);
  } finally {
    setHomeLoading(false);
  }
};

  const buildFinalContentWithClarifications = () => {
    const base = `
# ${generatedSRS.title}

## Project Overview
${generatedSRS.overview}

## Functional Requirements
${generatedSRS.functionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

## Non-Functional Requirements
${generatedSRS.nonFunctionalRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

## Technical Stack
${generatedSRS.technicalStack ? generatedSRS.technicalStack.join(', ') : 'To be determined'}

## Color Theme
Primary: ${colorThemes.find(t => t.name === selectedTheme)?.text}
`.trim();

    const answeredPairs = clarifyQuestions
      .map((q, i) => ({ q, a: (clarifyAnswers[i] || '').trim() }))
      .filter((p) => p.a.length > 0);

    if (answeredPairs.length === 0) return base;

    const qaSection = `
\n## Client Clarifications\n${answeredPairs
      .map((p, i) => `${i + 1}. Q: ${p.q}\n   A: ${p.a}`)
      .join('\n')}`;
    return `${base}${qaSection}`;
  };

  const saveSrsAfterClarifications = async () => {
    if (!generatedSRS || !token || !roomId) {
      alert("Missing data to save SRS");
      return;
    }
    setIsSavingWithClarifications(true);
    setError("");
    try {
      const finalContent = buildFinalContentWithClarifications();
      const res = await fetch("/api/srs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId,
          content: finalContent,
          title: generatedSRS.title
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(`Failed to create SRS: ${data.error}`);
        setIsSavingWithClarifications(false);
        return;
      }

      const refreshRes = await fetch(`/api/srs/room/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const refreshData = await refreshRes.json();
      if (refreshData.success) {
        setSrsDocs(refreshData.srsDocuments || []);
      }

      setShowAIGenerator(false);
      setAiPrompt("");
      setGeneratedSRS(null);
      setOptionalRequirements([]);
      setSelectedOptional([]);
      setIsClarifyOpen(false);
      setClarifyQuestions([]);
      setClarifyAnswers({});
      alert("SRS saved with clarifications!");
    } catch (err) {
      setError("Error saving SRS with clarifications");
      console.error("Save SRS clarifications error:", err);
    } finally {
      setIsSavingWithClarifications(false);
    }
  };

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
    
    (async () => {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        const storedCurrent = localStorage.getItem('currentRoomId');
        const selectedRoomId = (storedCurrent || payload.roomId || '').toUpperCase();

        if (selectedRoomId) {
          setRoomId(selectedRoomId);
          if (!storedCurrent) {
            localStorage.setItem('currentRoomId', selectedRoomId);
          }

          // Load SRS and status for the selected room
          try {
            setError("");
            const res = await fetch(`/api/srs/room/${selectedRoomId}`, {
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
            try {
              const stRes = await fetch(`/api/project-status?roomId=${selectedRoomId}`);
              const stData = await stRes.json();
              if (stData.success) setStatusUpdates(stData.statuses || []);
            } catch (_) {}
          } catch (err) {
            setError("Network error loading SRS documents");
            console.error("Fetch error:", err);
          } finally {
            setLoading(false);
          }
        } else {
          // No room in token or storage; load profile so user can pick a room
          setLoading(false);
          setActiveSection("home");
          fetchUserData();
        }
      } catch (err) {
        console.error("Error parsing token:", err);
        localStorage.removeItem("token");
        window.location.href = "/register";
      }
    })();
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

      setIsClarifyOpen(true);
      setIsClarifying(true);
      setClarifyQuestions([]);
      setClarifyAnswers({});

      const clarifyRes = await fetch("/api/groq/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          srs: {
            title: generatedSRS.title,
            overview: generatedSRS.overview,
            functionalRequirements: finalRequirements.functionalRequirements,
            nonFunctionalRequirements: finalRequirements.nonFunctionalRequirements,
            technicalStack: generatedSRS.technicalStack || []
          }
        })
      });
      const clarifyData = await clarifyRes.json();
      if (!clarifyData.success) {
        setError(`Failed to get clarification questions: ${clarifyData.error || 'Unknown error'}`);
        setIsClarifying(false);
        return;
      }
      setClarifyQuestions(clarifyData.questions || []);
      setIsClarifying(false);

    } catch (err) {
      setError("Error starting clarification phase");
      console.error("Clarification start error:", err);
      setIsClarifying(false);
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

  // Allow client to join/switch a room similar to developer flow
  const joinRoom = async (roomIdToJoin) => {
    if (!token || !roomIdToJoin || !userData?.user?.email) return;

    try {
      const response = await fetch(`/api/rooms/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: roomIdToJoin,
          userEmail: userData.user.email,
          userType: 'client',
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
        setRoomId(roomIdToJoin);
        localStorage.setItem('currentRoomId', roomIdToJoin);
        // reload room data for new room
        try {
          const srsRes = await fetch(`/api/srs/room/${roomIdToJoin}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const srsData = await srsRes.json();
          if (srsData.success) setSrsDocs(srsData.srsDocuments || []);
        } catch (_) {}
        try {
          const stRes = await fetch(`/api/project-status?roomId=${roomIdToJoin}`);
          const stData = await stRes.json();
          if (stData.success) setStatusUpdates(stData.statuses || []);
        } catch (_) {}
        setActiveSection('progress');
      }
    } catch (err) {
      console.error('Join room error (client):', err);
      // Fallback to just set the room locally
      setRoomId(roomIdToJoin);
      localStorage.setItem('currentRoomId', roomIdToJoin);
      setActiveSection('progress');
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
// Add this useEffect with your other useEffects
useEffect(() => {
  if (activeSection === "home" && token && !userData) {
    fetchUserData();
  }
}, [activeSection, token, userData]);

  if (!mounted || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FFD5D5 0%, #FFC1C1 100%)'}}>
      <p style={{color: '#3E1E68'}} className="text-xl font-semibold">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{background: 'linear-gradient(135deg, #d182ffff 0%, #410073ff 50%, #ca98f6ff 100%)'}}>
      {/* Sidebar Navigation */}
      <div className="w-64 backdrop-blur-sm bg-white/20 p-6 border-r border-white/30">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{color: '#3E1E68'}}>Client Dashboard</h1>
          <p className="text-sm mt-2" style={{color: '#5D2E8C'}}>Room: {roomId}</p>
        </div>
        
        <nav className="space-y-2">
           <button
    onClick={() => setActiveSection("home")}
    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
      activeSection === "home" 
        ? "shadow-lg scale-105" 
        : "hover:scale-105"
    }`}
    style={{
      background: activeSection === "home" 
        ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
        : 'rgba(255, 255, 255, 0.3)',
      color: activeSection === "home" ? '#FFFFFF' : '#3E1E68',
      backdropFilter: 'blur(10px)'
    }}
  >
    🏠 Home & Profile
  </button>
          <button
            onClick={() => setActiveSection("progress")}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeSection === "progress" 
                ? "shadow-lg scale-105" 
                : "hover:scale-105"
            }`}
            style={{
              background: activeSection === "progress" 
                ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
                : 'rgba(255, 255, 255, 0.3)',
              color: activeSection === "progress" ? '#FFFFFF' : '#3E1E68',
              backdropFilter: 'blur(10px)'
            }}
          >
            View Progress
          </button>
          
          <button
            onClick={() => {
              setActiveSection("manual");
              setShowAIGenerator(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeSection === "manual" 
                ? "shadow-lg scale-105" 
                : "hover:scale-105"
            }`}
            style={{
              background: activeSection === "manual" 
                ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
                : 'rgba(255, 255, 255, 0.3)',
              color: activeSection === "manual" ? '#FFFFFF' : '#3E1E68',
              backdropFilter: 'blur(10px)'
            }}
          >
             Manual Creation of SRS
          </button>
          
          <button
            onClick={() => {
              setActiveSection("ai");
              setShowAIGenerator(true);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeSection === "ai" 
                ? "shadow-lg scale-105" 
                : "hover:scale-105"
            }`}
            style={{
              background: activeSection === "ai" 
                ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
                : 'rgba(255, 255, 255, 0.3)',
              color: activeSection === "ai" ? '#FFFFFF' : '#3E1E68',
              backdropFilter: 'blur(10px)'
            }}
          >
             AI Creation of SRS
          </button>
          
          <button
            onClick={() => setActiveSection("documents")}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              activeSection === "documents" 
                ? "shadow-lg scale-105" 
                : "hover:scale-105"
            }`}
            style={{
              background: activeSection === "documents" 
                ? 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)' 
                : 'rgba(255, 255, 255, 0.3)',
              color: activeSection === "documents" ? '#FFFFFF' : '#3E1E68',
              backdropFilter: 'blur(10px)'
            }}
          >
             SRS Documents
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Home/Profile Section */}
          {activeSection === "home" && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-white">Client Profile</h2>
                  <button
                    onClick={fetchUserData}
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
                ) : (
                  <div className="text-center py-8">
                    <p className="text-purple-200 mb-4">No user data loaded yet</p>
                    <button
                      onClick={fetchUserData}
                      className="text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                      style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
                    >
                      Load My Data
                    </button>
                  </div>
                )}
              </div>

              {/* Rooms List */}
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
                          onClick={() => joinRoom(room.roomId)}
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
          {error && (
            <div className="bg-red-100/90 backdrop-blur-sm border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-lg">
              {error}
            </div>
          )}

          {/* User info Section */}
          {/* Add this with your other section renders */}
{activeSection === "home" && (
  <div className="space-y-6">
    {/* User Profile Card */}
    <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-bold text-white">User Profile</h2>
        <button
          onClick={fetchUserData}
          disabled={homeLoading}
          className="px-6 py-2 rounded-xl font-bold backdrop-blur-sm bg-white/20 transition-all shadow-lg hover:shadow-xl border-2 border-white/30 text-white disabled:opacity-50"
        >
          {homeLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {homeLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin text-4xl mb-3">⚙️</div>
          <p className="text-purple-200">Loading user data...</p>
        </div>
      ) : userData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Information */}
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
              <div>
                <label className="text-sm font-semibold text-purple-200">Member Since</label>
                <p className="text-white text-lg">
                  {new Date(userData.user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 text-white">Project Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-purple-200">Total Rooms Joined</span>
                <span className="text-white font-bold text-xl">{userData.rooms.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200">SRS Documents Created</span>
                <span className="text-white font-bold text-xl">{userData.srsDocuments.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200">User Role</span>
                <span className="text-white font-bold text-xl capitalize">{userData.user.role}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-purple-200 mb-4">No user data loaded yet</p>
          <button
            onClick={fetchUserData}
            className="text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
          >
            Load My Data
          </button>
        </div>
      )}
    </div>

    {/* Joined Rooms Section */}
    {userData && userData.rooms.length > 0 && (
      <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
        <h3 className="text-2xl font-bold mb-6 text-white">Joined Rooms ({userData.rooms.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userData.rooms.map((room) => (
            <div key={room.id} className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20 hover:scale-105 transition-transform">
              <h4 className="font-bold text-lg mb-3 text-white">Room: {room.roomId}</h4>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-purple-200">Manager:</span>
                  <p className="text-white font-semibold">{room.manager?.name || room.manager?.email}</p>
                </div>
                
                <div>
                  <span className="text-purple-200">Clients:</span>
                  <p className="text-white">
                    {room.clients?.length > 0 
                      ? room.clients.map(client => client.name || client.email).join(', ')
                      : 'No clients'
                    }
                  </p>
                </div>
                
                <div>
                  <span className="text-purple-200">Developers:</span>
                  <p className="text-white">
                    {room.developers?.length > 0
                      ? room.developers.map(dev => dev.name || dev.email).join(', ')
                      : 'No developers'
                    }
                  </p>
                </div>
                
                <div>
                  <span className="text-purple-200">Created:</span>
                  <p className="text-white">{new Date(room.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* SRS Documents Section (for clients) */}
    {userData && userData.user.role === 'client' && userData.srsDocuments.length > 0 && (
      <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
        <h3 className="text-2xl font-bold mb-6 text-white">My SRS Documents ({userData.srsDocuments.length})</h3>
        <div className="space-y-4">
          {userData.srsDocuments.map((doc) => (
            <div key={doc.id} className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20">
              <h4 className="font-bold text-xl mb-2 text-white">{doc.title}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-purple-200">Room:</span>
                  <p className="text-white font-semibold">{doc.room?.roomId}</p>
                </div>
                <div>
                  <span className="text-purple-200">Created:</span>
                  <p className="text-white">{new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-purple-200">Last Updated:</span>
                  <p className="text-white">{new Date(doc.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Empty States */}
    {userData && userData.rooms.length === 0 && (
      <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
        <h3 className="text-2xl font-bold mb-4 text-white">No Rooms Joined</h3>
        <p className="text-purple-200">You haven't joined any project rooms yet.</p>
      </div>
    )}

    {userData && userData.user.role === 'client' && userData.srsDocuments.length === 0 && (
      <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
        <h3 className="text-2xl font-bold mb-4 text-white">No SRS Documents</h3>
        <p className="text-purple-200">You haven't created any SRS documents yet.</p>
      </div>
    )}
  </div>
)}

          {/* Progress Section */}
          {activeSection === "progress" && (
            <div className="backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
              <h2 className="text-2xl font-bold mb-4 text-white">Project Progress</h2>
              {statusUpdates.length === 0 ? (
                <p className="text-purple-200">No progress updates yet.</p>
              ) : (
                <div className="space-y-4">
                  {statusUpdates.map((u) => (
                    <div key={u._id} className="backdrop-blur-sm bg-white/10 rounded-xl p-4 shadow-md border border-white/20">
                      <div className="flex justify-between text-sm mb-2 text-purple-200">
                        <span className="font-semibold">By: {u.updatedBy?.name || u.updatedBy?.email || 'Unknown'}</span>
                        <span>{new Date(u.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-white">Progress:</span>
                        <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{width: `${u.progressPercent}%`, background: 'linear-gradient(90deg, #FFD5D5 0%, #FFB5B5 100%)'}}
                          />
                        </div>
                        <span className="font-bold text-white">{u.progressPercent}%</span>
                      </div>
                      {u.comment && (
                        <p className="text-white whitespace-pre-wrap mt-2">{u.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Manual Creation Section */}
          {activeSection === "manual" && (
            <div className="backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-8" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
              <h2 className="text-2xl font-bold mb-4 text-white">Create New SRS Document</h2>

              <div className="mb-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Document Title (optional)"
                  className="w-full border-2 p-3 rounded-xl mb-3 backdrop-blur-sm bg-white/10 shadow-md text-white placeholder-purple-300"
                  style={{borderColor: '#8B5CF6'}}
                />
              </div>

              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your SRS content here..."
                className="w-full border-2 p-4 rounded-xl h-40 backdrop-blur-sm bg-white/10 shadow-md text-white placeholder-purple-300"
                style={{borderColor: '#8B5CF6'}}
              />

              <button
                onClick={createSrs}
                disabled={!newContent.trim()}
                className="mt-4 text-white px-8 py-3 rounded-xl font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
                style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
              >
                Create SRS Document
              </button>
            </div>
          )}

          {/* AI Generation Section */}
          {activeSection === "ai" && (
            <div className="mb-8 space-y-6">
              {!generatedSRS ? (
                <div className="backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
                  <h2 className="text-3xl font-bold mb-6 text-white">AI SRS Generator</h2>

                  {/* Color Theme Selection */}
                  <div className="mb-8">
                    <label className="block text-lg font-bold mb-4 text-white">
                      Choose Color Theme
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {colorThemes.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => setSelectedTheme(theme.name)}
                          className={`p-4 rounded-xl border-2 transition-all backdrop-blur-sm ${
                            selectedTheme === theme.name
                              ? 'border-purple-400 shadow-2xl scale-105'
                              : 'border-white/30 hover:border-purple-400 shadow-lg'
                          }`}
                          style={{ backgroundColor: theme.secondary + '20' }}
                        >
                          <div
                            className="w-full h-10 rounded-lg mb-2 shadow-md"
                            style={{ backgroundColor: theme.primary }}
                          />
                          <p className="text-xs font-bold text-center text-white">{theme.text}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prompt Input */}
                  <div className="mb-6">
                    <label className="block text-lg font-bold mb-3 text-white">
                      Describe Your Project
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Example: Create an e-commerce platform for selling handmade crafts with user authentication, shopping cart, payment integration, and admin dashboard..."
                      className="w-full border-2 p-5 rounded-xl h-40 focus:outline-none shadow-lg backdrop-blur-sm bg-white/10 text-white placeholder-purple-300"
                      style={{borderColor: '#8B5CF6'}}
                    />
                  </div>

                  <button
                    onClick={generateSRSWithAI}
                    disabled={!aiPrompt.trim() || isGenerating}
                    className="w-full text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
                    style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
                  >
                    {isGenerating ? (
                      <>
                        <span className="animate-spin inline-block">⚙️</span> Generating SRS...
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
                  <div className="backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-3xl font-bold text-white">{generatedSRS.title}</h2>
                      <div
                        className="px-6 py-2 rounded-full text-white font-bold shadow-lg"
                        style={{ backgroundColor: colorThemes.find(t => t.name === selectedTheme)?.primary }}
                      >
                        {colorThemes.find(t => t.name === selectedTheme)?.text}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-3 text-white">Overview</h3>
                      <textarea
                        value={generatedSRS.overview}
                        onChange={(e) => setGeneratedSRS({...generatedSRS, overview: e.target.value})}
                        className="w-full border-2 p-4 rounded-xl backdrop-blur-sm bg-white/10 shadow-md text-white"
                        style={{borderColor: '#8B5CF6'}}
                        rows="3"
                      />
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-3 text-white">Functional Requirements</h3>
                      {generatedSRS.functionalRequirements.map((req, index) => (
                        <div key={index} className="mb-3">
                          <textarea
                            value={req}
                            onChange={(e) => {
                              const updated = [...generatedSRS.functionalRequirements];
                              updated[index] = e.target.value;
                              setGeneratedSRS({...generatedSRS, functionalRequirements: updated});
                            }}
                            className="w-full border-2 p-3 rounded-xl backdrop-blur-sm bg-white/10 shadow-md text-white"
                            style={{borderColor: '#8B5CF6'}}
                            rows="2"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-3 text-white">Non-Functional Requirements</h3>
                      {generatedSRS.nonFunctionalRequirements.map((req, index) => (
                        <div key={index} className="mb-3">
                          <textarea
                            value={req}
                            onChange={(e) => {
                              const updated = [...generatedSRS.nonFunctionalRequirements];
                              updated[index] = e.target.value;
                              setGeneratedSRS({...generatedSRS, nonFunctionalRequirements: updated});
                            }}
                            className="w-full border-2 p-3 rounded-xl backdrop-blur-sm bg-white/10 shadow-md text-white"
                            style={{borderColor: '#8B5CF6'}}
                            rows="2"
                          />
                        </div>
                      ))}
                    </div>

                    {generatedSRS.technicalStack && (
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-white">Suggested Technical Stack</h3>
                        <div className="flex flex-wrap gap-3">
                          {generatedSRS.technicalStack.map((tech, index) => (
                            <span key={index} className="backdrop-blur-sm bg-white/20 px-4 py-2 rounded-full text-sm font-semibold shadow-md text-white">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optional Requirements */}
                  {optionalRequirements.length > 0 && (
                    <div className="backdrop-blur-sm bg-yellow-500/20 border-2 border-yellow-400/50 rounded-2xl p-8 shadow-xl">
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                        ⭐ Optional Requirements
                        <span className="text-sm font-normal text-yellow-200">
                          (Select any you'd like to include)
                        </span>
                      </h3>
                      <div className="space-y-4">
                        {optionalRequirements.map((req, index) => (
                          <div
                            key={index}
                            onClick={() => toggleOptionalRequirement(index)}
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all shadow-lg ${
                              selectedOptional.includes(index)
                                ? 'border-green-400 bg-green-500/20 scale-105'
                                : 'border-white/30 bg-white/10 hover:border-yellow-400'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <input
                                type="checkbox"
                                checked={selectedOptional.includes(index)}
                                onChange={() => toggleOptionalRequirement(index)}
                                className="mt-1 w-6 h-6"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                    req.type === 'functional' ? 'bg-blue-500/30 text-blue-200' : 'bg-purple-500/30 text-purple-200'
                                  }`}>
                                    {req.type === 'functional' ? 'Functional' : 'Non-Functional'}
                                  </span>
                                </div>
                                <p className="font-medium text-white">{req.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm mt-4 font-semibold text-yellow-200">
                        {selectedOptional.length} optional requirement(s) selected
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={createSrsFromAI}
                      className="flex-1 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl"
                      style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}
                    >
                      ✓ Continue to Clarifications
                    </button>
                    <button
                      onClick={() => {
                        setGeneratedSRS(null);
                        setOptionalRequirements([]);
                        setSelectedOptional([]);
                      }}
                      className="px-8 py-4 rounded-xl font-bold backdrop-blur-sm bg-white/20 transition-all shadow-lg hover:shadow-xl border-2 border-white/30 text-white"
                    >
                      ← Back to Generator
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SRS Documents Section */}
          {activeSection === "documents" && (
            <div className="backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20" style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)'}}>
              <h2 className="text-2xl font-bold mb-6 text-white">SRS Documents ({srsDocs.length})</h2>
              {srsDocs.length === 0 ? (
                <p className="text-purple-200">No SRS documents created yet.</p>
              ) : (
                <div className="space-y-4">
                  {srsDocs.map((doc) => (
                    <div key={doc._id} className="backdrop-blur-sm bg-white/10 rounded-xl p-6 shadow-lg border border-white/20">
                      <h3 className="font-bold text-xl mb-4 text-white">{doc.title}</h3>
                      {editingDocId === doc._id ? (
                        <>
                          <textarea
                            className="w-full border-2 p-4 rounded-xl h-48 mb-4 backdrop-blur-sm bg-white/10 shadow-md text-white"
                            style={{borderColor: '#8B5CF6'}}
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                          />
                          <div className="flex gap-3">
                            <button 
                              onClick={saveEdit} 
                              className="text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                              style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}
                            >
                              Save
                            </button>
                            <button 
                              onClick={cancelEdit} 
                              className="backdrop-blur-sm bg-white/20 px-6 py-2 rounded-xl font-bold border-2 border-white/30 shadow-lg hover:shadow-xl transition-all text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-4 whitespace-pre-wrap backdrop-blur-sm bg-white/10 p-4 rounded-lg text-white">
                            {doc.versions[doc.versions.length - 1].content}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="text-sm flex gap-4 text-purple-200">
                              <span className="font-semibold">
                                Version: {doc.versions[doc.versions.length - 1].version}
                              </span>
                              <span className="font-semibold">
                                Author: {doc.versions[doc.versions.length - 1].author?.name || 'Unknown'}
                              </span>
                              <span className="font-semibold">
                                Last updated: {new Date(
                                  doc.versions[doc.versions.length - 1].createdAt
                                ).toLocaleString()}
                              </span>
                            </div>
                            <button 
                              onClick={() => startEdit(doc)} 
                              className="text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                              style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'}}
                            >
                              Edit
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clarification Drawer - Dark Theme */}
        {isClarifyOpen && (
          <div className="fixed top-0 right-0 h-full w-full md:w-[420px] shadow-2xl border-l overflow-y-auto z-40"
               style={{background: 'linear-gradient(180deg, #2D1B4E 0%, #1A0F2E 100%)'}}>
            <div className="p-5 border-b flex items-center justify-between" style={{borderColor: '#4A3068'}}>
              <h3 className="text-xl font-bold" style={{color: '#FFD5D5'}}>Clarifications</h3>
              <button
                onClick={() => setIsClarifyOpen(false)}
                className="px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg backdrop-blur-sm"
                style={{background: 'rgba(255, 213, 213, 0.2)', color: '#FFD5D5', border: '1px solid rgba(255, 213, 213, 0.3)'}}
              >
                Close
              </button>
            </div>
            <div className="p-5 space-y-5">
              {isClarifying ? (
                <div className="text-center py-8">
                  <div className="animate-spin text-4xl mb-3">⚙️</div>
                  <div className="text-sm font-medium" style={{color: '#FFD5D5'}}>Generating questions...</div>
                </div>
              ) : clarifyQuestions.length === 0 ? (
                <div className="text-sm text-center py-8" style={{color: '#FFD5D5'}}>No questions generated.</div>
              ) : (
                <div className="space-y-5">
                  {clarifyQuestions.map((q, idx) => (
                    <div key={idx} className="rounded-xl p-5 backdrop-blur-sm shadow-lg" style={{background: 'rgba(255, 213, 213, 0.1)', border: '1px solid rgba(255, 213, 213, 0.2)'}}>
                      <div className="flex items-start gap-3 mb-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{background: '#FFD5D5', color: '#3E1E68'}}>
                          {idx + 1}
                        </span>
                        <p className="text-sm font-semibold leading-relaxed" style={{color: '#FFD5D5'}}>{q}</p>
                      </div>
                      <textarea
                        value={clarifyAnswers[idx] || ""}
                        onChange={(e) => handleClarifyAnswerChange(idx, e.target.value)}
                        className="w-full rounded-lg p-4 h-24 backdrop-blur-sm shadow-inner"
                        style={{background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 213, 213, 0.3)', color: '#FFD5D5'}}
                        placeholder="Your answer..."
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 space-y-3">
                <button
                  onClick={saveSrsAfterClarifications}
                  disabled={isSavingWithClarifications}
                  className="w-full text-white px-6 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}
                >
                  {isSavingWithClarifications ? (
                    <>
                      <span className="animate-spin inline-block">⚙️</span> Saving...
                    </>
                  ) : (
                    'Save SRS with Clarifications'
                  )}
                </button>
                <button
                  onClick={() => {
                    saveSrsAfterClarifications();
                  }}
                  disabled={isSavingWithClarifications}
                  className="w-full px-6 py-3 rounded-xl font-semibold backdrop-blur-sm transition-all hover:shadow-lg"
                  style={{background: 'rgba(255, 213, 213, 0.2)', color: '#000000ff', border: '1px solid rgba(255, 213, 213, 0.3)'}}
                >
                  Skip & Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}