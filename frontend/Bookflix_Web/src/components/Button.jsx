import PropTypes from "prop-types";
import styles from "./styles/Button.module.css"; // Importa el archivo CSS del botón

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
  styleType: PropTypes.string, // Define el estilo que quieres aplicar (por ejemplo, "btnComprar" o "btnAnadir")
  className: PropTypes.string,
};

Button.defaultProps = {
  type: "button",
  onClick: () => {},
  styleType: "btnDefault", // Valor por defecto del estilo
  className: "",
};

export default Button;
