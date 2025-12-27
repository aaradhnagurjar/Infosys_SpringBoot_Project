import { useState } from "react";
import { api } from "../services/api";

export default function AvailabilityForm({ onAdded }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/agent/availability", null, {
        params: { date, startTime, endTime },
      });
      setMessage("✅ Availability added successfully!");
      setDate("");
      setStartTime("");
      setEndTime("");
      onAdded(); // refresh parent data
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add availability");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      {message && (
        <p
          className={`mb-4 p-2 rounded ${
            message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="sm:col-span-3 flex justify-end mt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200"
          >
            Add Slot
          </button>
        </div>
      </form>
    </div>
  );
}
