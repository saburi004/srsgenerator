// "use client";

// import { useState } from "react";

// export default function RegisterPage() {
//   const [email, setEmail] = useState("");
//   const [userType, setUserType] = useState("client");
//   const [roomId, setRoomId] = useState("");
//   const [message, setMessage] = useState("");

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("/api/rooms/join", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userEmail: email, userType, roomId }),
//       });

//       const data = await res.json();

//      if (data.success) {
//   localStorage.setItem("token", data.token);

//   // Decode token to get role
//   const payload = JSON.parse(atob(data.token.split(".")[1]));
//   const role = payload.role;

//   // Redirect based on role
//   if (role === "client") {
//     window.location.href = "/dashboard/client";
//   } else if (role === "developer") {
//     window.location.href = "/dashboard/developer";
//   }
// }
//     } catch (err) {
//       setMessage("⚠️ Something went wrong");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleRegister}
//         className="bg-white p-6 rounded-xl shadow-md w-96"
//       >
//         <h2 className="text-xl font-bold mb-4 text-center">Join Room</h2>

//         <label className="block mb-2">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="w-full border rounded px-3 py-2 mb-4"
//         />

//         <label className="block mb-2">Room ID</label>
//         <input
//           type="text"
//           value={roomId}
//           onChange={(e) => setRoomId(e.target.value)}
//           required
//           className="w-full border rounded px-3 py-2 mb-4"
//         />

//         <label className="block mb-2">User Type</label>
//         <select
//           value={userType}
//           onChange={(e) => setUserType(e.target.value)}
//           className="w-full border rounded px-3 py-2 mb-4"
//         >
//           <option value="client">Client</option>
//           <option value="developer">Developer</option>
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           Join Room
//         </button>

//         {message && (
//           <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
//         )}
//       </form>
//     </div>
//   );
// }
"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("client");
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: email, userType, roomId }),
      });
      const data = await res.json();
      if (data.success) {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const role = payload.role;
        if (role === "client") {
          window.location.href = "/dashboard/client";
        } else if (role === "developer") {
          window.location.href = "/dashboard/developer";
        }
      }
    } catch (err) {
      setMessage("⚠️ Something went wrong");
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    console.log("Creating room:", newRoomName);
    setShowCreateRoom(false);
    setNewRoomName("");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#3E1E68] via-[#5D2F77] to-[#3E1E68] overflow-hidden">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFACAC] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5D2F77] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <button
        onClick={() => setShowCreateRoom(true)}
        className="absolute top-8 right-8 z-10 group relative px-6 py-3 font-semibold text-white overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFACAC] to-[#5D2F77] rounded-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#5D2F77] to-[#FFACAC] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-[2px] bg-[#3E1E68] rounded-[10px] group-hover:bg-opacity-80 transition-all duration-300"></div>
        <span className="relative z-10 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Room
        </span>
      </button>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-[#FFACAC] via-[#5D2F77] to-[#FFACAC] animate-shimmer" style={{backgroundSize: '200% 100%'}}>
          <div className="bg-gradient-to-br from-[#3E1E68] to-[#5D2F77] rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex mb-8 p-1 bg-black bg-opacity-30 rounded-xl backdrop-blur-sm">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "login"
                    ? "bg-gradient-to-r from-[#FFACAC] to-[#5D2F77] text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "register"
                    ? "bg-gradient-to-r from-[#FFACAC] to-[#5D2F77] text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#FFACAC] to-white bg-clip-text text-transparent">
              {activeTab === "login" ? "Welcome Back" : "Join Room"}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-200">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black bg-opacity-30 border border-[#5D2F77] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#FFACAC] focus:ring-2 focus:ring-[#FFACAC] focus:ring-opacity-50 transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-200">Room ID</label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  required
                  className="w-full bg-black bg-opacity-30 border border-[#5D2F77] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#FFACAC] focus:ring-2 focus:ring-[#FFACAC] focus:ring-opacity-50 transition-all duration-300"
                  placeholder="Enter room ID"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-200">User Type</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full bg-black bg-opacity-30 border border-[#5D2F77] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFACAC] focus:ring-2 focus:ring-[#FFACAC] focus:ring-opacity-50 transition-all duration-300 cursor-pointer"
                >
                  <option value="client" className="bg-[#3E1E68]">Client</option>
                  <option value="developer" className="bg-[#3E1E68]">Developer</option>
                </select>
              </div>

              <button
                onClick={handleRegister}
                className="w-full relative group py-4 font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFACAC] via-[#5D2F77] to-[#FFACAC] animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#5D2F77] to-[#FFACAC] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">{activeTab === "login" ? "Sign In" : "Join Room"}</span>
              </button>

              {message && (
                <div className="p-4 bg-[#FFACAC] bg-opacity-20 border border-[#FFACAC] rounded-xl backdrop-blur-sm">
                  <p className="text-center text-sm text-[#FFACAC] font-medium">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCreateRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md"
            onClick={() => setShowCreateRoom(false)}
          ></div>

          <div className="relative z-10 w-full max-w-md">
            <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-[#FFACAC] via-[#5D2F77] to-[#FFACAC] animate-shimmer" style={{backgroundSize: '200% 100%'}}>
              <div className="bg-gradient-to-br from-[#3E1E68] to-[#5D2F77] rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFACAC] to-white bg-clip-text text-transparent">
                    Create New Room
                  </h3>
                  <button
                    onClick={() => setShowCreateRoom(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-200">Room Name</label>
                    <input
                      type="text"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      required
                      className="w-full bg-black bg-opacity-30 border border-[#5D2F77] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#FFACAC] focus:ring-2 focus:ring-[#FFACAC] focus:ring-opacity-50 transition-all duration-300"
                      placeholder="Enter room name"
                    />
                  </div>

                  <button
                    onClick={handleCreateRoom}
                    className="w-full relative group py-4 font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFACAC] via-[#5D2F77] to-[#FFACAC] animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
                    <span className="relative z-10">Create Room</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}