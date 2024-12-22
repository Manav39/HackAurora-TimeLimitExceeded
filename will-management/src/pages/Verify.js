import React, { useContext, useState } from "react";
import { TransactionContext } from "../context/context";

const VerifyWillForm = () => {
  const { verifyWill } = useContext(TransactionContext);
  const [willId, setWillId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await verifyWill(willId);
    } catch (error) {
      console.error("Error verifying the will:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Verify Will</h1>
      <form onSubmit={handleSubmit}>
        {/* Will ID Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Will ID
          </label>
          <input
            type="number"
            value={willId}
            onChange={(e) => setWillId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white rounded-md shadow-sm ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Will"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyWillForm;
