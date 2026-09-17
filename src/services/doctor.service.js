import api from "./api";

export const getDoctors = async ({
  search = "",
  specialty = "",
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get("/doctors", {
    params: {
      search,
      specialty,
      page,
      limit,
    },
  });

  return response.data;
};

export const getDoctor = async (id) => {
  const response = await api.get(`/doctors/${id}`);

  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await api.post("/doctors", doctorData);

  return response.data;
};

export const updateDoctor = async (id, doctorData) => {
  const response = await api.put(
    `/doctors/${id}`,
    doctorData
  );

  return response.data;
};

export const deactivateDoctor = async (id) => {
  const response = await api.delete(
    `/doctors/${id}`
  );

  return response.data;
};