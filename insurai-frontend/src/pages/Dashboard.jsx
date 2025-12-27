import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import AiVoiceAssistant from "../components/AiVoiceAssistant";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalPolicies: 0,
    activeBookings: 0,
    totalCoverage: 0,
  });

  const [policies, setPolicies] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);

  // Fetch policies
  const fetchPolicies = async () => {
    try {
      const res = await axios.get("http://localhost:8080/public/policies", {
        withCredentials: true,
      });
      setPolicies(res.data);
      setStats((prev) => ({ ...prev, totalPolicies: res.data.length }));
    } catch (err) {
      console.error("Error fetching policies:", err);
    }
  };

  // Fetch today's available agents
  const fetchAgents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/public/agent", {
        withCredentials: true,
      });
      setAgents(res.data);
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  // Fetch selected agent's availability slots
  const fetchAvailability = async (agentId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/public/agent/${agentId}/availability`,
        { withCredentials: true }
      );
      setAvailableSlots(res.data);
    } catch (err) {
      console.error("Error fetching availability:", err);
    }
  };

  // Fetch user bookings/stats
  const fetchUserStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/public/${user.email}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setActiveBookings(res.data);
      setStats((prev) => ({
        ...prev,
        activeBookings: res.data.length,
      }));
    } catch (err) {
      console.error("Error fetching user bookings:", err);
    }
  };

  useEffect(() => {
    fetchPolicies();
    fetchAgents();
    if (user) fetchUserStats();
  }, [user]);

  // Book appointment (using slot data)
  const bookAppointment = async () => {
    if (!selectedPolicy || !selectedAgent || !selectedSlot) {
      alert("Please select a policy, agent, and slot!");
      return;
    }

    const { date, startTime } = selectedSlot;
    try {
      await axios.post(
        `http://localhost:8080/booking/book?policyName=${selectedPolicy.name}&userEmail=${user.email}&agentId=${selectedAgent.id}&date=${date}&time=${startTime}`,
        {},
        { withCredentials: true }
      );

      alert("Booking successful!");
      fetchUserStats();
      setSelectedSlot(null);
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Booking failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || "User"}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your insurance today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-gray-600 text-sm font-medium">
              Available Policies
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalPolicies}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-gray-600 text-sm font-medium">Active Bookings</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.activeBookings}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-gray-600 text-sm font-medium">Total Coverage</p>
            <p className="text-3xl font-bold text-gray-900">
              ${stats.totalCoverage?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Policies + Booking */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Policies Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Discover Policies</h2>
            <div className="space-y-4">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className={`p-4 border rounded-xl cursor-pointer ${
                    selectedPolicy?.id === policy.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedPolicy(policy)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{policy.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {policy.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 font-medium">
                        ${policy.premium}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Coverage: ${policy.coverage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Select Agent */}
            {selectedPolicy && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Select an Agent</h3>
                <select
                  className="border p-2 rounded"
                  value={selectedAgent?.id || ""}
                  onChange={(e) => {
                    const agent = agents.find(
                      (a) => a.id === parseInt(e.target.value)
                    );
                    setSelectedAgent(agent);
                    setSelectedSlot(null);
                    if (agent) fetchAvailability(agent.id);
                  }}
                >
                  <option value="">-- Select Agent --</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.email})
                    </option>
                  ))}
                </select>

                {/* Available Slots */}
                {selectedAgent && availableSlots.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Available Slots</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2 border rounded-lg text-sm transition ${
                            selectedSlot?.id === slot.id
                              ? "bg-blue-500 text-white border-blue-500"
                              : "hover:bg-blue-50"
                          }`}
                        >
                          {slot.date} <br />
                          {slot.startTime} - {slot.endTime}
                        </button>
                      ))}
                    </div>
                    {selectedSlot && (
                      <button
                        onClick={bookAppointment}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Book Appointment
                      </button>
                    )}
                  </div>
                )}

                {selectedAgent && availableSlots.length === 0 && (
                  <p className="mt-4 text-gray-500 text-sm">
                    No available slots for this agent today.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Booking Records</h3>
              {activeBookings.length === 0 ? (
                <p className="text-gray-600 text-sm">No active bookings</p>
              ) : (
                <div className="space-y-3">
                  {activeBookings
                    .filter((booking) => booking.status !== "COMPLETED") // ✅ only show not completed
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.policy?.type || "Booking"} with{" "}
                            {booking.agent?.name
                              ? `Agent ${booking.agent.name}`
                              : "Agent"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {booking.date} • {booking.time}
                          </p>
                        </div>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Upcoming
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Floating AI Voice Assistant Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <AiVoiceAssistant />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
