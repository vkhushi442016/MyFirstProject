import React from "react";

const PerformanceBar = ({ label, value }) => {
  // Map performance to Tailwind colors
  const colors = {
    Excellent: "bg-green-500",
    Good: "bg-blue-500",
    Average: "bg-yellow-400",
    Poor: "bg-red-500",
  };

const textColorClasses = {
    Excellent: "text-green-500",
    Good: "text-blue-500",
    Average: "text-yellow-400",
    Poor: "text-red-500",
  };

  return (
    <div className="mb-4">
      {/* Label with percentage */}
      <div className={`flex justify-between mb-1 font-semibold ${textColorClasses[label]}`}>
        <span>{label}</span>
        <span >{value}%</span>
      </div>

      {/* Bar background */}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        {/* Filled portion */}
        <div
          className={`${colors[label] || "bg-gray-400"} h-full rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default PerformanceBar;