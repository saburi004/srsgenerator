"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
  const [roomId, setRoomId] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [error, setError] = useState("");

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
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: managerEmail, role: "manager", roomId: newRoomId })
      });
      const loginData = await loginRes.json();
      if (loginData.success) {
        localStorage.setItem("token", loginData.token);
        router.push("/dashboard/manager");
      } else {
        setError(loginData.error || "Login after room creation failed");
      }
    } catch (e) {
      setError("Create room error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Welcome to SRS CP</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

      <div className="border rounded p-4 space-y-3">
        <h2 className="text-xl font-semibold">Login</h2>
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <div className="flex gap-3 items-center">
          <label className="text-sm">Role:</label>
          <select className="border p-2" value={role} onChange={(e)=>setRole(e.target.value)}>
            <option value="client">Client</option>
            <option value="developer">Developer</option>
            <option value="manager">Manager</option>
          </select>
          <input className="border p-2 flex-1" placeholder="Room ID (optional)" value={roomId} onChange={(e)=>setRoomId(e.target.value.toUpperCase())} />
        </div>
        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </div>

      <div className="border rounded p-4 space-y-3">
        <h2 className="text-xl font-semibold">Register</h2>
        <p className="text-gray-600 text-sm">Go to registration</p>
        <button onClick={()=>router.push("/joinRoom") } className="border px-4 py-2 rounded">Register</button>
      </div>

      <div className="border rounded p-4 space-y-3">
        <h2 className="text-xl font-semibold">Create a New Room</h2>
        <input className="border p-2 w-full" placeholder="Manager Email" value={managerEmail} onChange={(e)=>setManagerEmail(e.target.value)} />
        <button onClick={handleCreateRoom} className="bg-green-600 text-white px-4 py-2 rounded">Create Room</button>
      </div>
    </div>
  );
}
