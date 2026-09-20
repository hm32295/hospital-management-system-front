
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../services/language.service";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = async (e) => {
    await changeLanguage(e.target.value);
  };

  return (
    <select
      className="form-select form-select-sm"
      value={i18n.language}
      onChange={handleChange}
      style={{ width: "100px" }}
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
    </select>
  );
};

export default LanguageSwitcher;
