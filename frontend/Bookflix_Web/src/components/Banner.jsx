import PropTypes from "prop-types";
import classes from "./styles/Banner.module.css";

export default function Banner({ imageSrc, altText }) {
  return (
    <div className={classes.boxBanner}>
      <img src={imageSrc} alt={altText} />
    </div>
  );
}

Banner.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
};
