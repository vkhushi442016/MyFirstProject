import { useState } from "react";

export default function Toggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
          enabled ? "bg-indigo-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
            enabled ? "translate-x-7" : ""
          }`}
        />
      </button>

      <span className="text-sm font-medium">
        {enabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}
