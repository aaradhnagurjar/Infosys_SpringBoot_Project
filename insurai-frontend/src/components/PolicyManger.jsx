import { useEffect, useState } from "react";
import axios from "axios";

function PolicyManager() {
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    premium: "",
    coverage: ""
  });
  const [editingId, setEditingId] = useState(null);

  // 🔹 Fetch all policies
  const fetchPolicies = async () => {
    try {
        const res = await axios.get("http://localhost:8080/public/policies", {
            withCredentials: true
          });
      setPolicies(res.data);
    } catch (err) {
      console.error("Error fetching policies:", err);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Add or update policy
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/policies/${editingId}`, form, {
            withCredentials: true
          });
      } else {
        await axios.post("http://localhost:8080/policies", form, {
            withCredentials: true
          });
      }
      setForm({ name: "", description: "", premium: "", coverage: "" });
      setEditingId(null);
      fetchPolicies();
    } catch (err) {
      console.error("Error saving policy:", err);
    }
  };

  // 🔹 Delete policy
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this policy?")) return;
    try {
      await axios.delete(`http://localhost:8080/policies/${id}`, {
        withCredentials: true
      });
      fetchPolicies();
    } catch (err) {
      console.error("Error deleting policy:", err);
    }
  };

  // 🔹 Edit existing policy
  const handleEdit = (policy) => {
    setForm(policy);
    setEditingId(policy.id);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Policy Management</h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Policy Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="premium"
          placeholder="Premium Amount"
          value={form.premium}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="coverage"
          placeholder="Coverage Amount"
          value={form.coverage}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded md:col-span-2 hover:bg-blue-700 transition"
        >
          {editingId ? "Update Policy" : "Add Policy"}
        </button>
      </form>

      {/* Policy List */}
      <table className="w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Premium</th>
            <th className="p-2 border">Coverage</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.description}</td>
              <td className="p-2 border">{p.premium}</td>
              <td className="p-2 border">{p.coverage}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-400 text-black px-2 py-1 rounded mr-2 hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PolicyManager;
