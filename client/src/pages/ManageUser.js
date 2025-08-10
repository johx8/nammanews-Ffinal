import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      const data = Array.isArray(res.data) ? res.data : res.data.users || [];
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Failed to update user role');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-7 text-orange-700 tracking-tight text-center sm:text-left">Manage Users</h1>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-orange-50">
              <th className="p-4 font-semibold text-left text-gray-700">Name</th>
              <th className="p-4 font-semibold text-left text-gray-700">Email</th>
              <th className="p-4 font-semibold text-left text-gray-700">Role</th>
              <th className="p-4 font-semibold text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-4 text-gray-900 font-medium">{user.name}</td>
                <td className="p-4 text-gray-700">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition outline-none text-gray-800 bg-white font-semibold"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400 font-medium">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManageUsers;
