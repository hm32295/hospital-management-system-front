import api from "./api";

const cashDrawer = "/cash-drawers";

export const openCashDrawer = async (data) => {
  const response = await api.post(`${cashDrawer}/open`, data);

  return response.data;
};

// Get current open drawer
export const getCurrentCashDrawer = async () => {
  const response = await api.get(`${cashDrawer}/current`);

  return response.data;
};

// Get all drawers
export const getAllCashDrawers = async (params = {}) => {
  const response = await api.get(cashDrawer, {
    params,
  });

  return response.data;
};

// Get single drawer
export const getSingleCashDrawer = async (id) => {
  const response = await api.get(`${cashDrawer}/${id}`);

  return response.data;
};

// Close drawer
export const closeCashDrawer = async (id, data) => {
  const response = await api.put(
    `${cashDrawer}/${id}/close`,
    data
  );

  return response.data;
};