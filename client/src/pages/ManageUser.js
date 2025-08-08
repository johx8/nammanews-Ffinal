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
      fetchUsers(); // refresh user list
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Failed to update user role');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="ml-64 p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white shadow rounded">
          <thead>
            <tr className="bg-orange-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    {/* <option value="editor">Editor</option> */}
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
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
