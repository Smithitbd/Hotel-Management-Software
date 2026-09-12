import React from "react";
import { useQuery } from "@tanstack/react-query";
import ReactApexChart from "react-apexcharts";
import {
  FaUsers,
  FaUserTie,
  FaBed,
  FaDoorOpen,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import useAxios from "../../../hooks/useAxios";
import useUserStatus from "../../../hooks/useUserStatus";
import { Navigate } from "react-router";

const Root = () => {
  const axiosInstance = useAxios();
  const { status, statusLoading } = useUserStatus();

  if (statusLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  // When Admin → redirect to Settings
  if (status === "Admin") {
    return <Navigate to="/dashboard/settings" replace />;
  }

  // ====================== STATS ======================
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/stats");
      return res.data;
    },
  });

  // ====================== CUSTOMERS PER MONTH ======================
  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ["customers-per-month"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/customers-per-month");
      return res.data;
    },
  });

  // ====================== REVENUE BY SERVICE ======================
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["revenue-by-service"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/revenue-by-service");
      return res.data;
    },
  });

  // ====================== BAR CHART OPTIONS ======================
  const barOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: customersData?.categories || [],
    },
    yaxis: {
      title: { text: "Number of Customers" },
    },
    fill: { opacity: 1 },
    colors: ["#be123c"],
    tooltip: {
      y: {
        formatter: (val) => `${val} customers`,
      },
    },
  };

  // ====================== PIE CHART OPTIONS ======================
  const pieOptions = {
    chart: {
      type: "pie",
      width: 420,
    },
    labels: revenueData?.labels || [],
    title: {
      text: "Revenue by Service",
      align: "center",
      style: { fontSize: "16px", fontWeight: 600 },
    },
    legend: {
      position: "bottom",
    },
    colors: ["#be123c", "#f97316", "#3b82f6", "#22c55e"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  if (statsLoading || customersLoading || revenueLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ====================== HEADER ====================== */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
          <MdDashboard className="text-xl text-white" />
        </div>
        <h1 className="text-lg font-bold text-rose-700">Dashboard</h1>
      </div>

      <p className="text-gray-500 mb-10">
        Overview of your hotel performance, guests, rooms and revenue.
      </p>

      {/* ====================== TOP STATS CARDS ====================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
        {/* Current Guests */}
        <div className="group bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUsers className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Current Guests</p>
          <p className="text-2xl font-bold text-rose-700">
            {stats?.currentGuests || 0}
          </p>
        </div>

        {/* Current Employees */}
        <div className="group bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUserTie className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Current Employees</p>
          <p className="text-2xl font-bold text-rose-700">
            {stats?.currentEmployees || 0}
          </p>
        </div>

        {/* Available Rooms */}
        <div className="group bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaDoorOpen className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Available Rooms</p>
          <p className="text-2xl font-bold text-rose-700">
            {stats?.totalAvailableRooms || 0}
          </p>
        </div>

        {/* Occupied Rooms */}
        <div className="group bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaBed className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Occupied Rooms</p>
          <p className="text-2xl font-bold text-rose-700">
            {stats?.totalOccupiedRooms || 0}
          </p>
        </div>

        {/* This Month Earning */}
        <div className="group bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaMoneyBillWave className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>
          <p className="text-sm text-gray-500 mb-1">This Month Earning</p>
          <p className="text-2xl font-bold text-rose-700">
            ৳{(stats?.currentMonthEarning || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ====================== CHARTS ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart - Customers per Month */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-[#BF1E2E]">
          <h3 className="text-lg font-bold text-rose-700 mb-5">
            Customers Per Month
          </h3>
          {customersData?.series?.[0]?.data?.length > 0 ? (
            <ReactApexChart
              options={barOptions}
              series={customersData.series}
              type="bar"
              height={350}
            />
          ) : (
            <p className="text-center text-gray-400 py-20">
              No checkout data available yet
            </p>
          )}
        </div>

        {/* Pie Chart - Revenue by Service */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-[#BF1E2E] flex flex-col items-center">
          <h3 className="text-lg font-bold text-rose-700 mb-5 self-start">
            Revenue by Service
          </h3>
          {revenueData?.series?.some((v) => v > 0) ? (
            <ReactApexChart
              options={pieOptions}
              series={revenueData.series}
              type="pie"
              width={420}
            />
          ) : (
            <p className="text-center text-gray-400 py-20">
              No revenue data available yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Root;
