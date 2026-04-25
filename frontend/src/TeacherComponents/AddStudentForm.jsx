import { useFormik } from "formik";
import * as Yup from "yup";
import { FaUser, FaSchool, FaBook, FaPhone, FaUsers, FaHashtag } from 'react-icons/fa';
import { MdOutlineSave } from 'react-icons/md';
import { FaTimes } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import useStore from "../common/store/store";
import { useEffect } from "react";

const AddStudentForm = ({ isOpen, onClose, onSubmit }) => {
  let dise_code = useStore(state => state.dise_code);

  console.log("AddStudentForm rendered");
  const formik = useFormik({
    initialValues: {
      student_name: "",
      school_id: dise_code,
      class: "",
      age: "",
      gender: "",
      guardian_name: "",
      contact: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      student_name: Yup.string().required("Name is required"),
      school_id: Yup.number().required("School ID is required"),
      class: Yup.string().required("Class is required"),
      age: Yup.number()
        .required("Age is required")
        .min(3, "Too young")
        .max(25, "Invalid age"),
      gender: Yup.string().required("Gender is required"),
      guardian_name: Yup.string().required("Guardian name is required"),
      contact: Yup.string()
        .required("Contact is required")
        .matches(/^[0-9]{10}$/, "Must be 10 digits"),
    }),

    onSubmit: (values, { resetForm }) => {
      console.log("Form submitted", values)
      onSubmit(values);
      resetForm();
      onClose();
    },
  });

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
                value={formik.values.dise_code}
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
                value={formik.values.class}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700"
              />
            </div>
          </div>

          {/* Section: Personal Info */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FaUser className="text-blue-500" /> Full Name
            </label>
            <input
              name="student_name"
              placeholder="John Doe"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.student_name}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 transition-all outline-none text-slate-700 ${formik.touched.student_name && formik.errors.student_name
                ? "border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
            />
            {formik.touched.student_name && formik.errors.student_name && (
              <span className="text-red-500 text-[11px] font-semibold uppercase">{formik.errors.student_name}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FaHashtag className="text-blue-500" /> Age
              </label>
              <input
                name="age"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.age}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FaUsers className="text-blue-500" /> Gender
              </label>

              <div className="relative">
                <select
                  name="gender"
                  onChange={formik.handleChange}
                  value={formik.values.gender}
                  className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg 
                 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                 outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                {/* Dropdown Icon */}
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                  <RiArrowDropDownLine size={24} />
                </span>
              </div>
            </div>
          </div>

          {/* Section: Contact Info */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Guardian Name</label>
              <input
                name="guardian_name"
                placeholder="Parent/Guardian Name"
                onChange={formik.handleChange}
                value={formik.values.guardian_name}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FaPhone className="text-blue-500" /> Contact Number
              </label>
              <input
                name="contact"
                placeholder="+91 904 567 8900"
                onChange={formik.handleChange}
                value={formik.values.contact}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
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