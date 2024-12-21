import React, { useState } from "react";
import { UserPlus, MoreVertical } from "lucide-react";

const BeneficiaryCard = ({ name, metamaskAddress, relationship, allocation, status, onEdit, onRemove }) => {
  const statusStyles = {
    Verified: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src="https://avatar.iran.liara.run/public"
            alt={name}
            className="h-12 w-12 rounded-full mr-4"
          />
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-gray-500">{metamaskAddress}</p>
          </div>
        </div>
        <MoreVertical className="cursor-pointer text-gray-500" />
      </div>

      {/* Details */}
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium text-gray-700">Relationship:</span>{" "}
          {relationship}
        </p>
        <p className="text-sm">
          <span className="font-medium text-gray-700">Allocation:</span> {allocation}%
        </p>
        <p className="text-sm flex items-center">
          <span className="font-medium text-gray-700">Status:</span>{" "}
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full ${statusStyles[status]}`}
          >
            {status}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="text-blue-600 text-sm border border-blue-600 rounded px-3 py-1"
          onClick={() => onEdit({ name, metamaskAddress, relationship, allocation, status })}
        >
          Edit Details
        </button>
        <button
          className="text-red-600 text-sm border border-red-600 rounded px-3 py-1"
          onClick={() => onRemove(name)} // Call onRemove function passed from the parent
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([
    {
      name: "Sarah Johnson",
      metamaskAddress: "0x12345",
      relationship: "Daughter",
      allocation: 40,
      status: "Verified",
    },
    {
      name: "Michael Smith",
      metamaskAddress: "0x67890",
      relationship: "Son",
      allocation: 35,
      status: "Pending",
    },
  ]);

  const [isFormOpen, setFormOpen] = useState(false);
  const [currentBeneficiary, setCurrentBeneficiary] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    metamaskAddress: "",
    relationship: "",
    allocation: "",
  });

  const handleEdit = (beneficiary) => {
    setFormData(beneficiary);
    setCurrentBeneficiary(beneficiary);
    setFormOpen(true);
  };

  const handleSave = () => {
    // If editing an existing beneficiary
    if (currentBeneficiary) {
      setBeneficiaries((prev) =>
        prev.map((b) =>
          b.name === currentBeneficiary.name ? { ...formData } : b
        )
      );
    } else {
      setBeneficiaries((prev) => [...prev, formData]);
    }
    setFormOpen(false);
    setFormData({
      name: "",
      metamaskAddress: "",
      relationship: "",
      allocation: "",
    });
    setCurrentBeneficiary(null);
  };

  // Function to remove a beneficiary
  const handleRemove = (name) => {
    setBeneficiaries((prev) => prev.filter((beneficiary) => beneficiary.name !== name));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Beneficiary Management</h1>
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={() => setFormOpen(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Beneficiary
        </button>
      </div>

      {/* Beneficiaries List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {beneficiaries.map((b, i) => (
          <BeneficiaryCard
            key={i}
            {...b}
            onEdit={handleEdit}
            onRemove={handleRemove} // Pass handleRemove to each card
          />
        ))}

        {/* Add New Beneficiary Card */}
        <button
          className="p-4 border-dashed border-2 rounded-lg text-center flex flex-col items-center justify-center text-gray-500 hover:bg-blue-100 transition-all"
          onClick={() => setFormOpen(true)}
        >
          <div className="bg-gray-200 p-3 rounded-full">
            <UserPlus className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="font-medium mt-2">Add New Beneficiary</h3>
          <p className="text-sm">Click to add a new beneficiary</p>
        </button>
      </div>

      {/* Form Modal for Adding/Editing Beneficiary */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{currentBeneficiary ? "Edit Beneficiary" : "Add Beneficiary"}</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Metamask Address</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={formData.metamaskAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, metamaskAddress: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Relationship</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={formData.relationship}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Allocation (%)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={formData.allocation}
                  onChange={(e) =>
                    setFormData({ ...formData, allocation: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="ml-2 text-gray-600 border border-gray-300 px-4 py-2 rounded"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocation Summary */}
      <div className="p-4 border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold">Allocation Summary</h2>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Allocated</span>
            <span className="text-sm text-gray-600">75%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div className="bg-blue-600 h-2 rounded" style={{ width: "75%" }}></div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Remaining</span>
            <span className="text-sm text-gray-600">25%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div className="bg-gray-400 h-2 rounded" style={{ width: "25%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beneficiaries;

