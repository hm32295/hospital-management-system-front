import api from "./api";

const expense = "/expenses";

export const createExpense = async (data) => {
  console.log('test');
  
  const response = await api.post(
    expense,
    data
  );

  return response.data;
};

export const getAllExpenses = async (
  params = {}
) => {
  
  const response = await api.get(
    expense,
    {
      params,
    }
  );

  return response.data;
};