import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store"; // Adjust path as needed
import { fetchProperties } from "@/app/redux/services/propertyService";

const Form: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Fetch properties from Redux store
  const properties = useSelector((state: RootState) => state.propertyData.properties);
  const loading = useSelector((state: RootState) => state.propertyData.loading);
  const error = useSelector((state: RootState) => state.propertyData.error);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showMinDropdown, setShowMinDropdown] = useState(false);
  const [showMaxDropdown, setShowMaxDropdown] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Fetch properties on mount
  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  // ✅ Handle property rotation
  useEffect(() => {
   
    if (properties.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [properties]);

  // ✅ Price suggestions
  const priceSuggestions = [
    "1,000,000",
    "5,000,000",
    "10,000,000",
    "20,000,000",
    "30,000,000",
    "40,000,000",
  ];

  // ✅ Format price with comma
  const formatPrice = (value: string) => {
    return value.replace(/[^\d]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center w-full min-h-screen mx-auto p-4 sm:p-6">
      {/* ✅ Left Section: Property Display */}
      <div className="flex items-center justify-end w-full sm:w-7/12 min-h-[450px] sm:min-h-[500px] text-center sm:text-end p-6 sm:p-12 sm:bg-black/50 rounded-lg shadow-lg transition-opacity duration-500 ease-in-out">
        {loading ? (
          <div className="text-white text-lg">Loading...</div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : properties.length > 0 ? (
          <div className="w-full max-w-full">
            <h1 className="text-3xl sm:text-7xl font-extrabold text-neutral-100">
              {properties[currentIndex].name}
            </h1>
            <h3 className="text-lg sm:text-xl font-extrabold text-neutral-100">
              at {properties[currentIndex].location}
            </h3>
            <p className="mt-4 text-neutral-100 text-md sm:text-lg">
              {properties[currentIndex].description}
            </p>
            <button className="mt-6 px-4 sm:px-6 py-3 bg-white text-black font-bold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300">
             View {properties[currentIndex].name}
            </button>
          </div>
        ) : (
          <p className="text-white text-lg">No properties available</p>
        )}
      </div>

      {/* ✅ Right Section: Form */}
      <div className="relative bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-6 sm:p-12 w-full sm:max-w-xl min-h-[500px] text-center flex flex-col justify-center space-y-6">
        <h2 className="text-black text-2xl sm:text-3xl font-extrabold">Find Your Dream Home</h2>
        <p className="text-black text-md">Find the perfect home that fits your lifestyle and budget.</p>

        {/* ✅ Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select className="flex-1 p-4 bg-white/90 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#B8986E] focus:outline-none transition">
            <option value="">Select Location</option>
            <option value="metro-manila">Metro Manila</option>
            <option value="luzon">Luzon</option>
            <option value="visayas">Visayas</option>
            <option value="mindanao">Mindanao</option>
          </select>

          <select className="flex-1 p-4 bg-white/90 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#B8986E] focus:outline-none transition">
            <option value="">Select Type</option>
            <option value="high-rise-condo">High Rise Condominium</option>
            <option value="mid-rise-condo">Mid Rise Condominium</option>
            <option value="low-rise-condo">Low Rise Condominium</option>
            <option value="office">Office</option>
          </select>
        </div>

        {/* ✅ Price Range Inputs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-4 text-gray-500">₱</span>
            <input
              type="text"
              placeholder="Min Price"
              value={minPrice}
              onFocus={() => setShowMinDropdown(true)}
              onBlur={() => setTimeout(() => setShowMinDropdown(false), 200)}
              onChange={(e) => setMinPrice(formatPrice(e.target.value))}
              className="w-full pl-8 p-4 bg-white/90 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#B8986E] focus:outline-none transition"
            />
            {showMinDropdown && (
              <ul className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 z-10">
                {priceSuggestions.map((price, index) => (
                  <li
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => setMinPrice(price)}
                  >
                    {price}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative flex-1">
            <span className="absolute left-3 top-4 text-gray-500">₱</span>
            <input
              type="text"
              placeholder="Max Price"
              value={maxPrice}
              onFocus={() => setShowMaxDropdown(true)}
              onBlur={() => setTimeout(() => setShowMaxDropdown(false), 200)}
              onChange={(e) => setMaxPrice(formatPrice(e.target.value))}
              className="w-full pl-8 p-4 bg-white/90 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#B8986E] focus:outline-none transition"
            />
            {showMaxDropdown && (
              <ul className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 z-10">
                {priceSuggestions.map((price, index) => (
                  <li
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => setMaxPrice(price)}
                  >
                    {price}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg">
          Search
        </button>
      </div>
    </div>
  );
};

export default Form;
