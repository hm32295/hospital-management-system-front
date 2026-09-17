import api from "./api";

export const createVisit = async (visitData) => {
  const response = await api.post("/visits", visitData);

  return response.data;
};

export const getVisits = async ({
  patient = "",
  specialty = "",
  doctor = "",
  visitType = "",
  paymentStatus = "",
  status = "",
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get("/visits", {
    params: {
      patient,
      specialty,
      doctor,
      visitType,
      paymentStatus,
      status,
      page,
      limit,
    },
  });

  return response.data;
};

export const getVisit = async (id) => {
  const response = await api.get(`/visits/${id}`);

  return response.data;
};

export const updateVisitStatus = async (id, status) => {
  const response = await api.patch(
    `/visits/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};


