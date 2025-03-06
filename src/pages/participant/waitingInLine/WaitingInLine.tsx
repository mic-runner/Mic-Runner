import "./WaitingInLine.css";

interface WaitingInLineProps {
  placeInLine: string;
}

const appendOrdinalIndicator = (num: string) => {
  const lastDigit = num[num.length - 1];
  switch (lastDigit) {
    case "1":
      num += "st";
      break;
    case "2":
      num += "nd";
      break;
    case "3":
      num += "rd";
      break;
    default:
      num += "th";
  }
  return num;
};

const WaitingInLine = (props: WaitingInLineProps) => {
  return (
    <div className="waiting-line-text-container">
      <h1 className="waiting-line-text-header">
        You are{" "}
        {props.placeInLine === "1" ? (
          <span className="next-in-line">next</span>
        ) : (
          appendOrdinalIndicator(props.placeInLine)
        )}{" "}
        in line to speak
      </h1>
      {props.placeInLine === "1" && (
        <h3 className="waiting-line-subtitle">Get ready!</h3>
      )}
    </div>
  );
};

export default WaitingInLine;
