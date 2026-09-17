import api from "./api";

export const getBatches = async (params = {}) => {
  
  const response = await api.get("/medicine-batches", {params});

  return response.data;
};

export const getBarCode = async (id) => {
  const response = await api.get(
    `/medicine-batches/${id}/barcode`
  );

  return response.data;
};
export const getBatchById = async (id) => {
  const response = await api.get(
    `/medicine-batches/${id}`
  );

  return response.data;
};

export const createBatch = async (data) => {
  const response = await api.post(
    "/medicine-batches",
    data
  );

  return response.data;
};

export const updateBatch = async (
  id,
  data
) => {
  const response = await api.put(
    `/medicine-batches/${id}`,
    data
  );

  return response.data;
};

export const deleteBatch = async (id) => {
  console.log(id);
  
  const response = await api.delete(
    `/medicine-batches/deactivate/${id}`
  );

  return response.data;
};