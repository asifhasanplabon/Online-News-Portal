import { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import { Newspaper, Users, Clock, CheckCircle } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ published: null, pending: null, users: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/news", { params: { limit: 1 } }),
      API.get("/news/pending"),
      API.get("/users", { params: { limit: 1 } }),
    ])
      .then(([publishedRes, pendingRes, usersRes]) => {
        setStats({
          published: publishedRes.data.total,
          pending: pendingRes.data.count,
          users: usersRes.data.total,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard icon={CheckCircle} label="Published Articles" value={stats.published} color="bg-green-500" />
        <StatCard icon={Clock} label="Pending Approval" value={stats.pending} color="bg-yellow-500" />
        <StatCard icon={Users} label="Total Users" value={stats.users} color="bg-blue-500" />
      </div>
    </div>
  );
};

export default AdminDashboard;
