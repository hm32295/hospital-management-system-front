import api from "./api";

const dashboard = "/dashboard";

export const getDashboard = async () => {
  const response = await api.get(dashboard);
  return response.data;
};