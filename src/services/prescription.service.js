import api from "./api";

export const createPrescription = async (prescriptionData) => {
  const response = await api.post(
    "/prescriptions",
    prescriptionData
  );

  return response.data;
};

export const getPrescriptions = async (params = {}) => {
  const response = await api.get("/prescriptions", {
    params,
  });

  return response.data;
};

export const getPrescription = async (id) => {
  const response = await api.get(`/prescriptions/${id}`);
  return response.data;
};

export const updatePrescription = async (
  id,
  prescriptionData
) => {
  const response = await api.put(
    `/prescriptions/${id}`,
    prescriptionData
  );

  return response.data;
};

export const cancelPrescription = async (id) => {
  const response = await api.patch(
    `/prescriptions/${id}/cancel`
  );

  return response.data;
};
export const getPrescriptionByConsultation = async (
  consultationId
) => {
  const response = await api.get(
    `/prescriptions/consultation/${consultationId}`
  );

  return response.data;
};