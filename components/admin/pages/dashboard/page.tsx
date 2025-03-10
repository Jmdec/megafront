"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import {
  fetchPropertyStatistics,
  fetchOfficeStatistics,
  fetchAgentStatistics,
  fetchSeminarStatistics,
  fetchMeetingStatistics,
  fetchEventStatistics,
  fetchClosedDealStatistics,
  fetchRealEstateNewsStatistics,
  fetchRealEstateTipsStatistics,
  fetchOngoingInfrastructureStatistics,
} from "@/app/redux/services/dashboardService";
import Loading from "@/components/loading/loadingAdmin"; 
const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    totalProperties = 0,
    totalOffices = 0,
    totalAgents = 0,
    propertyStatusCounts = {},
    officeStatusCounts = {},
    agentRoleCounts = {},
    totalSeminars = 0,
    totalMeetings = 0,
    totalEvents = 0,
    totalClosedDeals = 0,
    totalRealEstateNews = 0,
    totalRealEstateTips = 0,
    totalOngoingInfrastructures = 0,
    loading,
    error,
  } = useSelector((state: RootState) => state.dashboardData);

  useEffect(() => {
    dispatch(fetchPropertyStatistics());
    dispatch(fetchOfficeStatistics());
    dispatch(fetchAgentStatistics());
    dispatch(fetchSeminarStatistics());
    dispatch(fetchMeetingStatistics());
    dispatch(fetchEventStatistics());
dispatch(fetchClosedDealStatistics()).then((action) => console.log("💼 Closed Deals Stats:", action.payload));
  dispatch(fetchRealEstateNewsStatistics()).then((action) => console.log("📰 Real Estate News Stats:", action.payload));
  dispatch(fetchRealEstateTipsStatistics()).then((action) => console.log("💡 Real Estate Tips Stats:", action.payload));
  dispatch(fetchOngoingInfrastructureStatistics()).then((action) => console.log("🏗️ Ongoing Infrastructure Stats:", action.payload));
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Admin Dashboard</h2>

      {loading ? (
        <p className="text-gray-500">Loading statistics...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 🏠 Property Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-700 mb-4">🏠 Property Overview</h3>
              <p className="text-4xl font-semibold text-[#B8986E]">{totalProperties}</p>
              <p className="text-gray-600 text-sm">Total Properties</p>

              {/* 🔹 Property Status Breakdown */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {Object.entries(propertyStatusCounts || {}).map(([status, count]) => (
                  <div key={status} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                    <h5 className="text-sm font-medium text-gray-600">{status}</h5>
                    <p className="text-xl font-bold text-[#B8986E]">{count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🏢 Office Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-700 mb-4">🏢 Office Overview</h3>
              <p className="text-4xl font-semibold text-[#B8986E]">{totalOffices}</p>
              <p className="text-gray-600 text-sm">Total Offices</p>

              {/* 🔹 Office Status Breakdown */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {Object.entries(officeStatusCounts || {}).map(([status, count]) => (
                  <div key={status} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                    <h5 className="text-sm font-medium text-gray-600">{status}</h5>
                    <p className="text-xl font-bold text-[#B8986E]">{count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 👨‍💼 Agent Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-700 mb-4">👨‍💼 Agent Overview</h3>
              <p className="text-4xl font-semibold text-[#B8986E]">{totalAgents}</p>
              <p className="text-gray-600 text-sm">Total Agents</p>

              {/* 🔹 Agent Role Breakdown */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {Object.entries(agentRoleCounts || {}).map(([role, count]) => (
                  <div key={role} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                    <h5 className="text-sm font-medium text-gray-600">{role}</h5>
                    <p className="text-xl font-bold text-[#B8986E]">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 🎤 Seminar & Infrastructure Statistics */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-700 mb-4">📅 Other Statistics</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Individual Statistic Boxes */}
              {[
                { label: "🎤 Seminars", value: totalSeminars },
                { label: "📅 Meetings", value: totalMeetings },
                { label: "🎭 Events", value: totalEvents },
                { label: "🏆 Closed Deals", value: totalClosedDeals },
                { label: "📰 Real Estate News", value: totalRealEstateNews },
                { label: "💡 Real Estate Tips", value: totalRealEstateTips },
                { label: "🏗️ Ongoing Infrastructure", value: totalOngoingInfrastructures },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                  <h5 className="text-sm font-medium text-gray-600">{item.label}</h5>
                  <p className="text-xl font-bold text-[#B8986E]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
