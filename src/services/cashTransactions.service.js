import api from "./api";

export const getCashTransactions = async (params = {}) => {
  const response = await api.get("/cash-transactions", {
    params,
  });

  return response.data;
};

export const getCashTransactionSummary = async (params = {}) => {
  const response = await api.get("/cash-transactions/summary", {
    params,
  });

  return response.data;
};

export const getCashTransaction = async (id) => {
  const response = await api.get(`/cash-transactions/${id}`);

  return response.data;
};

export const getCashTransactionsByPayment = async (
  paymentId,
  params = {}
) => {
  const response = await api.get("/cash-transactions", {
    params: {
      ...params,
      payment: paymentId,
    },
  });

  return response.data;
};

export const getCashTransactionsByOperation = async (
  operationId,
  params = {}
) => {
  const response = await api.get("/cash-transactions", {
    params: {
      ...params,
      operation: operationId,
    },
  });

  return response.data;
};

export const getCashTransactionsByVisit = async (
  visitId,
  params = {}
) => {
  const response = await api.get("/cash-transactions", {
    params: {
      ...params,
      visit: visitId,
    },
  });

  return response.data;
};

export const getCashTransactionsBySale = async (
  saleId,
  params = {}
) => {
  const response = await api.get("/cash-transactions", {
    params: {
      ...params,
      sale: saleId,
    },
  });

  return response.data;
};

export const getCashTransactionsByPatient = async (
  patientId,
  params = {}
) => {
  const response = await api.get("/cash-transactions", {
    params: {
      ...params,
      patient: patientId,
    },
  });

  return response.data;
};