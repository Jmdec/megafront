"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEllipsisV } from "react-icons/fa";
import AddModal from "./modal/AddModal";

interface Property {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  status: string;
  priceRange: string;
  lotArea: string;
  masterPlan: string;
  floors: number;
  parkingLots: number;
  amenities: string; // JSON string
  units: string; // JSON string
  developmentType: string;
  specificLocation: string | null;
}

export default function PropertyPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/property`);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const columns = [
    { name: "Name", selector: (row: Property) => row.name || "N/A", sortable: true },
    { name: "Development Type", selector: (row: Property) => row.developmentType || "N/A", sortable: true },
    { name: "Location", selector: (row: Property) => row.location || "N/A", sortable: true },
    { name: "Specific Location", selector: (row: Property) => row.specificLocation || "N/A", sortable: true },
    {
  name: "Price Range",
  selector: (row: Property) => {
    // Split the price range string into two parts and format them
    const priceRange = row.priceRange || "0 - 0";
    const [minPrice, maxPrice] = priceRange.split(" - ").map(price => {
      const formattedPrice = parseFloat(price.replace(/[^0-9.-]+/g, '')) // Remove any non-numeric characters
        .toLocaleString('en-PH'); // Format the number as Filipino currency
      return formattedPrice;
    });

    // Return formatted price range with the peso sign
    return `₱${minPrice} - ₱${maxPrice}`;
  },
  sortable: true,
  wrap:true
},

    { name: "Floors", selector: (row: Property) => row.floors || "N/A", sortable: true },
    { name: "Parking Lots", selector: (row: Property) => row.parkingLots || "N/A", sortable: true },
    { name: "Lot Area", selector: (row: Property) => row.lotArea || "N/A", sortable: true },
    {
      name: "Master Plan",
      cell: (row: Property) => (
        <img
          src={`${API_BASE_URL}${row.masterPlan}`}
          alt="Master Plan"
          className="w-12 h-12 rounded-md"
        />
      ),
      sortable: false,
    },
    {
      name: "Image",
      cell: (row: Property) => (
        <img
          src={`${API_BASE_URL}${row.image}`}
          alt={row.name}
          className="w-12 h-12 rounded-md"
        />
      ),
      sortable: false,
    },
    {
      name: "Actions",
      right: true,
      cell: (row: Property) => (
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <FaEllipsisV />
          </button>

          {openMenu === row.id && (
            <div className="fixed right-0 bg-white shadow-md rounded-md w-24 mr-16 py-1 z-50">
              <button
                onClick={() => {}}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {}}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Property Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Property
        </button>
      </div>

      {/* Scrollable Table Container */}
      <div className="overflow-x-auto max-h-full">
        <DataTable
          columns={columns}
          data={properties}
          pagination
          highlightOnHover
          striped
          expandableRows
          expandableRowsComponent={({ data }) => {
            const amenities = JSON.parse(data.amenities);
            return (
              <div className="px-6 py-3 w-full">
                <h3>Additional Information:</h3>
                <p><strong>Amenities:</strong></p>
                <div className="flex space-x-4 overflow-x-auto">
                  {amenities.map((amenity: { name: string; image: string }, index: number) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <img src={`${API_BASE_URL}${amenity.image}`} alt={amenity.name} className="w-12 h-12 rounded-full" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
        />
      </div>

      <AddModal modalOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} fetchData={fetchProperties} />
    </div>
  );
}
