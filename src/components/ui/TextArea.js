import React, { useState } from "react";

const MAX_CHARS = 400;

const TextArea = (props) => {
  const [text, setText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isOverLimit, setIsOverLimit] = useState(false);

  const handleInputChange = (e) => {
    props.func(e.target.value);
    const inputText = e.target.value;
    const inputCharCount = inputText.length;
    setText(inputText);
    setCharCount(inputCharCount);
    setIsOverLimit(charCount > MAX_CHARS);
  };

  const inputStyle = {
    border: isOverLimit ? "2px solid red" : "",
    color: isOverLimit ? "red" : "black",
  };

  return (
    <>
      <label className="game input-label">
        Describe your image {charCount}/{MAX_CHARS}
      </label>
      <textarea
        className="game input-field"
        style={inputStyle}
        value={text}
        onChange={handleInputChange}
        placeholder="tweak your keywords to make it more fun! (max 400 characters)"
      />
    </>
  );
};

export default TextArea;
