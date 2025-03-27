import {useContext} from "react";
import {AlertContext} from "./AlertProvider.tsx";


const useAlert = () => useContext(AlertContext);

export default useAlert;