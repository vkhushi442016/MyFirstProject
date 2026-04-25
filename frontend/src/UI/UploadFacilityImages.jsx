import { useState, useRef, useEffect } from "react";
import axios from "axios";
import useStore from "../common/store/store";
import { HiOutlineCloudUpload, HiXCircle, HiOutlinePhotograph } from "react-icons/hi";
import toast from "react-hot-toast";

export default function UploadFacilityImages({ facilityType, onUploadSuccess }) {
    const dise_code = useStore((state) => state.dise_code);
    //const [facility, setFacility] = useState("toilet");
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return alert("Please select images first");

        setIsUploading(true);
        const formData = new FormData();
        formData.append("dise_code", dise_code);
        formData.append("facility_type", facilityType);
        files.forEach(file => formData.append("images", file));

        try {
            await axios.post("http://localhost:5008/upload-facility-image", formData);
            toast.success("Uploaded successfully");
            setFiles([]); // Clear after success

            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">Facility Gallery Update</h2>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">DISE: {dise_code}</p>
            </div>

            <div className="p-6">
                {/* Facility Selection */}
                {/* <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Facility Category</label>
                    <select
                        value={facility}
                        onChange={(e) => setFacility(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    >
                        <option value="toilet">Toilet</option>
                        <option value="kitchen">Kitchen</option>
                        <option value="drinking_water">Drinking Water</option>
                        <option value="play_ground">Play Ground</option>
                        <option value="hm_room">HM Room</option>
                        <option value="separate_classrooms">Classrooms</option>
                        <option value="electricity">Electricity</option>
                    </select>
                </div> */}

                    {facilityType && (
    <div className="mb-4 text-center">
        <p className="text-xs text-slate-400 uppercase tracking-widest">
            Uploading for
        </p>
        <h3 className="text-lg font-bold text-purple-600">
            {facilityType.replace(/_/g, " ").toUpperCase()}
        </h3>
    </div>
)}

                {/* Dropzone Area */}
                <div
                    onClick={() => fileInputRef.current.click()}
                    className="group border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-purple-400 transition-all cursor-pointer mb-6"
                >
                    <input
                        type="file"
                        multiple
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    <div className="p-4 bg-white rounded-full shadow-sm text-purple-600 group-hover:scale-110 transition-transform">
                        <HiOutlineCloudUpload size={32} />
                    </div>
                    <p className="mt-4 text-sm font-bold text-slate-700">Click or drag to upload images</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP up to 5MB each</p>
                </div>

                {/* Image Previews */}
                {files.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {files.map((file, index) => (
                            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                    className="absolute top-1 right-1 text-red-500 bg-white rounded-full hover:scale-110 transition-transform"
                                >
                                    <HiXCircle size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Button */}
                <button
                    disabled={isUploading || files.length === 0}
                    onClick={handleUpload}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                        ${isUploading || files.length === 0
                            ? 'bg-slate-300 cursor-not-allowed shadow-none'
                            : 'bg-purple-600 hover:bg-purple-700 hover:shadow-purple-200 shadow-purple-100'
                        }`}
                >
                    {isUploading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <HiOutlinePhotograph size={20} />
                    )}
                    {isUploading ? "Uploading..." : `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`}
                </button>
            </div>
        </div>
    );
}
