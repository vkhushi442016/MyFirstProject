import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from 'react-hot-toast';
import { BiSolidEditAlt } from "react-icons/bi";

const UpdateStaffModal = ({ staff, onClose, refreshData }) => {
    const formik = useFormik({
        initialValues: {
            staff_id: staff?.staff_id || "",
            dise_code: staff?.dise_code || "",
            first_name: staff?.first_name || "",
            last_name: staff?.last_name || "",
            email: staff?.email || "",
            phone: staff?.phone || "",
            dob: staff?.dob ? staff.dob.split('T')[0] : "",
            gender: staff?.gender || "",
            role_id: staff?.role_id || "",
            qualification: staff?.qualification || "",
            experience: staff?.experience || "",
            joining_date: staff?.joining_date ? staff?.joining_date.split('T')[0] : "",
            salary: staff?.salary || "",
            status: staff?.status || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            first_name: Yup.string().required("Required"),
            last_name: Yup.string().required("Required"),
            email: Yup.string().email("Invalid email").required("Required"),
            phone: Yup.string().required("Required"),
            gender: Yup.string().required("Required"),
            role_id: Yup.string(),
            qualification: Yup.string().required("Required"),
            experience: Yup.number().required("Required"),
            joining_date: Yup.string().required("Required"),
            salary: Yup.number().required("Required"),
            dise_code: Yup.string().required("Required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            console.log("FORM SUBMITTED", values);
            try {
                console.log("Calling API...");
                const res = await axios.patch(
                    `http://localhost:5008/update/staff/${values.staff_id}`,
                    values
                );
                console.log("API SUCCESS RESPONSE:", res.data);
                toast.success("Staff updated successfully");
                resetForm();
                onClose();
                refreshData();
            } catch (error) {
                console.error("Update error:", error);
                toast.error(error.response?.data?.message || "Update failed");
            }
        },
    });

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5008/roles")
            .then(res => res.json())
            .then(data => setRoles(data))
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">

                    <div className="px-6 py-4">
                        <div className="flex">
                            <div className="mx-auto flex h-12 w-12 text-4xl text-white shrink-0 items-center justify-center rounded-md bg-amber-300 sm:mx-0 sm:h-14 sm:w-14">
                                <BiSolidEditAlt />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Update Staff</h3>
                                <p className="text-sm text-gray-500 mt-1">Modify the details of the selected staff member.</p>
                            </div>

                        </div>
                        <hr className="m-1" />
                        <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.first_name ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                    value={formik.values.first_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.first_name && formik.errors.first_name && (
                                    <div className="text-red-500 text-sm">{formik.errors.first_name}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.last_name ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                    value={formik.values.last_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.last_name && formik.errors.last_name && (
                                    <div className="text-red-500 text-sm">{formik.errors.last_name}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.email ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-red-500 text-sm">{formik.errors.email}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.phone ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Dise Code</label>
                                <input
                                    type="text"
                                    name="dise_code"
                                    className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.dise_code ? "bg-white"
                                        : "hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                    value={formik.values.dise_code}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Designation
                                </label>

                                <select
                                    name="role_id"
                                    value={formik.values.role_id}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.status ? "bg-white" : "hover:bg-blue-50 focus:bg-white"
                                        } focus:ring-2 focus:ring-blue-300`}
                                >
                                    <option value="">Select Designation</option>

                                    {roles.map(role => (
                                        <option key={role.role_id} value={role.role_id}>
                                            {role.rname.toUpperCase()}
                                        </option>
                                    ))}
                                </select>

                                {formik.errors.role_id && formik.touched.role_id && (
                                    <div className="text-red-500 text-sm">{formik.errors.role_id}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Gender</label>
                                <select
                                    name="gender"
                                    className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.gender ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                    value={formik.values.gender}
                                    onChange={formik.handleChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Qualification</label>
                                <input
                                    type="text"
                                    name="qualification"
                                    className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.qualification ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                    value={formik.values.qualification}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Experience</label>
                                <input
                                    type="number"
                                    name="experience"
                                    className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.experience ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                    value={formik.values.experience}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Joining Date</label>
                                <input
                                    type="date"
                                    name="joining_date"
                                    className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.joining_date ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                    value={formik.values.joining_date}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Salary</label>
                                <input
                                    type="number"
                                    name="salary"
                                    className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.salary ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                    value={formik.values.salary}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-span-2 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-400 text-white rounded hover:bg-amber-600"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateStaffModal;