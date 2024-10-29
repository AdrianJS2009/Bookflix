import PropTypes from "prop-types";
import styles from "../styles/Banner.module.css";

export default function Banner({ imageSrc, altText }) {
  return (
    <div className={styles.boxBanner}>
      <img src={imageSrc} alt={altText} />
    </div>
  );
}

Banner.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
};
