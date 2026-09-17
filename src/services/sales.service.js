import api from "./api";

const sales = "/sales";

export const createSale = async (data) => {
  const response = await api.post(sales, data);
  return response.data;
};

export const createSaleFromPrescription = async (
  prescriptionId,
  saleData = {}
) => {
  const response = await api.post(
    `/sales/prescription/${prescriptionId}`,
    saleData
  );

  return response.data;
};
export const getAllSales = async (params = {}) => {
  const response = await api.get(sales, { params });
  return response.data;
};