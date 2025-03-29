import { useContext, useState } from 'react';
import { UserContext } from '../../../components/UserContext';
import './TextSubmission.css';
import useAlert from "../../../components/Alerts/AlertHook.ts";

interface TextSubmissionProps {
  textboxPlaceholder: string;
  buttonPlaceholder: string;
  textSubmissionHeader: string;
  onSubmitText: (text: string, username: string) => void;
}

// TODO:
// when the connection is closed, it navigates to the text submission place in line.

const TextSubmission: React.FC<TextSubmissionProps> = props => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('JoinRoom must be used within a UserProvider');
  }
  const { username, setUsername } = userContext;

  const [user, setUser] = useState(username);
  const {addAlert} = useAlert();
  const [text, setText] = useState('');

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.trim()) {
      addAlert('Please enter your name');
      return;
    }
    setUsername(user);
    setText('');
    props.onSubmitText(text, user);
  };

  return (
    <form className="text-form" onSubmit={handleSubmitText}>
      {/* <h3 id="text-submission-header">{props.textSubmissionHeader}</h3> */}
      {username === '' && (
        <input
          value={user}
          onChange={e => setUser(e.target.value)}
          className="text-input"
          placeholder="What's your name?"
        />
      )}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="text-input"
        placeholder={props.textboxPlaceholder}
      />
      <button type="submit" className="submit-btn">
        {props.buttonPlaceholder}
      </button>
    </form>
  );
};

export default TextSubmission;
