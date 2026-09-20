import api from "./api";
 // operations
export const getOperations = async (params = {}) => {
 
  
  const response = await api.get("/operations", {
    params,
  });

  return response.data;
};

export const getOperation = async (id) => {
  const response = await api.get(`/operations/${id}`);

  return response.data;
};

export const createOperation = async (operationData) => {
   
    
  const response = await api.post(
    "/operations",
    operationData
  );

  return response.data;
};

export const updateOperation = async (id, operationData) => {
  const response = await api.put(
    `/operations/${id}`,
    operationData
  );

  return response.data;
};

export const cancelOperation = async (id) => {
  const response = await api.delete(
    `/operations/${id}`
  );

  return response.data;
};
export const completeOperation = async (id) => {
  const response = await api.patch(`/operations/${id}/complete`);
  return response.data;
};