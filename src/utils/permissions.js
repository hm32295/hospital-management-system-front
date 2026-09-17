import { ROLES } from "../constants/roles";

export const isAdmin = (user) => {
  return user?.role === ROLES.ADMIN;
};

export const isPharmacist = (user) => {
  return user?.role === ROLES.PHARMACIST;
};