import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    occupation: "",
  });
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showModal, setShowModal] = useState(false);
const [policyForm, setPolicyForm] = useState({
  address: "",
  annualIncome: "",
  nationalId: "",
  nomineeName: "",
});

  // ------------------- Fetch profile -------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/auth/profile", {
          withCredentials: true,
        });
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          dateOfBirth: res.data.dateOfBirth || "",
          occupation: res.data.occupation || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    const fetchPolicies = async () => {
      try {
        const res = await axios.get("http://localhost:8080/auth/policies", {
          withCredentials: true,
        });
        console.log("Fetch policy",res);
        setPolicies(res.data);
      } catch (err) {
        console.error("Failed to fetch user policies:", err);
      }
    };

    fetchProfile();
    fetchPolicies();
  }, []);

  // ------------------- Handle form -------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:8080/auth/profile", formData, {
        withCredentials: true,
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const profileStats = [
    { label: "Active Policies", value: policies.length, icon: "📄" },
    { label: "Years with us", value: "2", icon: "🗓️" },
    { label: "Savings", value: "$2,400", icon: "💰" },
  ];

  const activityLog = [
    { action: "Policy Renewal", date: "2024-10-01", status: "Completed" },
    { action: "Claim Filed", date: "2024-09-15", status: "Processing" },
    { action: "Payment Made", date: "2024-09-01", status: "Completed" },
    { action: "Profile Updated", date: "2024-08-20", status: "Completed" },
  ];

  const openUpdateModal = (policy) => {
    setSelectedPolicy(policy);
    setPolicyForm({
      address: policy.address || "",
      annualIncome: policy.annualIncome || "",
      nationalId: policy.nationalId || "",
      nomineeName: policy.nomineeName || "",
    });
    setShowModal(true);
  };
  
  const closeModal = () => {
    setSelectedPolicy(null);
    setShowModal(false);
  };
  
  const handlePolicyChange = (e) => {
    setPolicyForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handlePolicyUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/auth/${selectedPolicy.id}`,
        policyForm,
        { withCredentials: true }
      );
      alert("Policy details updated successfully!");
      closeModal();
  
      // refresh updated list
      const res = await axios.get("http://localhost:8080/auth/policies", {
        withCredentials: true,
      });
      setPolicies(res.data);
    } catch (err) {
      console.error("Failed to update policy:", err);
      alert("Failed to update policy.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information and your policy details
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white flex items-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                  👤
                </div>
                <div className="ml-6 flex-1">
                  <h2 className="text-3xl font-bold">
                    {formData.name || "User"}
                  </h2>
                  <p className="text-blue-100">{user?.email}</p>
                  <p className="text-blue-200 text-sm">
                    Member since October 2022
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* Profile Form */}
              <div className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                          !isEditing ? "bg-gray-50" : "bg-white"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                          !isEditing ? "bg-gray-50" : "bg-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                          !isEditing ? "bg-gray-50" : "bg-white"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        !isEditing ? "bg-gray-50" : "bg-white"
                      }`}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* ---------- MY POLICIES SECTION ---------- */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                My Policies
              </h2>
              {policies.length === 0 ? (
                <p className="text-gray-600">No policies found yet.</p>
              ) : (
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div
                      key={policy.id}
                      className="border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition-shadow duration-200"
                    >
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {policy.policyName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Provided By: {policy.agent.name || "Not Assigned"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Policy Ending On: {policy.policyEndDate || "Not Provided"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            policy.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {policy.status || "PENDING"}
                        </span>
                        <button
              onClick={() => openUpdateModal(policy)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Update Details
            </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Profile Stats
              </h3>
              <div className="space-y-4">
                {profileStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className="text-gray-700">{stat.label}</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center space-x-3">
                  <span className="text-2xl">🔒</span>
                  <span>Change Password</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center space-x-3">
                  <span className="text-2xl">📄</span>
                  <span>Download Policies</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center space-x-3">
                  <span className="text-2xl">⚙️</span>
                  <span>Notification Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left p-3 hover:bg-red-50 text-red-600 rounded-lg flex items-center space-x-3"
                >
                  <span className="text-2xl">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {activityLog.map((activity, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-3 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          activity.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {activity.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg relative">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Update Policy Details
        </h2>
  
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={policyForm.address}
              onChange={handlePolicyChange}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>
  
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Annual Income
            </label>
            <input
              type="number"
              name="annualIncome"
              value={policyForm.annualIncome}
              onChange={handlePolicyChange}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>
  
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              National ID
            </label>
            <input
              type="text"
              name="nationalId"
              value={policyForm.nationalId}
              onChange={handlePolicyChange}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>
  
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Nominee Name
            </label>
            <input
              type="text"
              name="nomineeName"
              value={policyForm.nomineeName}
              onChange={handlePolicyChange}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>
        </div>
  
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handlePolicyUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )}
    </div>
);
};

export default Profile;
