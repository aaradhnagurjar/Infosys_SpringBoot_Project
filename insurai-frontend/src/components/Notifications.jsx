import React, { useState, useEffect } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/users/notifications", {
        withCredentials: true, // ✅ allows cookies/session to be sent
      })
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center mt-6 text-gray-500">Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">User Email</th>
            <th className="border px-4 py-2">Agent Email</th>
            <th className="border px-4 py-2">Reason</th>
            <th className="border px-4 py-2">Message</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Time</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {notifications.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No notifications found.
              </td>
            </tr>
          ) : (
            notifications.map((n) => (
              <tr key={n.id}>
                <td className="border px-4 py-2">{n.userEmail}</td>
                <td className="border px-4 py-2">{n.agentEmail}</td>
                <td className="border px-4 py-2">{n.reason}</td>
                <td className="border px-4 py-2">{n.message}</td>
                <td className="border px-4 py-2">{n.date}</td>
                <td className="border px-4 py-2">{n.time}</td>
                <td className="border px-4 py-2">{n.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
 
export default Notifications;
