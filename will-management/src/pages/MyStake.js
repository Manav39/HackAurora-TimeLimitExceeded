import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

// Dummy data
const dummyData = [
  {
    willId: 'WILL123',
    createdDate: '2024-01-10',
    status: 'Active',
    lastModified: '2024-12-20',
    willDetails: 'This is the content of the will for WILL123.',
  },
  {
    willId: 'WILL124',
    createdDate: '2023-11-22',
    status: 'Pending',
    lastModified: '2024-12-15',
    willDetails: 'This is the content of the will for WILL124.',
  },
  {
    willId: 'WILL125',
    createdDate: '2024-05-05',
    status: 'Executed',
    lastModified: '2024-12-18',
    willDetails: 'This is the content of the will for WILL125.',
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

  const generatePDF = (willDetails) => {
    const doc = new jsPDF();
    const currentDateTime = new Date().toLocaleString();

    // Base64-encoded image data (example image)
    const tickBase64 = "data:image/png;base64,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"; // Place your full Base64 string here

    // Add the image to the PDF
    doc.addImage(tickBase64, "PNG", 10, 10, 50, 50); // X, Y position and size

    // Add some text and data to the PDF
    doc.text(`Generated at: ${currentDateTime}`, 10, 70);
    doc.text("Will Information:", 10, 80);
    doc.text(willDetails, 10, 90);

    // Save the generated PDF
    doc.save("will_information.pdf");
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
            {selectedWillDetails ? (
              <p>{selectedWillDetails}</p>
            ) : (
              <p>No details available.</p>
            )}
            <div className="mt-4">
              {/* Button to generate the PDF */}
              <button
                onClick={() => generatePDF(selectedWillDetails)} // Pass the willDetails to generatePDF
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Generate and Download PDF
              </button>
            </div>
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
