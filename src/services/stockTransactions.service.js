import api from "./api";
const route = '/stock-transactions'
export const getStockTransaction = async (params = {}) => {
  
  const response = await api.get(route, {params});
  return response.data;
};


export const createStockTransaction = async (data) => {
  const response = await api.post(route,data );
  return response.data;
};

export const getSingleStockTransaction = async (id) => {

  const response = await api.get(`${route}/${id}` );
  return response.data;
};
