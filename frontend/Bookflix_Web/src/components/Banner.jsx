import PropTypes from "prop-types";

export default function Banner({ imageSrc, altText }) {
  return (
    <div className="box-banner">
      <img src={imageSrc} alt={altText} />
    </div>
  );
}

Banner.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
};
