import React, { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../context/context";
import { useLocation } from "react-router-dom";

const DeleteWillForm = () => {
  const { deleteWill } = useContext(TransactionContext);
  const { state } = useLocation(); // Access passed state
  const willData = state?.will || {}; // Default to an empty object if no state passed

  // Helper function to convert hex to int
  const parseHexToInt = (hex) => parseInt(hex, 16);

  const [willId, setWillId] = useState(
    willData?.willId?._hex ? parseHexToInt(willData.willId._hex) : 0
  );

  useEffect(() => {
    // Ensure willId is set properly when component mounts
    if (willData?.willId?._hex) {
      setWillId(parseHexToInt(willData.willId._hex));
    }
  }, [willData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the deleteWill function
      await deleteWill(willId);
      alert(`Will with ID ${willId} has been successfully deleted.`);
    } catch (error) {
      console.error("Error deleting will:", error);
      alert("Failed to delete the will. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Delete Will</h1>
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

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Will
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteWillForm;
