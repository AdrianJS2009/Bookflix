import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles/Button.module.css'; // Importa el archivo CSS del botón

const Button = ({ label, onClick, type, styleType }) => {
  return (
    <button className={`${styles.button} ${styles[styleType]}`} onClick={onClick} type={type}>
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  styleType: PropTypes.string, // Define el estilo que quieres aplicar (por ejemplo, "btnComprar" o "btnAnadir")
};

Button.defaultProps = {
  type: 'button',
  onClick: () => {},
  styleType: 'btnDefault', // Valor por defecto del estilo
};

export default Button;
