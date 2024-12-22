import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import WillForm from "./WillForm";

function Wills() {
  const { getOwnerWills } = useContext(TransactionContext);
  const [wills, setWills] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWill, setSelectedWill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [beneficiaries, setBeneficiaries] = useState([
    { name: "", percentage: "" },
  ]);
  const [asset, setAsset] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [isWillFormOpen, setIsWillFormOpen] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setOwnerAddress(localStorage.getItem("account"));
    if (ownerAddress) {
      fetchOwnerWills();
    }
  }, [ownerAddress]);

  const fetchOwnerWills = async () => {
    if (!ownerAddress) return;
    setIsLoading(true);
    try {
      const fetchedWills = await getOwnerWills(ownerAddress);
      const formattedWills = fetchedWills.map((will) => ({
        id: parseInt(will.willId._hex, 16), 
        created: new Date(parseInt(will.createdAt._hex, 16) * 1000).toLocaleString(),
        status: "Active",
        beneficiaries: will.beneficiaries.map((b) => ({
          name: b.name,
          percentage: parseInt(b.share._hex, 16), 
        })),
        asset: will.assetName,
        releaseDate: new Date(parseInt(will.releaseTime._hex, 16) * 1000).toLocaleString(),
        lastModified: "Just now",
      }));
      setWills(formattedWills);
    } catch (error) {
      console.error("Error fetching owner's wills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewWill = () => {
    setIsWillFormOpen(true); // Open the WillForm
  };

  const handleFormClose = () => {
    setIsWillFormOpen(false); // Close the WillForm
  };

  const handleWillSubmit = (newWill) => {
    setWills((prevWills) => [...prevWills, newWill]);
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

  const resetForm = () => {
    setBeneficiaries([{ name: "", percentage: "" }]);
    setAsset("");
    setReleaseDate("");
    setIsEditMode(false);
    setSelectedWill(null);
  };

  const handleViewClick = (will) => {
    navigate("/ownerwills", { state: { will } });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Will Management</h1>
        <button
          onClick={handleCreateNewWill}
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
              {/* <th className="px-4 py-3 text-left font-semibold">
                LAST MODIFIED
              </th> */}
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
                  className={`
                    px-2 py-1 rounded-lg text-white font-semibold
                    ${will.status === "Active" ? "bg-green-500" : "bg-yellow-500"}
                  `}
                >
                  {will.status}
                </Badge>
                </td>
                <td className="px-4 py-2">
                  {will.beneficiaries.map((b) => `${b.name} (${b.percentage}%)`).join(", ")}
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="link"
                    onClick={() => handleViewClick(will)}
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

      {isWillFormOpen && (
        <WillForm onClose={handleFormClose} onSubmit={handleWillSubmit} />
      )}
    </div>
  );
}

export default Wills;
