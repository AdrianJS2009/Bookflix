import PropTypes from "prop-types";
import styles from "./styles/Button.module.css";

const Button = ({ label, onClick, type, styleType, className }) => {
  return (
    <button
      className={`${styles.button} ${styles[styleType]} ${className}`}
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  styleType: PropTypes.string,
  className: PropTypes.string,
};

Button.defaultProps = {
  type: "button",
  onClick: () => {},
  styleType: "btnDefault",
  className: "",
};

export default Button;
