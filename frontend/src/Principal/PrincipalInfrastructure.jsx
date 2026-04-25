import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaTint, FaRestroom, FaBolt, FaTree, FaUtensils, FaChalkboardTeacher, FaImage } from "react-icons/fa";
import { HiOutlineInformationCircle } from "react-icons/hi";
import useStore from "../common/store/store";
import UploadFacilityImages from "../UI/UploadFacilityImages";

// Refined Facility Card with Mini-Gallery Integration
function FacilityCard({ icon, title, status, images, name, onToggle, isActive, onAddImage }) {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col transition-all
    ${isActive ? "border-purple-500 ring-2 ring-purple-200 scale-[1.02]" : "border-slate-200"}
`}>            {/* HEADER */}
            <div className="p-5 flex items-center justify-between border-b border-slate-50">

                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${status ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {icon}
                    </div>

                    <div>
                        <p className="font-bold text-slate-800 leading-tight">{title}</p>
                        {isActive && (
                            <span className="ml-2 px-2 py-1 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-full animate-pulse">
                                Uploading Images...
                            </span>
                        )}
                        {/* STATUS TEXT */}
                        <p className={`text-[10px] font-black uppercase tracking-widest transition-all 
                            ${status ? "text-emerald-500" : "text-red-400"}`}>
                            {status ? "Operational" : "Action Required"}
                        </p>
                    </div>
                </div>

                {/* TOGGLE SWITCH */}
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={status}
                        disabled={isActive}
                        onChange={() => onToggle(name, status ? 0 : 1)}
                    />

                    {/* Track */}
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer 
                        peer-checked:bg-emerald-500 transition"></div>

                    {/* Knob */}
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full 
                        transition peer-checked:translate-x-5"></div>
                </label>

            </div>

            {/* IMAGE MODAL */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-5 right-5 text-white text-2xl hover:text-red-500"
                    >
                        ✕
                    </button>

                    <img
                        src={`http://localhost:5008/upload/${selectedImage}`}
                        className="max-w-[90%] max-h-[90%] rounded-lg"
                    />
                </div>
            )}

            <button
                onClick={() => onAddImage(name)}
                className="mt-3 w-full py-2 text-xs font-bold text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition"
            >
                + Add Images
            </button>

            {/* GALLERY */}
            <div className="p-4 bg-slate-50/50 flex-1">
                <div className="flex flex-wrap gap-2">
                    {images && images.length > 0 ? (
                        images.map((img, i) => (
                            <div
                                key={i}
                                className="h-14 w-14 rounded-lg overflow-hidden border shadow-sm hover:scale-110 transition cursor-zoom-in"
                            >
                                <img
                                    src={`http://localhost:5008/upload/${img}`}
                                    className="h-full w-full object-cover"
                                    onClick={() => setSelectedImage(img)}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-gray-400 italic">
                            No images
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function InfrastructureForm() {
    const dise_code = useStore((state) => state.dise_code);
    const [data, setData] = useState({ facilities: {} });
    const [pendingFacility, setPendingFacility] = useState(null);
    const uploadRef = useRef(null);

    const fetchFacilities = async (code) => {
        try {
            const res = await axios.get(`http://localhost:5008/api/school/facilities-with-images/${code}`);
            setData(res.data);
        } catch (err) {
            console.error("Error fetching facilities", err);
        }
    };

    useEffect(() => {
        if (dise_code) fetchFacilities(dise_code);
    }, [dise_code]);


    const updateFacility = async (field, value) => {
        // Update UI instantly (correct state)
        setData(prev => ({
            ...prev,
            facilities: {
                ...prev.facilities,
                [field]: {
                    ...prev.facilities[field],
                    available: value === 1
                }
            }
        }));

        try {
            await axios.patch(
                `http://localhost:5008/facilities/${dise_code}`,
                { [field]: value }
            );
        } catch (err) {
            console.error(err);

            // rollback if error
            fetchFacilities(dise_code);
        }
    };


    // Mapping icons to facility keys
    const getIcon = (key) => {
        const icons = {
            drinking_water: <FaTint />,
            toilet: <FaRestroom />,
            electricity: <FaBolt />,
            play_ground: <FaTree />,
            kitchen: <FaUtensils />,
            separate_classrooms: <FaChalkboardTeacher />,
        };
        return icons[key] || <HiOutlineInformationCircle />;
    };

    const handleToggle = async (field, value) => {
        const currentImages = data.facilities[field]?.images || [];

        // TURN ON
        if (value === 1) {
            // No image → force upload
            if (currentImages.length === 0) {
                setPendingFacility(field);
                return;
            }

            // Already has image
            updateFacility(field, 1);
            return;
        }

        // TURN OFF
        try {
            await axios.delete("http://localhost:5008/facility-images", {
                data: {
                    dise_code,
                    facility_type: field
                }
            });

            // update UI instantly
            setData(prev => ({
                ...prev,
                facilities: {
                    ...prev.facilities,
                    [field]: {
                        ...prev.facilities[field],
                        available: false,
                        images: []
                    }
                }
            }));

            await axios.patch(
                `http://localhost:5008/facilities/${dise_code}`,
                { [field]: 0 }
            );

        } catch (err) {
            console.error(err);
            fetchFacilities(dise_code);
        }
    };

    useEffect(() => {
        if (pendingFacility && uploadRef.current) {
            uploadRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [pendingFacility]);

    const handleAddImage = (facilityName) => {
        setPendingFacility(facilityName); // open upload UI for that facility
    };

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans">

            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-1 w-10 bg-purple-600 rounded-full" />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Infrastructure Audit</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Facility Management
                        </h1>
                    </div>
                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Current DISE Code</p>
                        <p className="text-sm font-black text-purple-600">{dise_code}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Management Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">

                        {/* THIS IS POINT */}
                        {pendingFacility && (
                            <div className="mb-4 p-4 rounded-2xl bg-purple-600 text-white">
                                <p className="text-xs">Uploading for</p>

                                <h2 className="text-lg font-bold">
                                    {pendingFacility.replace(/_/g, " ").toUpperCase()}
                                </h2>

                                <button
                                    onClick={() => setPendingFacility(null)}
                                    className="text-xs underline mt-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        <UploadFacilityImages
                            facilityType={pendingFacility}
                            onUploadSuccess={async () => {
    if (pendingFacility) {
        await fetchFacilities(dise_code);

        // Directly mark operational (no re-check needed)
        await updateFacility(pendingFacility, 1);

        setPendingFacility(null);
    }
}}
                        />
                    </div>
                </div>

                {/* RIGHT: Status Grid */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(data.facilities || {}).map(([name, value]) => (
                            <FacilityCard
                                key={name}
                                name={name}
                                title={name.replace(/_/g, " ").toUpperCase()}
                                status={value.available}
                                icon={getIcon(name)}
                                images={value.images}
                                onToggle={handleToggle}
                                isActive={pendingFacility === name}
                                onAddImage={(facility) => setPendingFacility(facility)}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {Object.keys(data.facilities || {}).length === 0 && (
                        <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-20 text-center">
                            <div className="text-slate-300 mb-4 flex justify-center"><HiOutlineInformationCircle size={48} /></div>
                            <h3 className="text-slate-500 font-bold">No facility data found</h3>
                            <p className="text-slate-400 text-sm">Upload your first image to start tracking infrastructure.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
