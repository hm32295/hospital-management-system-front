import api from "./api";
const stock ='/stock'

export const getTransactions = async (params={}) => {
  const response = await api.get( `${stock}/transactions`, {params});
  return response.data;
};
export const getLowStock = async (params={}) => {
  const response = await api.get( `${stock}/low-stock`, {params});
  return response.data;
};
export const getExpiredBatches = async (params={}) => {
  const response = await api.get( `${stock}/expired`, {params});
  return response.data;
};
export const getOverview = async (params={}) => {
  const response = await api.get( `${stock}/overview`, {params});
  return response.data;
};
export const getExpiryBatches = async (params={}) => {
  const response = await api.get( `${stock}/expiry`, {params});
  return response.data;
};



