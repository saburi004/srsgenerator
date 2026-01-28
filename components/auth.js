
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function auth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
  const [roomId, setRoomId] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, roomId: roomId || undefined })
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || "Login failed"); return; }
      localStorage.setItem("token", data.token);
      if (roomId) {
        localStorage.setItem('currentRoomId', roomId.toUpperCase());
      }
      if (role === "manager") router.push("/dashboard/manager");
      else if (role === "developer") router.push("/dashboard/developer");
      else router.push("/dashboard/client");
    } catch (e) {
      setError("Login error");
    }
  };

  const handleCreateRoom = async () => {
    try {
      setError("");
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerEmail })
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || "Failed to create room"); return; }
      const newRoomId = data.room.roomId;
      // Persist the newly created room as the active one for this user
      localStorage.setItem('currentRoomId', newRoomId.toUpperCase());
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: managerEmail, role: "manager", roomId: newRoomId })
      });
      const loginData = await loginRes.json();
      if (loginData.success) {
        localStorage.setItem("token", loginData.token);
        localStorage.setItem('currentRoomId', newRoomId.toUpperCase());
        router.push("/dashboard/manager");
      } else {
        setError(loginData.error || "Login after room creation failed");
      }
    } catch (e) {
      setError("Create room error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-[#3E1E68] to-purple-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements with moving gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-purple-700/20 animate-pulse"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-pink-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Create Room Button - Fixed Top Right */}
      <div className="fixed top-6 right-6 z-40">
        <button
          onClick={() => setShowCreateRoom(true)}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
          <div className="relative bg-gray-900 px-6 py-2.5 rounded-lg leading-none flex items-center">
            <span className="text-white font-semibold">Create Room</span>
          </div>
        </button>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateRoom(false)}
          ></div>
          <div className="relative bg-gradient-to-br from-[#3E1E68] to-[#3E1E68] rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in border border-pink-100">
            <button
              onClick={() => setShowCreateRoom(false)}
              className="absolute top-4 right-4 text-pink-400 hover:text-[#3E1E68] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Room</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/80 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  placeholder="manager@example.com"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                />
              </div>
              
              <button
                onClick={handleCreateRoom}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative max-w-md w-full">
        {/* Login/Register Card */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-pink-100">
          {/* Toggle Header */}
          <div className="p-2 bg-gray-100">
            <div className="relative flex bg-white rounded-xl p-1 shadow-inner">
              <div
                className={`absolute top-1 bottom-1 left-1 right-1/2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg transition-all duration-300 ease-out ${
                  !isLogin ? "translate-x-full" : "translate-x-0"
                }`}
              ></div>
              <button
                onClick={() => setIsLogin(true)}
                className={`relative flex-1 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                  isLogin ? "text-white" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`relative flex-1 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                  !isLogin ? "text-white" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome to SRS CP
              </h1>
              <p className="text-gray-500 mt-2">
                {isLogin ? "Sign in to continue" : "Create your account"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {isLogin ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="client">Client</option>
                    <option value="developer">Developer</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room ID <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all uppercase"
                    placeholder="ROOM123"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  />
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full relative group mt-6"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg">
                    Sign In
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <p className="text-gray-600 mb-6">
                    Ready to get started? Click below to register.
                  </p>
                  <button
                    onClick={() => router.push("/joinRoom")}
                    className="relative group inline-block"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative bg-white border-2 border-purple-600 text-purple-600 font-semibold py-3 px-8 rounded-lg hover:bg-purple-50 transition-colors">
                      Go to Registration
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}