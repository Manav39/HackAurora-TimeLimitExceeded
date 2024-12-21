import React, { useState } from 'react';

// Dummy data
const dummyData = [
  {
    willId: 'WILL123',
    createdDate: '2024-01-10',
    status: 'Active',
    lastModified: '2024-12-20',
  },
  {
    willId: 'WILL124',
    createdDate: '2023-11-22',
    status: 'Pending',
    lastModified: '2024-12-15',
  },
  {
    willId: 'WILL125',
    createdDate: '2024-05-05',
    status: 'Executed',
    lastModified: '2024-12-18',
    willDetails: 'This is the content of the will for beneficiary with ID WILL125.', // Sample content for executed will
  },
];

function MyStake() {
  const [selectedWillDetails, setSelectedWillDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (willDetails) => {
    setSelectedWillDetails(willDetails);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWillDetails(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4 text-center">My Stake Information</h1>
      
      {/* Table displaying the will information */}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300 text-center">WILL ID</th>
            <th className="px-4 py-2 border border-gray-300 text-center">CREATED DATE</th>
            <th className="px-4 py-2 border border-gray-300 text-center">STATUS</th>
            <th className="px-4 py-2 border border-gray-300 text-center">LAST MODIFIED</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border border-gray-300 text-center">
                {row.status === 'Executed' ? (
                  <button
                    className="text-blue-500 underline"
                    onClick={() => handleOpenModal(row.willDetails)}
                  >
                    {row.willId}
                  </button>
                ) : (
                  row.willId
                )}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">{row.createdDate}</td>
              <td className="px-4 py-2 border border-gray-300 text-center">{row.status}</td>
              <td className="px-4 py-2 border border-gray-300 text-center">{row.lastModified}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for showing will details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Will Details</h2>
            <p>{selectedWillDetails}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyStake;
