import React, { useContext, useState } from "react";
import { TransactionContext } from "../context/context";

const WillForm = () => {
  const { createWill } = useContext(TransactionContext);
  const [willId, setWillId] = useState(0);
  const [releaseTime, setReleaseTime] = useState(0);
  const [assetName, setAssetName] = useState("");
  const [assetCategory, setAssetCategory] = useState("");
  const [amount, setAmount] = useState(""); // New state for amount
  const [beneficiaries, setBeneficiaries] = useState([
    { address: "", stake: "", name: "" },
  ]);

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

    // Format beneficiary data from the form
    const beneficiaryData = {
      addresses: beneficiaries.map((beneficiary) => beneficiary.address),
      shares: beneficiaries.map((beneficiary) => beneficiary.stake), // Stake represents the share
      names: beneficiaries.map((beneficiary) => beneficiary.name),
    };

    // Extract form values
    const will = parseInt(willId); // Ensure Will ID is an integer
    const rt = parseInt(releaseTime); // Ensure release time is an integer (UNIX timestamp)

    // Call the createWill function
    await createWill(
      will,
      beneficiaryData,
      rt,
      assetName,
      assetCategory,
      "0.01"
    );
    // e.preventDefault();
    // const willId = 11; // Example Will ID
    // const beneficiaryData = {
    //   addresses: ["0xf40b291189aE7F917c39D0B7e327E0A929c9952c"],
    //   shares: [100], // 50% share for each beneficiary
    //   names: ["John Doe"],
    // };
    // const releaseTime = Math.floor(Date.now() / 1000) + 3600 * 24 * 7; // Release time: 1 week from now (UNIX Timestamp)
    // const assetName = "House";
    // const assetCategory = "Real Estate";
    // const amount = "0.01"; // Amount in Ether to send with the transaction

    // // Call the createWill function
    // createWill(
    //   willId,
    //   beneficiaryData,
    //   releaseTime,
    //   assetName,
    //   assetCategory,
    //   amount
    // );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Create Will</h1>
      <form onSubmit={handleSubmit}>
        {/* Will ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Will ID
          </label>
          <input
            type="number"
            value={willId}
            onChange={(e) => setWillId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Release Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Release Time (UNIX Timestamp)
          </label>
          <input
            type="number"
            value={releaseTime}
            onChange={(e) => setReleaseTime(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Asset Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Asset Name
          </label>
          <input
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Asset Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Asset Category
          </label>
          <input
            type="text"
            value={assetCategory}
            onChange={(e) => setAssetCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Amount (Ether)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} // Handling amount input
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Beneficiaries */}
        <h2 className="text-xl font-semibold mb-4">Beneficiaries</h2>
        {beneficiaries.map((beneficiary, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Stake
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default WillForm;
