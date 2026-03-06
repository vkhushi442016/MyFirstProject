import React, { useState } from 'react';

const DynamicPage = () => {
  // 1. Initialize state with one empty field
  const [fields, setFields] = useState([{ value: '' }]);

  // 2. Function to add a new field to the array
  const addField = () => {
    setFields([...fields, { value: '' }]);
  };

  // 3. Handle changes for specific fields using their index
  const handleInputChange = (index, event) => {
    const values = [...fields];
    values[index].value = event.target.value;
    setFields(values);
  };

  // 4. (Optional) Remove a field
  const removeField = (index) => {
    const values = [...fields];
    values.splice(index, 1);
    setFields(values);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Dynamic Fields</h2>
      
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={field.value}
              placeholder={`Field ${index + 1}`}
              onChange={(e) => handleInputChange(index, e)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fields.length > 1 && (
              <button
                onClick={() => removeField(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addField}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
      >
        + Add Field
      </button>
    </div>
  );
};

export default DynamicPage;
