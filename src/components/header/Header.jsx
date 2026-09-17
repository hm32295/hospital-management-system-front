import { useNavigate } from "react-router-dom";
import "./header.css";

const Header = ({
  title,
  description,
  buttonContent,
  buttonLink,
}) => {
  const navigate = useNavigate();

  const handleButtonClick = () => { 
    if (buttonLink) {
      navigate(buttonLink);
    }
  };

  return (
    <div className="header mb-4">
      <div className="d-flex flex-md-row justify-content-between align-items-center align-items-md-center gap-3">

        {/* Title */}
        <div>
          <h1 className="header-title mb-1 text-capitalize">
            {title}
          </h1>

          {description && (
            <p className="header-description mb-0">
              {description}
            </p>
          )}
        </div>

        {/* Action Button */}
        {buttonContent && buttonLink && (
          <button
            type="button"
            className="btn btn-primary text-capitalize d-flex align-items-center justify-content-center gap-2"
            onClick={handleButtonClick}
          >

            <span>
              {buttonContent}
            </span>
          </button>
        )}

      </div>
    </div>
  );
};

export default Header;