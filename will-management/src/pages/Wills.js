import React, { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";

const initialWills = [
  {
    id: "#W-2024-001",
    created: "Jan 15, 2024",
    status: "Active",
    beneficiaries: 3,
    lastModified: "2 hours ago",
    asset: "House",
    releaseDate: "2024-12-31T12:00",
  },
  {
    id: "#W-2024-002",
    created: "Jan 14, 2024",
    status: "Pending",
    beneficiaries: 2,
    lastModified: "1 day ago",
    asset: "Car",
    releaseDate: "2024-12-25T10:00",
  },
];

const assets = ["House", "Car", "Gold", "Stocks"];
const beneficiariesList = ["Alice", "Bob", "Charlie"];

function Wills() {
  const [wills, setWills] = useState(initialWills);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWill, setSelectedWill] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([
    { name: "", percentage: "" },
  ]);
  const [asset, setAsset] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const addBeneficiary = () => {
    setBeneficiaries([...beneficiaries, { name: "", percentage: "" }]);
  };

  const removeBeneficiary = (index) => {
    setBeneficiaries(beneficiaries.filter((_, i) => i !== index));
  };

  const calculateTotalPercentage = () =>
    beneficiaries.reduce(
      (sum, beneficiary) => sum + parseFloat(beneficiary.percentage || 0),
      0
    );

  const validateForm = () => {
    if (!asset) {
      alert("Asset selection is required.");
      return false;
    }
    if (beneficiaries.some((b) => !b.name || !b.percentage)) {
      alert("All beneficiaries must have a name and a percentage allocation.");
      return false;
    }
    if (calculateTotalPercentage() !== 100) {
      alert("The total allocation percentage must equal 100%.");
      return false;
    }
    if (!releaseDate) {
      alert("Release date and time are required.");
      return false;
    }
    return true;
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updatedWills = wills.map((will) =>
      will.id === selectedWill.id
        ? {
            ...will,
            beneficiaries: beneficiaries.length,
            status: "Active",
            lastModified: new Date().toLocaleString(),
            asset,
            releaseDate,
          }
        : will
    );

    setWills(updatedWills);
    resetForm();
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isEditMode) {
      handleUpdate(e);
    } else {
      const newWill = {
        id: `#W-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        created: new Date().toLocaleDateString(),
        status: "Active",
        beneficiaries: beneficiaries.length,
        lastModified: "Just now",
        asset,
        releaseDate,
      };

      setWills([...wills, newWill]);
      resetForm();
      setIsModalOpen(false);
    }
  };

  const handleDelete = () => {
    const updatedWills = wills.filter((will) => will.id !== selectedWill.id);
    setWills(updatedWills);
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setBeneficiaries([{ name: "", percentage: "" }]);
    setAsset("");
    setReleaseDate("");
    setIsEditMode(false);
    setSelectedWill(null);
  };

  const openModal = (will = null) => {
    setIsModalOpen(true);
    if (will) {
      setIsEditMode(true);
      setSelectedWill(will);
      setBeneficiaries(
        beneficiariesList.map((name, i) => ({
          name: will.beneficiaries > i ? name : "",
          percentage:
            will.beneficiaries > i ? (100 / will.beneficiaries).toString() : "",
        }))
      );
      setAsset(will.asset || "");
      setReleaseDate(will.releaseDate || "");
    } else {
      resetForm();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Will Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Will
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search wills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[180px]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </Select>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-[180px]"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest</option>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <thead className="bg-gray-100 text-gray-700 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">WILL ID</th>
              <th className="px-4 py-3 text-left font-semibold">
                CREATED DATE
              </th>
              <th className="px-4 py-3 text-left font-semibold">STATUS</th>
              <th className="px-4 py-3 text-left font-semibold">
                BENEFICIARIES
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                LAST MODIFIED
              </th>
              <th className="px-4 py-3 text-left font-semibold">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {wills.map((will) => (
              <tr key={will.id} className="even:bg-gray-50">
                <td className="px-4 py-2 font-medium">{will.id}</td>
                <td className="px-4 py-2">{will.created}</td>
                <td className="px-4 py-2">
                  <Badge
                    variant={will.status === "Active" ? "success" : "warning"}
                  >
                    {will.status}
                  </Badge>
                </td>
                <td className="px-4 py-2">{will.beneficiaries}</td>
                <td className="px-4 py-2">{will.lastModified}</td>
                <td className="px-4 py-2">
                  <Button
                    variant="link"
                    onClick={() => openModal(will)}
                    className="mr-2"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit Will" : "Create New Will"}
        className="max-w-4xl h-[90vh] overflow-auto"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Asset</label>
            <Select
              className="w-full"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
            >
              <option value="">Select Asset</option>
              {assets.map((asset, index) => (
                <option key={index} value={asset}>
                  {asset}
                </option>
              ))}
            </Select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Beneficiaries
            </label>
            {beneficiaries.map((beneficiary, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Select
                  value={beneficiary.name || ""}
                  onChange={(e) => {
                    const newBeneficiaries = [...beneficiaries];
                    newBeneficiaries[index].name = e.target.value;
                    setBeneficiaries(newBeneficiaries);
                  }}
                  className="flex-1 appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Beneficiary
                  </option>
                  {beneficiariesList
                    .filter(
                      (beneficiaryName) =>
                        !beneficiaries.some(
                          (b) => b.name === beneficiaryName
                        ) || beneficiary.name === beneficiaryName
                    )
                    .map((beneficiaryName, i) => (
                      <option key={i} value={beneficiaryName}>
                        {beneficiaryName}
                      </option>
                    ))}
                </Select>

                <Input
                  type="number"
                  placeholder="%"
                  value={beneficiary.percentage}
                  onChange={(e) => {
                    const newPercentage = parseFloat(e.target.value || 0);
                    if (
                      calculateTotalPercentage() -
                        (beneficiary.percentage || 0) +
                        newPercentage <=
                      100
                    ) {
                      const newBeneficiaries = [...beneficiaries];
                      newBeneficiaries[index].percentage = newPercentage;
                      setBeneficiaries(newBeneficiaries);
                    } else {
                      alert(
                        "The total allocation percentage cannot exceed 100%."
                      );
                    }
                  }}
                  className="w-20"
                />
                <button
                  type="button"
                  onClick={() => removeBeneficiary(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBeneficiary}
              className="text-blue-500 hover:underline"
            >
              Add Beneficiary
            </button>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Release Date & Time
            </label>
            <Input
              type="datetime-local"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full"
            />
          </div>

          {isEditMode ? (
            <div className="flex space-x-2">
              <Button
                variant="link"
                onClick={handleDelete}
                className="text-red-600"
              >
                Delete Will
              </Button>
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </div>
          ) : (
            <Button type="submit" className="w-full">
              Create Will
            </Button>
          )}
        </form>
      </Modal>
    </div>
  );
}

export default Wills;
