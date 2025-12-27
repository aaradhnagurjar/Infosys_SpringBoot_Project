import { useEffect, useState } from "react";
import axios from "axios";

const UserPolicyManager = () => {
  const [userPolicies, setUserPolicies] = useState([]);

  const fetchUserPolicies = async () => {
    try {
      const res = await axios.get("http://localhost:8080/users/userpolicies", {
        withCredentials: true,
      });
      console.log(res.data)
      setUserPolicies(res.data);
    } catch (err) {
      console.error("Error fetching user policies:", err);
    }
  };

  useEffect(() => {
    fetchUserPolicies();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Policies</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">User ID</th>
              <th className="py-3 px-4 text-left">User Name</th>
              <th className="py-3 px-4 text-left">Policy ID</th>
              <th className="py-3 px-4 text-left">Policy Name</th>
              <th className="py-3 px-4 text-left">Start Date</th>
              <th className="py-3 px-4 text-left">End Date</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {userPolicies.length > 0 ? (
              userPolicies.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">{p.user.id}</td>
                  <td className="py-3 px-4">{p.user.name || "—"}</td>
                  <td className="py-3 px-4">{p.id}</td>
                  <td className="py-3 px-4">{p.policyName || "—"}</td>
                  <td className="py-3 px-4">{p.
policyStartDate}</td>
                  <td className="py-3 px-4">{p.policyEndDate
                  }</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : p.status === "EXPIRED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No user policies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPolicyManager;
