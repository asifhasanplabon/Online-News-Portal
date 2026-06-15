import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, updateUserRole, toggleUserStatus, deleteUser } from "../../features/user/userSlice";
import Spinner from "../../components/common/Spinner";
import { formatShortDate } from "../../utils/formatDate";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const RoleBadge = ({ role }) => {
  const map = { admin: "bg-red-100 text-red-700", editor: "bg-blue-100 text-blue-700", user: "bg-gray-100 text-gray-600" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[role] || map.user}`}>{role}</span>;
};

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, total, loading } = useSelector((s) => s.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleRoleChange = async (id, role) => {
    const result = await dispatch(updateUserRole({ id, role }));
    if (updateUserRole.fulfilled.match(result)) toast.success("Role updated");
    else toast.error(result.payload || "Failed");
  };

  const handleToggle = async (id) => {
    const result = await dispatch(toggleUserStatus(id));
    if (toggleUserStatus.fulfilled.match(result)) toast.success("Status updated");
    else toast.error(result.payload || "Failed");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    const result = await dispatch(deleteUser(id));
    if (deleteUser.fulfilled.match(result)) toast.success("User deleted");
    else toast.error(result.payload || "Failed");
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Users ({total})</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Role</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Joined</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-red-400"
                    >
                      <option value="user">user</option>
                      <option value="editor">editor</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(u._id)}
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatShortDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
