

import {useState, useEffect } from "react";

export enum DeviceType {
    web,
    mobile
}

export function useDevice() {
    const [type, setType] = useState(DeviceType.web);

    // Run effect once
    useEffect(() => {
        const getDeviceType = () => {
            if (navigator.maxTouchPoints > 2)
                return DeviceType.mobile;
            else
                return DeviceType.web;
        }


        const deviceType: DeviceType = getDeviceType();
        setType(deviceType);
    }, [])

    return type
}