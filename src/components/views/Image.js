const ImageComponent = (props) => {
  return (
    <div
      className={`${props.className ?? ""} image-component ${props.selected ? "selected" : ""}`}
      onClick={props.onClick}
    >
      {props.url ? (
        <img src={props.image} alt="" />
      ) : (
        <img src={`data:image/jpeg;base64,${props.image}`} alt="" />
      )}
    </div>
  );
};

export default ImageComponent;
