import React, { useContext, useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { TransactionContext } from "../context/context";

// Dummy data
const dummyData = [
  {
    willId: "WILL123",
    createdDate: "2024-01-10",
    status: "Active",
    lastModified: "2024-12-20",
    willDetails: "This is the content of the will for WILL123.",
  },
  {
    willId: "WILL124",
    createdDate: "2023-11-22",
    status: "Pending",
    lastModified: "2024-12-15",
    willDetails: "This is the content of the will for WILL124.",
  },
  {
    willId: "WILL125",
    createdDate: "2024-05-05",
    status: "Executed",
    lastModified: "2024-12-18",
    willDetails: "This is the content of the will for WILL125.",
  },
];

function MyStake() {
  const [selectedWillDetails, setSelectedWillDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getBeneficiaryWills } = useContext(TransactionContext);

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
    // Place your full Base64 string here
    const tickBase64 = "";
    // Add the image to the PDF
    doc.addImage(tickBase64, "PNG", 10, 10, 50, 50); // X, Y position and size

    // Add some text and data to the PDF
    doc.text(`Generated at: ${currentDateTime}`, 10, 70);
    doc.text("Will Information:", 10, 80);
    doc.text(willDetails, 10, 90);

    // Save the generated PDF
    doc.save("will_information.pdf");
  };

  useEffect(() => {
    const fetchData = async () => {
      const account = localStorage.getItem("account");
      const res = await getBeneficiaryWills(account);
      console.log(res);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4 text-center">
        My Stake Information
      </h1>

      {/* Table displaying the will information */}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300 text-center">
              WILL ID
            </th>
            <th className="px-4 py-2 border border-gray-300 text-center">
              CREATED DATE
            </th>
            <th className="px-4 py-2 border border-gray-300 text-center">
              STATUS
            </th>
            <th className="px-4 py-2 border border-gray-300 text-center">
              LAST MODIFIED
            </th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border border-gray-300 text-center">
                {row.status === "Executed" ? (
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
              <td className="px-4 py-2 border border-gray-300 text-center">
                {row.createdDate}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {row.status}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {row.lastModified}
              </td>
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
