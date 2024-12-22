import React, { useContext, useState } from "react";
import { TransactionContext } from "../context/context";

const DeleteWillForm = () => {
  const { deleteWill } = useContext(TransactionContext);
  const [willId, setWillId] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the deleteWill function
    await deleteWill(willId);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Delete Will</h1>
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
