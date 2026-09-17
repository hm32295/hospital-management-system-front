import api from "./api";
const purchases ='/purchases'
export const getPurchases = async (params = {}) => {
  
  const response = await api.get(purchases, {params});

  return response.data;
};

export const getPurchasesById = async (id) => {
  const response = await api.get(
    `${purchases}/${id}`
  );

  return response.data;
};

export const createPurchases = async (data) => {
  console.log(data);
  
  const response = await api.post( purchases, data);

  return response.data;
};

export const updatePurchases = async (id,data) => {
  const response = await api.put( `${purchases}/${id}`,data );

  return response.data;
};
export const cancelPurchases = async (id) => {
  const response = await api.delete( `${purchases}/${id}/cancel` );

  return response.data;
};
export const confirmPurchases = async (id) => {
  console.log(id);
  
  const response = await api.patch( `${purchases}/${id}/confirm` );

  return response.data;
};

