import {AlertInfo, DEFAULT_TIME} from "./Alert.tsx";
import {Context, createContext, useState} from "react";

interface Props {
    children: React.ReactNode;
}

interface Alerts {
    alerts: AlertInfo[];
    addAlert: (message: string) => void;
    deleteAlert: (alertId: string) => void;
}

const initialAlerts: Alerts = {
    alerts: [],
    addAlert: (message: string) => console.log(message),
    deleteAlert: (alertId: string) => console.log(alertId),
}

export const AlertContext: Context<Alerts> =
    createContext<Alerts>(initialAlerts);

const AlertProvider: React.FC<Props> = ({ children }) => {
    const [alertInfo, setAlertInfo] = useState<Alerts>(initialAlerts);

    const deleteAlert = (alertId: string) => {
        const {alerts} = alertInfo;
        const idx = alerts.findIndex((alert) => alert.alertId === alertId);

        alerts.splice(idx, 1);
        setAlertInfo({ ...alertInfo, ...alerts });
    }

    const addAlert = (message: string) => {
        const {alerts} = alertInfo;
        const alertId = crypto.randomUUID()
        const expire = Date.now() + DEFAULT_TIME

        const info: AlertInfo = {
            message: message,
            alertId: alertId,
            expireTime: expire,
        }

        alerts.push(info);

        setAlertInfo({ ...alertInfo, ...alerts });
    }


    return (
        <AlertContext.Provider
            value={{
                ...alertInfo,
                deleteAlert: deleteAlert,
                addAlert: addAlert
            }}>
            {children}
        </AlertContext.Provider>
    )
}

export default AlertProvider