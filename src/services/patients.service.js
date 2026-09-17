
import api from "./api";

export const getPatients = async (params = {}) => {
  const response = await api.get("/patients",{params});

  return response.data;
};

export const getSinglePatient = async (id) => {
    const response = await api.get(
      `/patients/${id}`
    );

    return response.data;
  };

export const getPatientDetails =async (id) => {
  const response = await api.get(`/patients/${id}/details`);
  return response.data;
};

export const createPatient =async (patientData) => {
  const response = await api.post("/patients", patientData);
  return response.data;
};

export const updatePatient =async (id, patientData) => {
    const response = await api.put(`/patients/${id}`,patientData);
    return response.data;
};

export const deactivatePatient =async (id) => {
    const response = await api.patch(
      `/patients/${id}/deactivate`
    );

    return response.data;
};