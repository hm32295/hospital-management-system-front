import api from "./api";

export const getCategory = async (params = {}) => {
  
  const response = await api.get("/medicine-categories", {params});

  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(
    `/medicine-categories/${id}`
  );

  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post(
    "/medicine-categories",
    data
  );

  return response.data;
};

export const updateCategory = async (
  id,
  data
) => {
  const response = await api.put(
    `/medicine-categories/${id}`,
    data
  );

  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(
    `/medicine-categories/${id}`
  );

  return response.data;
};