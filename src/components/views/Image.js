const ImageComponent = ({ url, image, onClick, selected }) => {
  return (
    <div
      className={`image-component ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {url ? (
        <img src={image} width={256} />
      ) : (
        <img src={`data:image/jpeg;base64,${image}`} />
      )}
      {/* {url ? <img src={`data:image/jpeg;base64,${image}`} /> : <img src={image} width={300} />} */}
    </div>
  );
};

export default ImageComponent;
