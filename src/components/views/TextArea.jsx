import React, { useState } from "react";

const MAX_CHARS = 400;

const TextArea = () => {
  const [text, setText] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    const inputCharCount = inputText.length;
    if (inputCharCount > MAX_CHARS) {
      return;
    }
    setText(inputText);
    setCharCount(inputCharCount);
  };

  const inputStyle = {
    border: charCount > MAX_CHARS ? "2px solid red" : "",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (charCount > MAX_CHARS) {
      return;
    }
    // code for submitting form goes here
  };

  return (
    <>
    <label className="game input-label">Describe your image. {charCount}/{MAX_CHARS}</label>
      <textarea
        className= "game input-field"
        style={inputStyle}
        value={text}
        onChange={handleInputChange}
        placeholder="tweak your keywords to make it more fun! (max 400 characters)"
      />
    </>
    //   <p>
    //     Character Count: {charCount}/{MAX_CHARS}
    //   </p>
    //   <button type="submit">Submit</button>
  );
};

export default TextArea;
