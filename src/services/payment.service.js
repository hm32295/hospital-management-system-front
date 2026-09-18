
import api from "./api";

export const getAllPayments = async (params = {}) => {
  const response = await api.get("/payments", { params });
  return response.data;
};

export const getSinglePayment = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await api.post("/payments", paymentData);
  return response.data;
};

export const createVisitPayment = async (visitId, paymentData) => {
  const response = await api.post(
    `/payments/visit/${visitId}`,
    paymentData
  );
  return response.data;
};

export const createOperationPayment = async (paymentData) => {
  const response = await api.post(
    "/payments/operation",
    paymentData
  );
  return response.data;
};

export const getPayments = async ({
  sale = "",
  visit = "",
  operation = "",
  patient = "",
  status = "",
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get("/payments", {
    params: {
      sale,
      visit,
      operation,
      patient,
      status,
      page,
      limit,
    },
  });

  return response.data;
};

export const getPayment = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

export const getSalePayments = async (saleId) => {
  const response = await api.get(
    `/payments/sale/${saleId}`
  );
  return response.data;
};

export const getVisitPayments = async (visitId) => {
  const response = await api.get(
    `/payments/visit/${visitId}`
  );
  return response.data;
};

export const getOperationPayments = async (operationId) => {
  const response = await api.get(
    `/payments/operation/${operationId}`
  );
  return response.data;
};

export const getPatientPayments = async (patientId) => {
  const response = await api.get(
    `/payments/patient/${patientId}`
  );
  return response.data;
};