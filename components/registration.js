"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("client");
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");

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
  localStorage.setItem("token", data.token);

  // Decode token to get role
  const payload = JSON.parse(atob(data.token.split(".")[1]));
  const role = payload.role;

  // Redirect based on role
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Join Room</h2>

        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2">Room ID</label>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2">User Type</label>
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="client">Client</option>
          <option value="developer">Developer</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Join Room
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
