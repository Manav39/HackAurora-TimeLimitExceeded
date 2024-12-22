import React, { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../context/context";

const OwnerWillsList = () => {
  const { getOwnerWills } = useContext(TransactionContext);
  const [wills, setWills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ownerAddress, setOwnerAddress] = useState(""); // Address of the owner

  // Fetch all wills of the owner
  const fetchOwnerWills = async () => {
    if (!ownerAddress) return;
    setIsLoading(true);
    try {
      const ownerWills = await getOwnerWills();
      setWills(ownerWills);
    } catch (error) {
      console.error("Error fetching owner's wills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ownerAddress) {
      fetchOwnerWills();
    }
  }, [ownerAddress]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Owner's Wills</h1>

      {/* Owner Address Input */}
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
        <div>
          {wills.length === 0 ? (
            <p>No wills found for this owner.</p>
          ) : (
            <ul>
              {wills.map((will, index) => (
                <li key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <h2 className="text-xl font-semibold">
                    Will ID: {will.willId.toString()}
                  </h2>{" "}
                  {/* Handle BigNumber with toString */}
                  <p>
                    <strong>Asset Name:</strong> {will.assetName}
                  </p>
                  <p>
                    <strong>Asset Category:</strong> {will.assetCategory}
                  </p>
                  <p>
                    <strong>Release Time:</strong>{" "}
                    {new Date(
                      will.releaseTime.toNumber() * 1000
                    ).toLocaleString()}
                  </p>{" "}
                  {/* Convert BigNumber to number */}
                  <h3 className="text-lg font-semibold">Beneficiaries:</h3>
                  <ul>
                    {will.beneficiaries.map((beneficiary, index) => (
                      <li key={index}>
                        <p>
                          <strong>Name:</strong> {beneficiary.name}
                        </p>
                        <p>
                          <strong>Address:</strong> {beneficiary.address}
                        </p>
                        <p>
                          <strong>Stake:</strong> {beneficiary.stake.toString()}
                        </p>{" "}
                        {/* Handle BigNumber with toString */}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerWillsList;
