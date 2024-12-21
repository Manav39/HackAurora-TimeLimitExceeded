import React, { useState } from "react";
import { PlusCircle, Edit, Trash, BarChart, Coins, House, DollarSign } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

function Assets() {
  const assetSummary = [
    { title: "Total Asset Value", value: "$2,450,000", icon: <BarChart className="h-6 w-6" />, color: "bg-green-100 text-green-600" },
    { title: "Gold", value: "$850,000", icon: <Coins className="h-6 w-6" />, color: "bg-yellow-100 text-yellow-600" },
    { title: "Crypto", value: "$400,000", icon: <DollarSign className="h-6 w-6" />, color: "bg-purple-100 text-purple-600" },
    { title: "Property", value: "$1,200,000", icon: <House className="h-6 w-6" />, color: "bg-blue-100 text-blue-600" },
  ];

  const [assets, setAssets] = useState([
    { assetType: "Gold", name: "Gold Bar", value: "$500,000", status: "Verified", statusColor: "text-green-600 bg-green-100", lastUpdated: "Jan 15, 2024" },
    { assetType: "Crypto", name: "Bitcoin Wallet", value: "$300,000", status: "Pending", statusColor: "text-yellow-600 bg-yellow-100", lastUpdated: "Jan 14, 2024" },
    { assetType: "Property", name: "Residential Property", value: "$1,200,000", status: "Verified", statusColor: "text-green-600 bg-green-100", lastUpdated: "Jan 10, 2024" },
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newAsset, setNewAsset] = useState({
    assetType: "",
    name: "",
    value: "",
    status: "Pending",
    statusColor: "text-yellow-600 bg-yellow-100",
    lastUpdated: new Date().toLocaleDateString(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAsset = () => {
    if (isEditMode) {
      const updatedAssets = [...assets];
      updatedAssets[editIndex] = newAsset;
      setAssets(updatedAssets);
      setEditMode(false);
      setEditIndex(null);
    } else {
      setAssets((prev) => [...prev, newAsset]);
    }

    setNewAsset({
      assetType: "",
      name: "",
      value: "",
      status: "Pending",
      statusColor: "text-yellow-600 bg-yellow-100",
      lastUpdated: new Date().toLocaleDateString(),
    });
    setModalOpen(false);
  };

  const handleEdit = (index) => {
    setNewAsset(assets[index]);
    setEditMode(true);
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleRemove = (index) => {
    const updatedAssets = assets.filter((_, i) => i !== index);
    setAssets(updatedAssets);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Asset Tracker</h1>
        <button
          onClick={() => {
            setModalOpen(true);
            setEditMode(false);
            setNewAsset({
              assetType: "",
              name: "",
              value: "",
              status: "Pending",
              statusColor: "text-yellow-600 bg-yellow-100",
              lastUpdated: new Date().toLocaleDateString(),
            });
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Asset
        </button>
      </div>

      {/* Asset Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {assetSummary.map((item, index) => (
          <Card key={index} className="flex items-center p-4">
            <div className={`h-12 w-12 flex items-center justify-center rounded-full ${item.color}`}>
              {item.icon}
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Asset Details */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Asset Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">Asset Type</th>
                  <th className="p-4 text-left">Asset Name</th>
                  <th className="p-4 text-left">Value</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Last Updated</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4">{asset.assetType}</td>
                    <td className="p-4">{asset.name}</td>
                    <td className="p-4">{asset.value}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-sm rounded-lg ${asset.statusColor}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="p-4">{asset.lastUpdated}</td>
                    <td className="p-4 space-x-3">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-500 hover:underline"
                      >
                        <Edit className="inline-block h-5 w-5 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemove(index)}
                        className="text-red-500 hover:underline"
                      >
                        <Trash className="inline-block h-5 w-5 mr-1" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg space-y-4 w-96">
            <h2 className="text-lg font-bold">{isEditMode ? "Edit Asset" : "Add New Asset"}</h2>
            <select
              name="assetType"
              value={newAsset.assetType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Asset Type</option>
              <option value="Gold">Gold</option>
              <option value="Crypto">Crypto</option>
              <option value="Property">Property</option>
            </select>
            <input
              type="text"
              name="name"
              placeholder="Asset Name"
              value={newAsset.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="value"
              placeholder="Value"
              value={newAsset.value}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAsset}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {isEditMode ? "Save Changes" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assets;
