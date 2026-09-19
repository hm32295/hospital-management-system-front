
// import { useEffect, useState } from "react";
// import { useSnackbar } from "notistack";
// import {
//   Edit,
//   Trash2,
//   Plus,
//   Search,
//   X,
//   Wallet,
//   CreditCard,
//   ArrowLeft,
//   CircleDollarSign,
// } from "lucide-react";

// import {
//   createDoctor,
//   getDoctors,
//   updateDoctor,
//   deactivateDoctor,
// } from "../../services/doctor.service";

// import {
//   getDoctorAccount,
//   createDoctorSettlement,
// } from "../../services/doctorSettlements.service";

// import { getSpecialties } from "../../services/specialty.service";
// import FormSearchSelect from "../../components/form/FormSearchSelect";

// const Doctors = () => {
//   const { enqueueSnackbar } = useSnackbar();

//   const [doctors, setDoctors] = useState([]);
//   const [specialtyOptions, setSpecialtyOptions] = useState([]);

//   const [search, setSearch] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [specialtyLoading, setSpecialtyLoading] =
//     useState(false);

//   const [showForm, setShowForm] = useState(false);
//   const [editingDoctor, setEditingDoctor] =
//     useState(null);

//   const [selectedDoctor, setSelectedDoctor] =
//     useState(null);

//   const [doctorAccount, setDoctorAccount] =
//     useState(null);

//   const [accountLoading, setAccountLoading] =
//     useState(false);

//   const [showPaymentForm, setShowPaymentForm] =
//     useState(false);

//   const [paymentAmount, setPaymentAmount] =
//     useState("");

//   const [paymentNotes, setPaymentNotes] =
//     useState("");

//   const [paymentSubmitting, setPaymentSubmitting] =
//     useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     specialties: [],
//     phone: "",
//     email: "",
//   });

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);

//       const response = await getDoctors({
//         search,
//         page: 1,
//         limit: 10,
//       });

//       setDoctors(response.doctors || []);
//     } catch (error) {
//       enqueueSnackbar(
//         error.response?.data?.message ||
//           "Failed to load doctors",
//         {
//           variant: "error",
//         }
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchDoctors();
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [search]);

//   const fetchSpecialties = async (searchValue) => {
//     try {
//       setSpecialtyLoading(true);

//       const response = await getSpecialties({
//         search: searchValue,
//         page: 1,
//         limit: 10,
//       });

//       const newOptions = (
//         response.specialties || []
//       ).map((specialty) => ({
//         value: specialty._id,
//         label: specialty.name,
//       }));

//       setSpecialtyOptions((prev) => {
//         const merged = [...prev];

//         newOptions.forEach((option) => {
//           const exists = merged.some(
//             (item) =>
//               String(item.value) ===
//               String(option.value)
//           );

//           if (!exists) {
//             merged.push(option);
//           }
//         });

//         return merged;
//       });
//     } catch (error) {
//       enqueueSnackbar(
//         error.response?.data?.message ||
//           "Failed to search specialties",
//         {
//           variant: "error",
//         }
//       );
//     } finally {
//       setSpecialtyLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       specialties: [],
//       phone: "",
//       email: "",
//     });

//     setEditingDoctor(null);
//     setSpecialtyOptions([]);
//     setShowForm(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name.trim()) {
//       enqueueSnackbar("Doctor name is required", {
//         variant: "error",
//       });

//       return;
//     }

//     if (
//       !Array.isArray(formData.specialties) ||
//       formData.specialties.length === 0
//     ) {
//       enqueueSnackbar(
//         "At least one specialty is required",
//         {
//           variant: "error",
//         }
//       );

//       return;
//     }

//     try {
//       setSubmitting(true);

//       const doctorData = {
//         name: formData.name.trim(),
//         specialties: formData.specialties,
//         phone: formData.phone.trim() || null,
//         email: formData.email.trim() || null,
//       };

//       let response;

//       if (editingDoctor) {
//         response = await updateDoctor(
//           editingDoctor._id,
//           doctorData
//         );
//       } else {
//         response = await createDoctor(doctorData);
//       }

//       if (!response.success) {
//         throw new Error(
//           response.message || "Operation failed"
//         );
//       }

//       enqueueSnackbar(
//         editingDoctor
//           ? "Doctor updated successfully"
//           : "Doctor created successfully",
//         {
//           variant: "success",
//         }
//       );

//       resetForm();
//       fetchDoctors();
//     } catch (error) {
//       enqueueSnackbar(
//         error.response?.data?.message ||
//           error.message ||
//           "Operation failed",
//         {
//           variant: "error",
//         }
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEdit = (doctor) => {
//     const selectedSpecialties = (
//       doctor.specialties || []
//     ).map((specialty) => ({
//       value: specialty._id,
//       label: specialty.name,
//     }));

//     setFormData({
//       name: doctor.name || "",
//       specialties: selectedSpecialties.map(
//         (specialty) => specialty.value
//       ),
//       phone: doctor.phone || "",
//       email: doctor.email || "",
//     });

//     setSpecialtyOptions((prev) => {
//       const merged = [...prev];

//       selectedSpecialties.forEach((specialty) => {
//         const exists = merged.some(
//           (option) =>
//             String(option.value) ===
//             String(specialty.value)
//         );

//         if (!exists) {
//           merged.push(specialty);
//         }
//       });

//       return merged;
//     });

//     setEditingDoctor(doctor);
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to deactivate this doctor?"
//     );

//     if (!confirmed) return;

//     try {
//       setLoading(true);

//       const response = await deactivateDoctor(id);

//       if (!response.success) {
//         throw new Error(
//           response.message ||
//             "Failed to deactivate doctor"
//         );
//       }

//       enqueueSnackbar(
//         "Doctor deactivated successfully",
//         {
//           variant: "success",
//         }
//       );

//       fetchDoctors();
//     } catch (error) {
//       enqueueSnackbar(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to deactivate doctor",
//         {
//           variant: "error",
//         }
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenAccount = async (doctor) => {
//     try {
//       setSelectedDoctor(doctor);
//       setDoctorAccount(null);
//       setShowPaymentForm(false);
//       setPaymentAmount("");
//       setPaymentNotes("");
//       setAccountLoading(true);
//     } catch (error) {
//       enqueueSnackbar(
//         "Failed to open doctor account",
//         {
//           variant: "error",
//         }
//       );
//     }
//   };

//   useEffect(() => {
//     if (!selectedDoctor?._id) return;

//     const loadDoctorAccount = async () => {
//       try {
//         setAccountLoading(true);

//         const response = await getDoctorAccount(
//           selectedDoctor._id
//         );

//         if (!response.success) {
//           throw new Error(
//             response.message ||
//               "Failed to load doctor account"
//           );
//         }

//         setDoctorAccount(response);
//       } catch (error) {
//         enqueueSnackbar(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to load doctor account",
//           {
//             variant: "error",
//           }
//         );
//       } finally {
//         setAccountLoading(false);
//       }
//     };

//     loadDoctorAccount();
//   }, [selectedDoctor]);

//   const closeAccount = () => {
//     setSelectedDoctor(null);
//     setDoctorAccount(null);
//     setShowPaymentForm(false);
//     setPaymentAmount("");
//     setPaymentNotes("");
//   };

//   const handleDoctorPayment = async (e) => {
//     e.preventDefault();

//     const amount = Number(paymentAmount || 0);
//     const due = Number(
//       doctorAccount?.summary?.due || 0
//     );

//     if (!amount || amount <= 0) {
//       enqueueSnackbar(
//         "Payment amount must be greater than zero",
//         {
//           variant: "error",
//         }
//       );

//       return;
//     }

//     if (amount > due) {
//       enqueueSnackbar(
//         `Payment cannot exceed ${due.toFixed(
//           2
//         )} EGP`,
//         {
//           variant: "error",
//         }
//       );

//       return;
//     }

//     try {
//       setPaymentSubmitting(true);

//       const response =
//         await createDoctorSettlement({
//           doctor: selectedDoctor._id,
//           amount,
//           notes: paymentNotes.trim(),
//         });

//       if (!response.success) {
//         throw new Error(
//           response.message ||
//             "Failed to pay doctor"
//         );
//       }

//       enqueueSnackbar(
//         response.message ||
//           "Doctor paid successfully",
//         {
//           variant: "success",
//         }
//       );

//       setPaymentAmount("");
//       setPaymentNotes("");
//       setShowPaymentForm(false);

//       const accountResponse =
//         await getDoctorAccount(
//           selectedDoctor._id
//         );

//       setDoctorAccount(accountResponse);
//     } catch (error) {
//       enqueueSnackbar(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to pay doctor",
//         {
//           variant: "error",
//         }
//       );
//     } finally {
//       setPaymentSubmitting(false);
//     }
//   };

//   const formatMoney = (value) =>
//     Number(value || 0).toLocaleString(
//       "en-EG",
//       {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }
//     );

//   return (
//     <div className="container-fluid py-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h3 className="mb-1">Doctors</h3>

//           <p className="text-muted mb-0">
//             Manage doctors
//           </p>
//         </div>

//         <button
//           type="button"
//           className="btn btn-primary d-flex align-items-center gap-2"
//           onClick={() => {
//             setEditingDoctor(null);

//             setFormData({
//               name: "",
//               specialties: [],
//               phone: "",
//               email: "",
//             });

//             setSpecialtyOptions([]);
//             setShowForm(true);
//           }}
//         >
//           <Plus size={18} />
//           Add Doctor
//         </button>
//       </div>

//       {selectedDoctor && (
//         <div className="card border-0 shadow-sm mb-4">
//           <div className="card-header bg-white d-flex justify-content-between align-items-center">
//             <div>
//               <button
//                 type="button"
//                 className="btn btn-light btn-sm mb-2"
//                 onClick={closeAccount}
//               >
//                 <ArrowLeft
//                   size={16}
//                   className="me-1"
//                 />
//                 Back
//               </button>

//               <h5 className="mb-1">
//                 {selectedDoctor.name}
//               </h5>

//               <small className="text-muted">
//                 Doctor Account
//               </small>
//             </div>

//             <button
//               type="button"
//               className="btn btn-light"
//               onClick={closeAccount}
//             >
//               <X size={18} />
//             </button>
//           </div>

//           <div className="card-body">
//             {accountLoading ? (
//               <div className="text-center py-5">
//                 <div
//                   className="spinner-border"
//                   role="status"
//                 />
//               </div>
//             ) : !doctorAccount ? (
//               <div className="alert alert-danger">
//                 Failed to load doctor account.
//               </div>
//             ) : (
//               <>
//                 <div className="row g-3 mb-4">
//                   <div className="col-md-4">
//                     <div className="card h-100 border">
//                       <div className="card-body">
//                         <div className="d-flex justify-content-between align-items-center">
//                           <div>
//                             <small className="text-muted">
//                               Total Earned
//                             </small>

//                             <h4 className="mb-0 mt-2">
//                               {formatMoney(
//                                 doctorAccount
//                                   .summary
//                                   ?.totalEarned
//                               )}{" "}
//                               EGP
//                             </h4>
//                           </div>

//                           <CircleDollarSign
//                             size={30}
//                             className="text-primary"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="col-md-4">
//                     <div className="card h-100 border">
//                       <div className="card-body">
//                         <div className="d-flex justify-content-between align-items-center">
//                           <div>
//                             <small className="text-muted">
//                               Total Paid
//                             </small>

//                             <h4 className="mb-0 mt-2 text-success">
//                               {formatMoney(
//                                 doctorAccount
//                                   .summary
//                                   ?.totalPaid
//                               )}{" "}
//                               EGP
//                             </h4>
//                           </div>

//                           <CreditCard
//                             size={30}
//                             className="text-success"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="col-md-4">
//                     <div className="card h-100 border">
//                       <div className="card-body">
//                         <div className="d-flex justify-content-between align-items-center">
//                           <div>
//                             <small className="text-muted">
//                               Due
//                             </small>

//                             <h4 className="mb-0 mt-2 text-danger">
//                               {formatMoney(
//                                 doctorAccount
//                                   .summary?.due
//                               )}{" "}
//                               EGP
//                             </h4>
//                           </div>

//                           <Wallet
//                             size={30}
//                             className="text-danger"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {doctorAccount.summary?.due >
//                   0 && (
//                   <div className="d-flex justify-content-end mb-4">
//                     <button
//                       type="button"
//                       className="btn btn-success d-flex align-items-center gap-2"
//                       onClick={() =>
//                         setShowPaymentForm(
//                           (prev) => !prev
//                         )
//                       }
//                     >
//                       <CreditCard size={18} />
//                       Pay Doctor
//                     </button>
//                   </div>
//                 )}

//                 {showPaymentForm && (
//                   <div className="card border-success mb-4">
//                     <div className="card-header bg-success-subtle">
//                       <h6 className="mb-0">
//                         Pay Doctor
//                       </h6>
//                     </div>

//                     <div className="card-body">
//                       <form
//                         onSubmit={
//                           handleDoctorPayment
//                         }
//                       >
//                         <div className="row g-3">
//                           <div className="col-md-6">
//                             <label className="form-label">
//                               Amount
//                             </label>

//                             <input
//                               type="number"
//                               className="form-control"
//                               min="0.01"
//                               max={
//                                 doctorAccount
//                                   .summary
//                                   ?.due
//                               }
//                               step="0.01"
//                               value={
//                                 paymentAmount
//                               }
//                               onChange={(e) =>
//                                 setPaymentAmount(
//                                   e.target.value
//                                 )
//                               }
//                               disabled={
//                                 paymentSubmitting
//                               }
//                             />

//                             <small className="text-muted">
//                               Maximum due:{" "}
//                               {formatMoney(
//                                 doctorAccount
//                                   .summary
//                                   ?.due
//                               )}{" "}
//                               EGP
//                             </small>
//                           </div>

//                           <div className="col-md-6">
//                             <label className="form-label">
//                               Notes
//                             </label>

//                             <input
//                               type="text"
//                               className="form-control"
//                               value={
//                                 paymentNotes
//                               }
//                               onChange={(e) =>
//                                 setPaymentNotes(
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Payment notes..."
//                               disabled={
//                                 paymentSubmitting
//                               }
//                             />
//                           </div>

//                           <div className="col-12 d-flex gap-2">
//                             <button
//                               type="submit"
//                               className="btn btn-success"
//                               disabled={
//                                 paymentSubmitting
//                               }
//                             >
//                               {paymentSubmitting ? (
//                                 <>
//                                   <span
//                                     className="spinner-border spinner-border-sm me-2"
//                                     role="status"
//                                   />
//                                   Processing...
//                                 </>
//                               ) : (
//                                 "Confirm Payment"
//                               )}
//                             </button>

//                             <button
//                               type="button"
//                               className="btn btn-secondary"
//                               onClick={() => {
//                                 setShowPaymentForm(
//                                   false
//                                 );
//                                 setPaymentAmount(
//                                   ""
//                                 );
//                                 setPaymentNotes(
//                                   ""
//                                 );
//                               }}
//                               disabled={
//                                 paymentSubmitting
//                               }
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   </div>
//                 )}

//                 <div className="card border mb-4">
//                   <div className="card-header">
//                     <h5 className="mb-0">
//                       Operations
//                     </h5>
//                   </div>

//                   <div className="card-body p-0">
//                     {doctorAccount.operations
//                       ?.length === 0 ? (
//                       <div className="text-center text-muted py-4">
//                         No operations found
//                       </div>
//                     ) : (
//                       <div className="table-responsive">
//                         <table className="table align-middle mb-0">
//                           <thead>
//                             <tr>
//                               <th>
//                                 Operation
//                               </th>
//                               <th>
//                                 Patient
//                               </th>
//                               <th>
//                                 Doctor Fee
//                               </th>
//                               <th>
//                                 Paid
//                               </th>
//                               <th>
//                                 Due
//                               </th>
//                               <th>
//                                 Status
//                               </th>
//                             </tr>
//                           </thead>

//                           <tbody>
//                             {doctorAccount.operations.map(
//                               (item) => (
//                                 <tr
//                                   key={
//                                     item.operation
//                                       ?._id
//                                   }
//                                 >
//                                   <td>
//                                     <div className="fw-semibold">
//                                       {
//                                         item
//                                           .operation
//                                           ?.operationName
//                                       }
//                                     </div>

//                                     <small className="text-muted">
//                                       {item
//                                         .operation
//                                         ?.operationDate
//                                         ? new Date(
//                                             item
//                                               .operation
//                                               .operationDate
//                                           ).toLocaleDateString(
//                                             "en-EG"
//                                           )
//                                         : "-"}
//                                     </small>
//                                   </td>

//                                   <td>
//                                     {item.operation
//                                       ?.patient
//                                       ?.name ||
//                                       "-"}
//                                   </td>

//                                   <td>
//                                     {formatMoney(
//                                       item.doctorFeeAmount
//                                     )}{" "}
//                                     EGP
//                                   </td>

//                                   <td className="text-success">
//                                     {formatMoney(
//                                       item.paidAmount
//                                     )}{" "}
//                                     EGP
//                                   </td>

//                                   <td className="text-danger">
//                                     {formatMoney(
//                                       item.remainingAmount
//                                     )}{" "}
//                                     EGP
//                                   </td>

//                                   <td>
//                                     {item.paymentStatus ===
//                                       "paid" && (
//                                       <span className="badge bg-success">
//                                         Paid
//                                       </span>
//                                     )}

//                                     {item.paymentStatus ===
//                                       "partial" && (
//                                       <span className="badge bg-warning text-dark">
//                                         Partial
//                                       </span>
//                                     )}

//                                     {item.paymentStatus ===
//                                       "unpaid" && (
//                                       <span className="badge bg-danger">
//                                         Unpaid
//                                       </span>
//                                     )}
//                                   </td>
//                                 </tr>
//                               )
//                             )}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="card border">
//                   <div className="card-header">
//                     <h5 className="mb-0">
//                       Settlement History
//                     </h5>
//                   </div>

//                   <div className="card-body p-0">
//                     {doctorAccount.settlements
//                       ?.length === 0 ? (
//                       <div className="text-center text-muted py-4">
//                         No settlements found
//                       </div>
//                     ) : (
//                       <div className="table-responsive">
//                         <table className="table align-middle mb-0">
//                           <thead>
//                             <tr>
//                               <th>Date</th>
//                               <th>
//                                 Amount
//                               </th>
//                               <th>
//                                 Operation
//                               </th>
//                               <th>
//                                 Patient
//                               </th>
//                               <th>
//                                 Paid By
//                               </th>
//                               <th>
//                                 Notes
//                               </th>
//                             </tr>
//                           </thead>

//                           <tbody>
//                             {doctorAccount.settlements.map(
//                               (settlement) => (
//                                 <tr
//                                   key={
//                                     settlement._id
//                                   }
//                                 >
//                                   <td>
//                                     {settlement.createdAt
//                                       ? new Date(
//                                           settlement.createdAt
//                                         ).toLocaleString(
//                                           "en-EG"
//                                         )
//                                       : "-"}
//                                   </td>

//                                   <td className="fw-semibold text-success">
//                                     {formatMoney(
//                                       settlement.amount
//                                     )}{" "}
//                                     EGP
//                                   </td>

//                                   <td>
//                                     {settlement
//                                       .operation
//                                       ?.operationName ||
//                                       "General Settlement"}
//                                   </td>

//                                   <td>
//                                     {settlement
//                                       .patient
//                                       ?.name ||
//                                       "-"}
//                                   </td>

//                                   <td>
//                                     {settlement
//                                       .paidBy
//                                       ?.name ||
//                                       "-"}
//                                   </td>

//                                   <td>
//                                     {settlement.notes ||
//                                       "-"}
//                                   </td>
//                                 </tr>
//                               )
//                             )}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {showForm && (
//         <div className="card border-0 shadow-sm mb-4">
//           <div className="card-body p-4">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="mb-0">
//                 {editingDoctor
//                   ? "Edit Doctor"
//                   : "Add Doctor"}
//               </h5>

//               <button
//                 type="button"
//                 className="btn btn-light"
//                 onClick={resetForm}
//                 disabled={submitting}
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Doctor Name
//                     <span className="text-danger ms-1">
//                       *
//                     </span>
//                   </label>

//                   <input
//                     type="text"
//                     name="name"
//                     className="form-control"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Dr. Ahmed Mohamed"
//                     disabled={submitting}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <FormSearchSelect
//                     label="Specialties"
//                     name="specialties"
//                     value={formData.specialties}
//                     options={specialtyOptions}
//                     serverSearch
//                     onSearch={fetchSpecialties}
//                     loading={specialtyLoading}
//                     minSearchLength={2}
//                     debounceDelay={400}
//                     required
//                     isMulti
//                     onChange={(values) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         specialties: values || [],
//                       }))
//                     }
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Phone
//                   </label>

//                   <input
//                     type="text"
//                     name="phone"
//                     className="form-control"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="01xxxxxxxxx"
//                     disabled={submitting}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Email
//                   </label>

//                   <input
//                     type="email"
//                     name="email"
//                     className="form-control"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="doctor@example.com"
//                     disabled={submitting}
//                   />
//                 </div>
//               </div>

//               <div className="d-flex gap-2">
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={submitting}
//                 >
//                   {submitting
//                     ? "Saving..."
//                     : editingDoctor
//                     ? "Update Doctor"
//                     : "Create Doctor"}
//                 </button>

//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={resetForm}
//                   disabled={submitting}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="card border-0 shadow-sm">
//         <div className="card-body p-4">
//           <div className="row mb-4">
//             <div className="col-md-5">
//               <div className="input-group">
//                 <span className="input-group-text">
//                   <Search size={18} />
//                 </span>

//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search doctors..."
//                   value={search}
//                   onChange={(e) =>
//                     setSearch(e.target.value)
//                   }
//                 />
//               </div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="text-center py-5">
//               Loading...
//             </div>
//           ) : doctors.length === 0 ? (
//             <div className="text-center text-muted py-5">
//               No doctors found
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table align-middle">
//                 <thead>
//                   <tr>
//                     <th>Doctor</th>
//                     <th>Specialties</th>
//                     <th>Phone</th>
//                     <th>earned</th>
//                     <th>paid</th>
//                     <th>due</th>
//                     <th className="text-end">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {doctors.map((doctor) => (
//                     <tr key={doctor._id}>
//                       <td className="fw-semibold">
//                         {doctor.name}
//                       </td>

//                       <td>
//                         {doctor.specialties?.length ? (
//                           <div className="d-flex flex-wrap gap-1">
//                             {doctor.specialties.map(
//                               (specialty) => (
//                                 <span
//                                   key={
//                                     specialty._id
//                                   }
//                                   className="badge text-bg-light border"
//                                 >
//                                   {specialty.name}
//                                 </span>
//                               )
//                             )}
//                           </div>
//                         ) : (
//                           "-"
//                         )}
//                       </td>

//                       <td>
//                         {doctor.phone || "-"}
//                       </td>

//                       <td>
//                         {doctor.account.earned || "-"}
//                       </td>
//                       <td>
//                         {doctor.account.paid || "-"}
//                       </td>
//                       <td>
//                         {doctor.account.due || "-"}
//                       </td>

//                       <td className="text-end">
//                         <div className="d-flex justify-content-end gap-2">
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline-success"
//                             onClick={() =>
//                               handleOpenAccount(
//                                 doctor
//                               )
//                             }
//                             disabled={submitting}
//                             title="Doctor Account"
//                           >
//                             <Wallet
//                               size={16}
//                             />
//                           </button>

//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline-primary"
//                             onClick={() =>
//                               handleEdit(doctor)
//                             }
//                             disabled={submitting}
//                           >
//                             <Edit size={16} />
//                           </button>

//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline-danger"
//                             onClick={() =>
//                               handleDelete(
//                                 doctor._id
//                               )
//                             }
//                             disabled={submitting}
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Doctors;


import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Wallet } from "lucide-react";

import {
  getDoctors,
  deactivateDoctor,
} from "../../services/doctor.service";
import AdminDataPage from "../../components/table/AdminDataPage";

const Doctors = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await getDoctors({
        search: search.trim(),
        page,
        limit: 10,
      });

      setDoctors(response.doctors || []);

      setPagination(
        response.pagination || {
          page,
          limit: 10,
          total: 0,
          pages: 0,
        }
      );
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "Failed to load doctors",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, page]);

  const handleFilter = (name, value) => {
    if (name === "search") {
      setSearch(value || "");
      setPage(1);
    }
  };

  const handleDelete = async (doctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${doctor.name}?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await deactivateDoctor(
        doctor._id
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to deactivate doctor"
        );
      }

      enqueueSnackbar(
        "Doctor deactivated successfully",
        {
          variant: "success",
        }
      );

      if (
        doctors.length === 1 &&
        page > 1
      ) {
        setPage((prev) => prev - 1);
      } else {
        await fetchDoctors();
      }
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to deactivate doctor",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(
      "en-EG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  const columns = [
    {
      key: "name",
      label: "Doctor",
      render: (doctor) => (
        <span className="fw-semibold">
          {doctor.name || "-"}
        </span>
      ),
    },
    {
      key: "specialties",
      label: "Specialties",
      render: (doctor) =>
        doctor.specialties?.length ? (
          <div className="d-flex flex-wrap gap-1 justify-content-center">
            {doctor.specialties.map(
              (specialty) => (
                <span
                  key={specialty._id}
                  className="badge text-bg-light border"
                >
                  {specialty.name}
                </span>
              )
            )}
          </div>
        ) : (
          "-"
        ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (doctor) =>
        doctor.phone || "-",
    },
    {
      key: "earned",
      label: "Earned",
      render: (doctor) => (
        <span>
          {formatMoney(
            doctor.account?.earned
          )}{" "}
          EGP
        </span>
      ),
    },
    {
      key: "paid",
      label: "Paid",
      render: (doctor) => (
        <span className="text-success fw-semibold">
          {formatMoney(
            doctor.account?.paid
          )}{" "}
          EGP
        </span>
      ),
    },
    {
      key: "due",
      label: "Due",
      render: (doctor) => (
        <span className="text-danger fw-semibold">
          {formatMoney(
            doctor.account?.due
          )}{" "}
          EGP
        </span>
      ),
    },
  ];

  const filters = [
    {
      name: "search",
      label: "Search Doctors",
      type: "text",
      placeholder:
        "Search by name, phone or email...",
      value: search,
      col: "col-12 col-md-6 col-lg-4",
    },
  ];

  const actions = [
    {
      type: "show",
      label: "Doctor Account",
      link: (doctor) =>
        `/doctors/${doctor._id}`,
    },
    {
      type: "edit",
      label: "Edit Doctor",
      link: (doctor) =>
        `/doctors/edit/${doctor._id}`,
    },
    {
      type: "delete",
      label: "Deactivate Doctor",
      onClick: handleDelete,
    },
  ];

  return (
    <AdminDataPage
      title="Doctors"
      subtitle="Manage doctors and doctor accounts"
      type="Add"
      addLink="/doctors/add"
      loading={loading}
      data={doctors}
      columns={columns}
      filters={filters}
      onFilter={handleFilter}
      filtering={fetchDoctors}
      actions={actions}
      pagination={pagination}
      onPageChange={setPage}
      emptyMessage="No doctors found"
    />
  );
};

export default Doctors;
