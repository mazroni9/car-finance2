'use client';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/admin/users').then(res => res.json()).then(setUsers);
  }, []);

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">🧑‍🤝‍🧑 Users</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-800">
              <td className="px-4 py-2 border">{user.id}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.role}</td>
              <td className="px-4 py-2 border">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
