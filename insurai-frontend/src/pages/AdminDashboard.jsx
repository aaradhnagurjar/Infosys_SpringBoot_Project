import { useState } from "react";
import UserList from "../components/UserList";
import PolicyManager from "../components/PolicyManger";
import BookingList from "../components/BookingList";
import UserPolicyManager from "../components/UserPolicyManager";
import Notifications from "../components/Notifications"; // <-- new import

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  const renderSection = () => {
    switch (activeTab) {
      case "users":
        return <UserList />;
      case "policies":
        return <PolicyManager />;
      case "bookings":
        return <BookingList />;
      case "userPolicies":
        return <UserPolicyManager />;
      case "notifications": // <-- new case
        return <Notifications />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "users"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            👤 Users
          </button>

          <button
            onClick={() => setActiveTab("policies")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "policies"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            📄 Policies
          </button>

          <button
            onClick={() => setActiveTab("userPolicies")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "userPolicies"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            🧾 User Policies
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "bookings"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            📅 Bookings
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "notifications"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            🔔 Notifications
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{renderSection()}</div>
    </div>
  );
};

export default AdminDashboard;
