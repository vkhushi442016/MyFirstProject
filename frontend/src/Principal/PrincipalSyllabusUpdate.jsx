import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useStore from '../common/store/store';
import Modal from '../Modal';
import GeneratePDF from '../GeneratePDF';
import { TfiDownload } from 'react-icons/tfi';

const PrincipalSyllabusUpdate = () => {
  const dise_code = useStore((state) => state.dise_code)

  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState(null); //for subject click modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryClasses = {
    Primary: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"],
    Middle: [
      "Class 1", "Class 2", "Class 3", "Class 4",
      "Class 5", "Class 6", "Class 7", "Class 8"
    ],
    HSS: [
      "Class 1", "Class 2", "Class 3", "Class 4",
      "Class 5", "Class 6", "Class 7", "Class 8",
      "Class 9", "Class 10", "Class 11", "Class 12"
    ]
  };

  const getSyllabusData = async (dise_code) => {
    const result = await axios.get(`http://localhost:5008/api/class/syllabus/${dise_code}`)
    //console.log(result.data);
    setData(result.data)
    const category = result.data[0]?.sc_category;

    setClasses(categoryClasses[category] || []);

    setSelectedClass(categoryClasses[category][0]);
  }

  useEffect(() => {
    getSyllabusData(dise_code)
  }, [dise_code])


  // Filter data for selected class
  const filteredData = data.filter(
    (item) => item.className === selectedClass
  );

  // Group syllabus by subject
  const groupedBySubject = filteredData.reduce((acc, item) => {
    const key = `${item.subject_id} - ${item.subject_name}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push({
      topic: item.topic,
      description: item.description,
    });
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-10">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-1 bg-purple-600 rounded-full" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              School Syllabus
            </h1>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="text-purple-600 font-bold tracking-normal">
                {data[0]?.schoolName || "Institutional"}
              </span>
              • Curriculum 2024-25
            </p>
          </div>
        </div>

        {/* Class Selector - Horizontal Pill Track */}
        <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200 inline-flex flex-wrap gap-1 shadow-sm">
          {classes.map((cls) => {
            const isActive = selectedClass === cls;
            return (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`
            relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
            ${isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-200 -translate-y-0.5"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white"
                  }
          `}
              >
                {/* Subtle indicator dot for active state */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 border-2 border-white"></span>
                  </span>
                )}

                <span className="flex items-center gap-2">
                  <span className={`opacity-60 ${isActive ? 'text-white' : 'text-slate-400'}`}>Class</span>
                  {cls}
                </span>
              </button>
            );
          })}
        </div>
      </div>





      <div className="p-4 rounded-md shadow-md bg-white flex flex-wrap gap-2 mb-4 items-center">
        {/* Heading + badges inline */}
        <h1 className="text-lg sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 drop-shadow-lg mr-2">
          All Subjects:
        </h1>

        {/* Subject Badges inline */}
        {Object.keys(groupedBySubject).map((subjectKey, index) => (
          <span
            key={index}
            onClick={() => {
              setSelectedSubject(subjectKey);
              setIsModalOpen(true);
            }}
            className="flex items-center px-3 py-1 text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-md cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            {subjectKey.split(" - ")[1]}
          </span>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="w-full max-w-4xl"
      >
        {/* Modal Header with badge + subject name */}
        <div className="flex items-center gap-4 mb-4">
          {/* Subject Code Badge */}
          <span className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow">
            {selectedSubject?.split(" - ")[0]}
          </span>

          {/* Subject Name + Class */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedSubject?.split(" - ")[1]} Syllabus
            </h2>
            {selectedClass && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedClass}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable syllabus content */}
        <div className="max-h-[60vh] overflow-y-auto space-y-2">
          {selectedSubject &&
            groupedBySubject[selectedSubject]?.map((topicItem, index) => (
              <div
                key={index}
                className="p-3 border-l-2 border-purple-300"
              >
                <p className="font-semibold text-gray-800">{topicItem.topic}</p>
                <p className="text-gray-600 text-sm">{topicItem.description}</p>
              </div>
            ))}
          {!groupedBySubject[selectedSubject]?.length && (
            <p className="text-gray-500">No topics available for this subject.</p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer hover:bg-gray-300 transition"
          >
            Close
          </button>

          {/* Download Syllabus PDF Button */}
          {selectedSubject && (
            <GeneratePDF
              filename={`${selectedSubject.split(" - ")[1]}_Syllabus.pdf`}
              title={`${selectedSubject.split(" - ")[1]} Syllabus`}
              renderButton={(toPDF) => (
                <button
                  onClick={toPDF}
                  className="px-5 py-2 cursor-pointer bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <TfiDownload /> Download
                </button>
              )}
            >

              <div>
                <p className="font-semibold mb-2">
                  Subject Code: {selectedSubject.split(" - ")[0]}
                </p>
                {selectedClass && (
                  <p className="font-semibold mb-2">{selectedClass}</p>
                )}
                {groupedBySubject[selectedSubject]?.length ? (
                  groupedBySubject[selectedSubject].map((item, index) => (
                    <div key={index} className="border-l-2 pl-3 py-1 mb-1">
                      <p className="font-semibold">{item.topic}</p>
                      <p className="text-sm">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No topics available for this subject.</p>
                )}
              </div>
            </GeneratePDF>
          )}
        </div>
      </Modal>

      {/* Syllabus grouped by subject */}
      <div>
        {selectedClass ? (
          filteredData.length > 0 ? (

            // SHOW SYLLABUS (your existing grouped UI)
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(groupedBySubject).map(([subjectKey, topics], index) => (
                <div
                  key={index}
                  className="p-4 shadow-lg rounded-md shadow bg-white"
                >
                  <h2 className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full">
                      {subjectKey.split(" - ")[0]}
                    </span>
                    <span className="text-lg font-semibold text-purple-900">
                      {subjectKey.split(" - ")[1]}
                    </span>
                  </h2>

                  {topics.map((t, idx) => (
                    <div key={idx} className="mb-2 pl-2 border-l-2 border-purple-300">
                      <p className="font-medium">{t.topic}</p>
                      <p className="text-gray-600 text-sm">{t.description}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

          ) : (

            // NO DATA MESSAGE
            <p className="text-gray-500 text-center mt-6 text-2xl">
              No syllabus available for {selectedClass}
            </p>

          )
        ) : (

          //BEFORE SELECTING CLASS
          <p className="text-gray-400 text-center mt-6">
            Please select a class
          </p>

        )}
      </div>

    </div>
  )
}

export default PrincipalSyllabusUpdate
