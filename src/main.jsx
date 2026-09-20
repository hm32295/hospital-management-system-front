import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const AppContainer = () => {
  const { i18n } = useTranslation();

  return (
    <>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        rtl={i18n.language === "ar"}
      />
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppContainer />
  </AuthProvider>
);
