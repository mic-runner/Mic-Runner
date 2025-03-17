import { useState } from "react";
import "./TextSubmission.css";

interface TextSubmissionProps {
  textboxPlaceholder: string;
  buttonPlaceholder: string;
  textSubmissionHeader: string;
  onSubmitText: (text: string) => void;
}

// TODO:
// when the connection is closed, it navigates to the text submission place in line.

const TextSubmission: React.FC<TextSubmissionProps> = (props) => {
  const [text, setText] = useState("");



  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    // I am not a big fan of this alert, but it can be uncommented if desired
    // alert(`\nHey! you just typed: ${text}\n\nThis will eventually be sent to the presenter`);
    setText("");
    props.onSubmitText(text); 
  };

  return (
    <form className="text-form" onSubmit={handleSubmitText}>
      <h3 id="text-submission-header">{props.textSubmissionHeader}</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="text-input"
        placeholder={props.textboxPlaceholder}
      />
      <button type="submit" className="submit-btn">{props.buttonPlaceholder}</button>
    </form>
  );
};

export default TextSubmission;
