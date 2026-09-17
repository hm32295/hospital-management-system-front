import api from "./api";

export const createConsultation = async (consultationData) => {
  const response = await api.post("/consultations", consultationData);
  return response.data;
};

export const getConsultationByVisit = async (visitId) => {
  const response = await api.get(`/consultations/visit/${visitId}`);
  return response.data;
};

export const updateConsultation = async (
  consultationId,
  consultationData
) => {
  const response = await api.put(
    `/consultations/${consultationId}`,
    consultationData
  );

  return response.data;
};



export const completeConsultation = async (consultationData) => {
    const response = await api.post(
      "/consultations/complete",
      consultationData
    );

    return response.data;
  };