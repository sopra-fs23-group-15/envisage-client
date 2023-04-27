const ImageComponent = ({ url, image, onClick, selected }) => {
  return (
    <div
      className={`vote image-component ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {url ? (
        <img src={image} width={256} alt="" />
      ) : (
        <img src={`data:image/jpeg;base64,${image}`} alt="" />
      )}
      {/* {url ? <img src={`data:image/jpeg;base64,${image}`} /> : <img src={image} width={300} />} */}
    </div>
  );
};

export default ImageComponent;
