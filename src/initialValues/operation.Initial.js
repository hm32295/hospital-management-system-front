export const operationInitialValues = {
  patient: "",
  doctor: "",
  specialty: "",
  operationName: "",
  operationDate: new Date()
    .toISOString()
    .split("T")[0],
  cost: "",
  discount: 0,
  doctorFeeType: "none",
  doctorFeeValue: 0,
  notes: "",
};