import React, { useState } from "react";

const MAX_CHARS = 50;

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
    <form onSubmit={handleSubmit}>
      <textarea
        style={inputStyle}
        value={text}
        onChange={handleInputChange}
        placeholder="Enter text (max 400 characters)"
      />
      <p>
        Character Count: {charCount}/{MAX_CHARS}
      </p>
      <button type="submit">Submit</button>
    </form>
  );
};

export default TextArea;
