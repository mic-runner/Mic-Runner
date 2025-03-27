import Alert, {AlertInfo} from "./Alert.tsx";
import useAlert from "./AlertHook.ts";
import {useEffect} from "react";
import "./Alerter.css"



const Alerter = () => {
    const { alerts, deleteAlert } = useAlert()

    function removeOldAlerts(alerts: AlertInfo[]) {
        const now = Date.now();

        for (const alert of alerts) {
            if (alert.expireTime > 0 && alert.expireTime < now) {
                deleteAlert(alert.alertId);
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (alerts.length) {
                removeOldAlerts(alerts);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [alerts])

    return (
        <div className="alerter">
            {alerts.map((alert, i) => (
                <Alert
                    key={i}
                    message={alert.message}
                    confirm={() => deleteAlert(alert.alertId)}
                />
            ))}
        </div>
    )


}

export default Alerter;