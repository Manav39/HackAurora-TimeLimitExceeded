import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { ScrollText, Users, Shield, DollarSign, Plus, Upload, UserPlus } from 'lucide-react';
import StatCard from '../components/StatCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

function Dashboard() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const recentActivity = [
    {
      title: "New Will Created",
      description: "A new will was created and stored on blockchain",
      time: "2 hours ago",
      type: "default"
    },
    {
      title: "Smart Contract Executed",
      description: "Assets distributed according to will terms",
      time: "1 day ago",
      type: "success"
    },
    {
      title: "Document Verification Required",
      description: "Additional verification needed for recent changes",
      time: "2 days ago",
      type: "warning"
    }
  ];

  // Handler functions for navigation
  const handleCreateNewWill = () => {
    navigate('/wills'); // Redirect to /wills
  };

  const handleAddBeneficiary = () => {
    navigate('/beneficiaries'); // Redirect to /beneficiaries
  };

  const handleUploadDocuments = () => {
    navigate('/documents'); // Redirect to /documents
  };

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Wills"
          value="2"
          icon={ScrollText}
          variant="default"
        />
        <StatCard
          title="Beneficiaries"
          value="2"
          icon={Users}
          variant="success"
        />
        <StatCard
          title="Smart Contracts"
          value="5"
          icon={Shield}
          variant="warning"
        />
        <StatCard
          title="Total Assets"
          value="$2M"
          icon={DollarSign}
          variant="default"
        />
      </div>

      {/* Recent Activity Section */}
      <Card className="shadow-lg rounded-xl border border-gray-100">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition ease-in-out duration-150">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`rounded-full p-3 ${
                      activity.type === "success"
                        ? "bg-green-200"
                        : activity.type === "warning"
                        ? "bg-yellow-200"
                        : "bg-blue-200"
                    }`}
                  >
                    {activity.type === "success" ? (
                      <Shield className="h-5 w-5 text-green-600" />
                    ) : activity.type === "warning" ? (
                      <Upload className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  {/* Activity Description */}
                  <div>
                    <p className="font-medium text-gray-800">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                </div>
                {/* Time and Badge */}
                <Badge variant="secondary" className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  {activity.time}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Actions Section */}
      <Card className="shadow-lg rounded-xl border border-gray-100 mt-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handleCreateNewWill} // On click, navigate to /wills
              className="flex-1 bg-blue-500 border border-blue-500 text-white hover:bg-blue-600 transition ease-in-out duration-150 flex items-center gap-2 rounded-lg"
            >
              <Plus className="h-5 w-5" />
              Create New Will
            </Button>
            <Button
              onClick={handleAddBeneficiary} // On click, navigate to /beneficiaries
              className="flex-1 bg-green-500 border border-green-500 text-white hover:bg-green-600 transition ease-in-out duration-150 flex items-center gap-2 rounded-lg"
            >
              <UserPlus className="h-5 w-5" />
              Add Beneficiary
            </Button>
            <Button
              onClick={handleUploadDocuments} // On click, navigate to /documents
              className="flex-1 bg-yellow-500 border border-yellow-500 text-white hover:bg-yellow-600 transition ease-in-out duration-150 flex items-center gap-2 rounded-lg"
            >
              <Upload className="h-5 w-5" />
              Upload Documents
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
