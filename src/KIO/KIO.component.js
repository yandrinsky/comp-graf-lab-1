import {useState} from "react";
import {cache} from "./cache";

export const KIO = ({children}) => {
    const [state, setState] = useState();

    // store.stateAndSetState = [state, setState];

    return children;
}