import PropTypes from "prop-types";
import styles from "./styles/button.module.css";

const Button = ({
  label,
  onClick = () => {},
  type = "button",
  styleType = "btnDefault",
  className = "",
}) => {
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

export default Button;