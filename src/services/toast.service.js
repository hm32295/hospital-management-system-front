
import { toast } from "react-toastify";

export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (message) => {
  toast.error(message);
};

export const showWarning = (message) => {
  toast.warning(message);
};

export const showInfo = (message) => {
  toast.info(message);
};

export const showLoading = (message = "Loading...") => {
  return toast.loading(message);
};

export const updateToast = (toastId, options) => {
  toast.update(toastId, options);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};
