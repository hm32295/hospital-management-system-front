import api from "./api";

export const createDoctorSettlement = async (settlementData) => {
  const response = await api.post(
    "/doctor-settlements",
    settlementData
  );

  return response.data;
};

export const getOperationSettlements = async (operationId) => {
  const response = await api.get(
    `/doctor-settlements/operation/${operationId}`
  );

  return response.data;
};

export const getDoctorSettlements = async (doctorId) => {
  const response = await api.get(
    `/doctor-settlements/doctor/${doctorId}`
  );

  return response.data;
};

export const getDoctorSettlement = async (id) => {
  const response = await api.get(
    `/doctor-settlements/${id}`
  );

  return response.data;
};

export const getDoctorAccount = async (doctorId) => {
  const response = await api.get(`/doctor-settlements/doctor/${doctorId}/account`);
  return response.data;
};