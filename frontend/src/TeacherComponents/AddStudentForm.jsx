import { useFormik } from "formik";
import * as Yup from "yup";
import { FaUser, FaSchool, FaBook, FaPhone, FaUsers, FaHashtag } from 'react-icons/fa';
import { MdOutlineSave } from 'react-icons/md';
import { FaTimes } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import useStore from "../common/store/store";
import { useEffect } from "react";
import { FaEnvelope } from "react-icons/fa";

const AddStudentForm = ({ isOpen, onClose, onSubmit }) => {
  let dise_code = useStore(state => state.dise_code);
  console.log("AddStudentForm rendered");

  const formik = useFormik({
    initialValues: {
      student_name: "",
      school_id: dise_code,
      class: "",
      ag_e: "",      // This is now your Date of Birth field
      age: "",       // This is now your Numeric Age field
      gender: "",
      father_name: "",
      mother_name: "",
      email: "",
      contact: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      student_name: Yup.string().required("Name is required"),
      class: Yup.string().required("Class is required"),
      ag_e: Yup.date().required("Date of Birth is required"), // Validation for DOB
      age: Yup.number()
        .required("Age is required")
        .min(3, "Too young")
        .max(25, "Invalid age"),
      gender: Yup.string().required("Gender is required"),
      father_name: Yup.string().required("Father's name is required"),
      mother_name: Yup.string().required("Mother's name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      contact: Yup.string()
        .required("Contact is required")
        .matches(/^[0-9]{10}$/, "Must be 10 digits"),
    }),
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
      onClose();
    },
  });

  // Updated handler: sets ag_e as Date, calculates age as Number
  const handleDobChange = (e) => {
    const dobValue = e.target.value;
    const birthDate = new Date(dobValue);
    const today = new Date();

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    formik.setFieldValue("ag_e", dobValue); // Bind date to ag_e
    formik.setFieldValue("age", calculatedAge > 0 ? calculatedAge : ""); // Bind number to age
  };



  useEffect(() => {
    if (dise_code) {
      formik.setFieldValue("dise_code", dise_code);
    }
  }, [dise_code]);

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white shadow-2xl p-6 rounded-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <div className="mb-8 border-b border-gray-50 pb-6">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Student Enrollment</h2>
          <p className="text-slate-500 mt-1">Complete the information below to register a new student.</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">

          {/* Section: Academic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FaSchool className="text-blue-500" /> School ID
              </label>
              <input
                readOnly
                name="school_id"
                value={formik.values.school_id}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FaBook className="text-blue-500" /> Class/Grade
              </label>
              <input
                name="class"
                placeholder="e.g. 10"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.class}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 transition-all outline-none text-slate-700 ${formik.touched.class && formik.errors.class ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-500/20"}`}
              />
              {formik.touched.class && formik.errors.class && (
                <span className="text-red-500 text-[11px] font-semibold uppercase">{formik.errors.class}</span>
              )}
            </div>
          </div>

          {/* SECTION: PERSONAL INFORMATION */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <div className="h-px w-8 bg-blue-600"></div> Personal Information
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <FaUser className="text-blue-500" /> Student Full Name
              </label>
              <input
                name="student_name"
                placeholder="e.g. Rahul Sharma"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.student_name}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${formik.touched.student_name && formik.errors.student_name ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Date of Birth Input (Bound to ag_e) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                <input
                  type="date"
                  name="ag_e"
                  onChange={handleDobChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.ag_e}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 ${formik.touched.ag_e && formik.errors.ag_e ? "border-red-400" : "border-slate-200 focus:ring-blue-500/20"
                    }`}
                />
              </div>

              {/* Numeric Age Input (Bound to age) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Calculated Age</label>
                <input
                  readOnly
                  name="age"
                  placeholder="Auto-calculated"
                  value={formik.values.age}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-bold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
                <select
                  name="gender"
                  onChange={formik.handleChange}
                  value={formik.values.gender}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Parents Info */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Father's Name</label>
              <input
                name="father_name"
                placeholder="Father's Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.father_name}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 transition-all outline-none ${formik.touched.father_name && formik.errors.father_name ? "border-red-400" : "border-slate-200"}`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mother's Name</label>
              <input
                name="mother_name"
                placeholder="Mother's Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mother_name}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 transition-all outline-none ${formik.touched.mother_name && formik.errors.mother_name ? "border-red-400" : "border-slate-200"}`}
              />
            </div>
          </div>

          {/* New Email & Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FaEnvelope className="text-blue-500" /> Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="student@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 transition-all outline-none ${formik.touched.email && formik.errors.email ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-500/20"}`}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-500 text-[11px] font-semibold uppercase">{formik.errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FaPhone className="text-blue-500" /> Contact Number
              </label>
              <input
                name="contact"
                placeholder="10-digit mobile number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.contact}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 transition-all outline-none ${formik.touched.contact && formik.errors.contact ? "border-red-400" : "border-slate-200"}`}
              />
              {formik.touched.contact && formik.errors.contact && (
                <span className="text-red-500 text-[11px] font-semibold uppercase">{formik.errors.contact}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4"
          >
            <MdOutlineSave size={20} />
            Register Student
          </button>
        </form>
      </div>
    </div>

  );
};

export default AddStudentForm;