import React, { useContext, useState, useEffect } from "react";
import { TransactionContext } from "../context/context";
import { useLocation } from "react-router-dom";

const WillForm = () => {
  const { modifyWill, isLoading } = useContext(TransactionContext);
  const { state } = useLocation(); // Access passed state
  const willData = state?.will || {}; // Default to an empty object if no state passed

  const parseHexToInt = (hex) => parseInt(hex, 16);

  const parseReleaseTime = (time) => {
    try {
      if (time) {
        const unixTime =
          typeof time === "object" && time.toNumber
            ? time.toNumber() * 1000 // Convert BigNumber to milliseconds
            : parseInt(time, 10) * 1000; // Parse string/number to milliseconds
        return new Date(unixTime).toISOString().slice(0, 16); // Convert to 'YYYY-MM-DDTHH:mm' format
      }
    } catch {
      return new Date().toISOString().slice(0, 16); // Fallback to current time
    }
  };

  const [willId, setWillId] = useState(
    willData?.willId?._hex ? parseHexToInt(willData.willId._hex) : 0
  );
  const [releaseTime, setReleaseTime] = useState(parseReleaseTime(willData?.releaseTime));
  const [assetName, setAssetName] = useState(willData?.assetName || "");
  const [assetCategory, setAssetCategory] = useState(willData?.assetCategory || "");
  const [beneficiaries, setBeneficiaries] = useState(
    willData?.beneficiaries?.map((beneficiary) => ({
      address: beneficiary[0] || "",
      stake: beneficiary[1]?._hex ? parseHexToInt(beneficiary[1]._hex) : 0,
      name: beneficiary[3] || "",
    })) || [{ address: "", stake: "", name: "" }]
  );

  useEffect(() => {
    if (willData) {
      setWillId(willData?.willId?._hex ? parseHexToInt(willData.willId._hex) : 0);
      setReleaseTime(parseReleaseTime(willData.releaseTime));
      setAssetName(willData.assetName || "");
      setAssetCategory(willData.assetCategory || "");
      setBeneficiaries(
        willData.beneficiaries?.map((beneficiary) => ({
          address: beneficiary[0] || "",
          stake: beneficiary[1]?._hex ? parseHexToInt(beneficiary[1]._hex) : 0,
          name: beneficiary[3] || "",
        })) || [{ address: "", stake: "", name: "" }]
      );
    }
  }, [willData]);

  const handleAddBeneficiary = () => {
    setBeneficiaries([...beneficiaries, { address: "", stake: "", name: "" }]);
  };

  const handleBeneficiaryChange = (index, field, value) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index][field] = value;
    setBeneficiaries(updatedBeneficiaries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const beneficiaryData = {
      addresses: beneficiaries.map((beneficiary) => beneficiary.address),
      shares: beneficiaries.map((beneficiary) => parseFloat(beneficiary.stake) || 0),
      names: beneficiaries.map((beneficiary) => beneficiary.name),
    };

    const rt = new Date(releaseTime).getTime() / 1000; // Convert to UNIX timestamp

    await modifyWill(willId, beneficiaryData, rt, assetName, assetCategory);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Modify Will</h1>
      <form onSubmit={handleSubmit}>
        {/* Will ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Will ID</label>
          <input
            type="number"
            value={willId}
            disabled // Disable editing of Will ID
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        {/* Release Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Release Time</label>
          <input
            type="datetime-local"
            value={releaseTime}
            onChange={(e) => setReleaseTime(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Asset Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Asset Name</label>
          <input
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Asset Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Asset Category</label>
          <input
            type="text"
            value={assetCategory}
            onChange={(e) => setAssetCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Beneficiaries */}
        <h2 className="text-xl font-semibold mb-4">Beneficiaries</h2>
        {beneficiaries.map((beneficiary, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={beneficiary.address}
                onChange={(e) =>
                  handleBeneficiaryChange(index, "address", e.target.value)
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Stake (%)</label>
              <input
                type="number"
                value={beneficiary.stake}
                onChange={(e) =>
                  handleBeneficiaryChange(index, "stake", e.target.value)
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={beneficiary.name}
                onChange={(e) =>
                  handleBeneficiaryChange(index, "name", e.target.value)
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddBeneficiary}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Add Beneficiary
        </button>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WillForm;
