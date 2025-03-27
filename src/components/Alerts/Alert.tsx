
import "./Alerter.css"

export const DEFAULT_TIME = 5000;

export interface AlertInfo {
    alertId: string;
    message: string;
    expireTime: number;
}

export interface AlertProps {
    message: string;
    confirm: () => void;
}

const Alert = (props: AlertProps) => {

    return (
        <div className="alert">
            <div>
                {props.message}
            </div>
            <button className={"alert-btn"} onClick={props.confirm}>Ok</button>
        </div>
    )
}

export default Alert;