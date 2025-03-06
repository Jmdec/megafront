"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEllipsisV } from "react-icons/fa";
import AddModal from "./modal/AddModal";
import { showToast } from "@/components/toast";
import EditPropertyModal from "./modal/EditPropety";
import EditFeaturesModal from "./modal/EditFeature";
import EditAmenitiesModal from "./modal/EditAmenities";

interface Property {
  features: string;
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
interface Feature {
  name: string;
  id:number;
}
interface Amenity {
  name: string;
  image?: File | string; // Can be an existing URL or new File
  originalImage?: string; // Store the previous image URL
}

export default function PropertyPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingProperty, setEditingProperty] = useState<Property | null>(null);
const [isEditFeaturesModalOpen, setIsEditFeaturesModalOpen] = useState(false);
const [editingFeatures, setEditingFeatures] = useState<Feature[]>([]);
const [editingPropertyId, setEditingPropertyId] = useState<number | null>(null);
const [isEditAmenitiesModalOpen, setIsEditAmenitiesModalOpen] = useState(false);
const [editingAmenities, setEditingAmenities] = useState<Amenity[]>([]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/property`);
      const data = await response.json();
      console.log(data)
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);
    const confirmDelete = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteModalOpen(true);
  };
const openEditModal = (property: Property) => {
  setEditingProperty(property);
  setIsEditModalOpen(true);
};
const openEditFeaturesModal = (property: Property) => {
  const features: Feature[] = JSON.parse(property.features || "[]").map((feature: { id?: number; name: string }, index: number) => ({
    id: feature.id ?? index + 1, // Ensure ID exists
    name: feature.name,
  }));

  setEditingPropertyId(property.id); // Store the property ID
  setEditingFeatures(features);
  setIsEditFeaturesModalOpen(true);
};

const openEditAmenitiesModal = (property: Property) => {
  const amenities: Amenity[] = JSON.parse(property.amenities || "[]").map(
    (amenity: { name: string; image?: string }) => ({
      name: amenity.name,
      image: amenity.image || undefined, // Preserve existing image URL
    })
  );

  setEditingPropertyId(property.id);
  setEditingAmenities(amenities);
  setIsEditAmenitiesModalOpen(true);
};
  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;

    try {
      await fetch(`${API_BASE_URL}/api/property/${propertyToDelete.id}`, {
        method: "DELETE",
      });
      fetchProperties();
      setDeleteModalOpen(false);
      showToast("Property deleted successfully","success")
    } catch (error) {
          showToast("Property deleting rejected"+ error,"error")

    }
  };
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
    { name: "Lot Area", selector: (row: Property) => row.lotArea || "N/A", sortable: true },
    { name: "Floors", selector: (row: Property) => row.floors || "N/A", sortable: true },
    { name: "Parking Lots", selector: (row: Property) => row.parkingLots || "N/A", sortable: true },

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
  onClick={() => openEditModal(row)}
  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
>
  Edit Property
</button>

               <button
  onClick={() => openEditFeaturesModal(row)}
  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
>
  Edit Feature
</button>

               <button
                onClick={() => openEditAmenitiesModal(row)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit Amenities
              </button>
              <button
                onClick={() => confirmDelete(row)}
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
      const amenities = JSON.parse(data.amenities || "[]");
      const features = JSON.parse(data.features || "[]");

      return (
        <div className="px-6 py-3 w-full">
          <h3 className="font-semibold">Additional Information:</h3>
          
          {/* Amenities Section */}
          <p className="mt-2 font-medium">Amenities:</p>
          <div className="flex space-x-4 overflow-x-auto py-2">
            {amenities.length > 0 ? (
              amenities.map((amenity: { name: string; image: string }, index: number) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <img src={`${API_BASE_URL}${amenity.image}`} alt={amenity.name} className="w-12 h-12 rounded-full" />
                  <span>{amenity.name}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No amenities available</p>
            )}
          </div>

          {/* Features Section */}
         <p className="mt-4 font-medium">Features:</p>
<div className="flex flex-wrap gap-4 mt-2">
  {features.length > 0 ? (
    features.map((feature: { name: string }, index: number) => (
      <div key={index} className="px-4 py-2 bg-gray-200 rounded-md">
        {feature.name}
      </div>
    ))
  ) : (
    <p className="text-gray-500">No features available</p>
  )}
</div>

        </div>
      );
    }}
  />
</div>
{isEditModalOpen && editingProperty && (
  <EditPropertyModal
    modalOpen={isEditModalOpen}
    closeModal={() => setIsEditModalOpen(false)}
    property={editingProperty}
    fetchData={fetchProperties}
  />
)}
{isEditFeaturesModalOpen && editingPropertyId !== null && (
  <EditFeaturesModal
    propertyId={editingPropertyId} // Pass property ID
    features={editingFeatures}
    setFeatures={setEditingFeatures}
    closeModal={() => setIsEditFeaturesModalOpen(false)}
    fetchProperties={fetchProperties} // ✅ Ensure this is passed
  />
)}
{isEditAmenitiesModalOpen && editingPropertyId !== null && (
  <EditAmenitiesModal
    propertyId={editingPropertyId}
    amenities={editingAmenities}
    setAmenities={setEditingAmenities}
    closeModal={() => {
      setIsEditAmenitiesModalOpen(false);
      fetchProperties(); // ✅ Refresh properties when modal closes
    }}
    fetchProperties={fetchProperties} // ✅ Ensure data refresh
  />
)}


 {deleteModalOpen && propertyToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete "{propertyToDelete.name}"?</p>
            <div className="flex justify-end gap-1">
              <button
                onClick={handleDeleteProperty}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <AddModal modalOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} fetchData={fetchProperties} />
    </div>
  );
}
