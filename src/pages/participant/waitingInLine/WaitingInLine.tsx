import { LinePositionValues } from "../../../utils/sharedConsts";
import "./WaitingInLine.css";

interface WaitingInLineProps {
  placeInLine: number;
}

const appendOrdinalIndicator = (num: number) => {
  let numString = num.toString();
  const lastDigit = num.toString().slice(-1); 
  switch (lastDigit) {
    case "1":
      numString += "st";
      break;
    case "2":
      numString += "nd";
      break;
    case "3":
      numString += "rd";
      break;
    default:
      numString += "th";
  }
  return numString;
};

const WaitingInLine = ({ placeInLine }: WaitingInLineProps) => {
  return (
    <div className="waiting-line-text-container">
      {placeInLine === LinePositionValues.FIRST_IN_LINE ? (
        <>
          <h1 className="waiting-line-text-header">
            You are <span className="next-in-line">next</span> in line to speak
          </h1>
          <h3 className="waiting-line-subtitle">Get ready!</h3>
        </>
      ) : (
        <h1 className="waiting-line-text-header">
          You are {appendOrdinalIndicator(placeInLine)} in line to speak
        </h1>
      )}
    </div>
  );
};

export default WaitingInLine;
