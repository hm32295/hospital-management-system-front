import api from "./api";
const user = '/users'
const auth = '/auth'
// Login
export const loginUser = async (data) => {
  const response = await api.post(`${auth}/login`, data);
  return response.data;
};

// Register
export const registerUser = async (data) => {
  const response = await api.post(`${auth}/register`, data);
  return response.data;
};

// Get current user
export const getAllUsers = async (params ={}) => {
  
  const response = await api.get(`${user}/`,{params});
  return response.data;
};
export const getCurrentUser = async (userId) => {
  const response = await api.get(`${user}/${userId}`);
  return response.data;
};

// Update user
export const updateUser = async (userId, data) => {
  const response = await api.put(`${user}/${userId}`, data );
  return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
  console.log(userId);
  
  const response = await api.delete(`${user}/${userId}`);
  console.log(response);
  
  return response.data;
};