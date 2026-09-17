import api from "./api";

export const getSpecialties = async ({
  search = "",
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get("/specialties", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data;
};

export const getSpecialty = async (id) => {
  const response = await api.get(`/specialties/${id}`);

  return response.data;
};

export const createSpecialty = async (specialtyData) => {
  const response = await api.post("/specialties", specialtyData);

  return response.data;
};

export const updateSpecialty = async (id, specialtyData) => {
  const response = await api.put(
    `/specialties/${id}`,
    specialtyData
  );

  return response.data;
};

export const deactivateSpecialty = async (id) => {
  const response = await api.delete(
    `/specialties/${id}`
  );

  return response.data;
};