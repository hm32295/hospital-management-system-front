
import api from "./api";

const dispensing = "/dispensing";

export const getAllDispensing = async (params = {}) => {
  const response = await api.get(dispensing, {
    params,
  });

  return response.data;
};

export const getSingleDispensing = async (id) => {
  const response = await api.get(
    `${dispensing}/${id}`
  );

  return response.data;
};

export const getAvailableSalesForDispensing =
  async () => {
    const response = await api.get(
      `${dispensing}/available-sales`
    );

    return response.data;
  };

export const createDispensing = async (data) => {
  const response = await api.post(
    dispensing,
    data
  );

  return response.data;
};
