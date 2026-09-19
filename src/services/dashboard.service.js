import api from "./api";

const dashboard = "/dashboard";

export const getDashboard = async (month) => {
  const response = await api.get(dashboard, {
    params: { month },
  });

  return response.data;
};