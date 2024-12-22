import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransactionContext } from "../context/context";

const OwnerWillsList = () => {
  const { getOwnerWills } = useContext(TransactionContext);
  const [wills, setWills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ownerAddress, setOwnerAddress] = useState("");
  const navigate = useNavigate();

  const fetchOwnerWills = async () => {
    if (!ownerAddress) return;
    setIsLoading(true);
    try {
      const account = localStorage.getItem("account");
      const ownerWills = await getOwnerWills(account);
      console.log(ownerWills);
      setWills(ownerWills);
    } catch (error) {
      console.error("Error fetching owner's wills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setOwnerAddress(localStorage.getItem("account"));
    if (ownerAddress) {
      fetchOwnerWills();
    }
  }, [ownerAddress]);

  const handleUpdate = (will) => {
    navigate(`/modify/${will.willId}`, { state: { will } });
  };

  const handleDelete = (will) => {
    navigate(`/delete/${will.willId}`, { state: { will } });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h1 className="text-2xl font-semibold mb-6">Owner's Wills</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Owner Address
        </label>
        <input
          type="text"
          value={ownerAddress}
          onChange={(e) => setOwnerAddress(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wills.length === 0 ? (
            <p>No wills found for this owner.</p>
          ) : (
            wills.map((will, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-indigo-600 truncate">
                  Will ID: {will?.willId?.toString()}
                </h2>
                <p className="mt-2 text-gray-700">
                  <strong>Asset Name:</strong> {will.assetName}
                </p>
                <p className="mt-2 text-gray-700">
                  <strong>Asset Category:</strong> {will.assetCategory}
                </p>
                <p className="mt-2 text-gray-700">
                  <strong>Release Time:</strong>{" "}
                  {new Date(
                    will.releaseTime.toNumber() * 1000
                  ).toLocaleString()}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  Beneficiaries:
                </h3>
                <ul className="mt-2">
                  {will.beneficiaries.map((beneficiary, idx) => (
                    <li key={idx} className="mt-1">
                      <p className="text-gray-700 truncate">
                        <strong>Name:</strong> {beneficiary.name}
                      </p>
                      <p className="text-gray-700 truncate">
                        <strong>Address:</strong> {beneficiary.beneficiary}
                      </p>
                      <p className="text-gray-700">
                        <strong>Stake:</strong>{" "}
                        {beneficiary?.share?.toString()}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => handleUpdate(will)}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(will)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerWillsList;
