import api from "./api";

export const createOperationPayment = async (paymentData) => {
  const response = await api.post(
    "/operation-payments",
    paymentData
  );

  return response.data;
};

export const getOperationPayments = async (operationId) => {
  const response = await api.get(
    `/operation-payments/operation/${operationId}`
  );

  return response.data;
};

export const getOperationPayment = async (id) => {
  const response = await api.get(
    `/operation-payments/${id}`
  );

  return response.data;
};